const db = require('./db');
const tf = require('@tensorflow/tfjs-node');

const sharedSession = require("express-socket.io-session");
let { isLoggedIn, just2FAd } = require('./middleware');

const quizTime = 10;    //minutes

module.exports = {
    initLessonRoutes: initLessonRoutes,
    initSocketIO: initSocketIO
}

function initSocketIO(session, io) {
    //initialize ASL model
    var model, mobilenet, cutoffLayer, truncatedModel, loaded = false;
    tf.loadLayersModel(`file://server/tensorflow/transfer/model/model.json`)
        .then((m) => {
            model = m;
            return tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        })
        .then((m) => {
            mobilenet = m;
            cutoffLayer = mobilenet.getLayer('conv_pw_13_relu');
            truncatedModel = tf.model({ inputs: mobilenet.inputs, outputs: cutoffLayer.output });
            loaded = true;
            console.log("ASL Model Loaded");
        })
        .catch((e) => {
            console.log(e);
        })
    

    // Convert the image to a tensor for prediction
    function readImage(imageBuffer) {
        return tf.tidy(() => {
            const tfimage = tf.node.decodeImage(imageBuffer);
            return tfimage.resizeBilinear([224, 224])
                .expandDims()
                .toFloat()
                .div(127)
                .sub(1);
        });
    }

    //share session variables with Express
    io.use(sharedSession(session, {
        autoSave: true
    }));

    io.on('connection', function(socket) {
        //check if logged in
        if (socket.handshake.session.passport) {
            socket.email = socket.handshake.session.passport.user.email;
            socket.ext_id = socket.handshake.session.passport.user.ext_id;
            socket.on('lecture-progress', function(data) {
                db.setLectureProgress(socket.email, socket.ext_id, data.slide, data.lesson)
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('practice-progress', function(data) {
                db.setPracticeProgress(socket.email, socket.ext_id, data.slide, data.lesson)
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('practice-complete', function(data) {
                db.setPracticeComplete(socket.email, socket.ext_id, data.lesson)
                    .then(function() { socket.emit('complete-confirmation'); })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('quiz-complete', function(data) {
                let grade = Math.floor((data.grade.answers_correct/data.grade.answers_count)*100)
                let score = Math.floor(grade*100 * (quizTime+(data.time.min+(data.time.sec/60)))/quizTime)
                let sendData = {
                    score: score,
                    answers_count: data.grade.answers_count,
                    answers_correct: data.grade.answers_correct,
                    passed: (grade >= 70.0)
                };
                
                db.setQuizInfo(socket.email, socket.ext_id, data.lesson, grade, score, JSON.stringify(data.time))
                    .then(function() { 
                        socket.emit('complete-confirmation', sendData); 
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
                
            });

            socket.on('asl-frame', function(data) {
                if (loaded) {
                    const TARGET_CLASSES = ["A", "B", "C", "D", "E", "F", "Nothing"];
                    const img = readImage(data.image);
                    const activation = truncatedModel.predict(img);
                    const prediction = model.predict(activation).dataSync();
                    let top = Array.from(prediction)
                        .map(function (p, i) {
                            return {
                                probability: p,
                                className: TARGET_CLASSES[i]
                            };
                        }).sort(function (a, b) {
                            return b.probability - a.probability;
                        }).slice(0, 1);
                    console.log(top)
                    socket.emit('asl-prediction', {letter: top[0].className, certainty: top[0].probability});
                    //save result in database
                    if (data.type !== null && data.id !== null && data.practice_id !== null) {
                        db.setPracticeAnswer(data.practice_id, data.id, `{"answers": ${JSON.stringify({letter: top[0].className, certainty: top[0].probability})}}`, data.type)
                            .then(function() {
                                //console.log("answer updated");
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                }
            });

            socket.on('update-answer', function(data) {
                db.setPracticeAnswer(data.practice_id, data.id, `{"answers": ${JSON.stringify(data.answers)}}`, data.type)
                    .then(function() {
                        //console.log("answer updated");
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
        } else {
            console.log("Socket connection is not logged in");
        }
    });
}

function initLessonRoutes(app) {
    app.post('/is-lesson-unlocked', isLoggedIn, function(req, res) {
        let {num, type} = req.body;
        let msg = {loggedIn: true};
        db.getUserLesson(req.session.passport.user.id, num)
            .then(function(lesson) {
                let lessonDetails = lesson.shift();
                if (lesson != undefined && lesson.length > 0) {
                    let lectureDetails = lessonDetails.PID.split('-');
                    let practiceDetails = lessonDetails.answers.split('-');
                    let quizDetails = lessonDetails.phrases;
                    let lessonData = getLessonData(lesson);
                    switch(type) {
                        case "lecture":
                            msg.unlocked = true;
                            msg.slide = lectureDetails[1];
                            msg.desc = lectureDetails[0];
                            res.json(msg);
                            break;
                        case "practice": {
                            msg.unlocked = true;
                            msg.lesson = lessonData;
                            msg.slide = practiceDetails[1];
                            res.json(msg);
                            break;
                        }
                        case "quiz": {
                            if (practiceDetails[2] == 1) {
                                db.getRandomQuiz(num)
                                    .then(function(quiz) {
                                        let questions = [];
                                        for (let i = 0; i < quiz.length; i++) {
                                            questions.push(quiz[i].phrases);
                                        }
                                        msg.unlocked = true;
                                        msg.lesson = questions;
                                        msg.time = quizTime;
                                        res.json(msg);
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                        msg.unlocked = false;
                                        msg.message = err;
                                        res.json(msg);
                                    });
                            } else {
                                msg.unlocked = false;
                                msg.message = "Finish this lesson's practice to unlock the quiz.";
                                res.json(msg);
                            }
                            break;
                        }
                    }
                } else {
                    msg.unlocked = false;
                    msg.message = "Finish the prior lesson's quiz to unlock this lesson.";
                    res.json(msg);
                }
                
            })
            .catch(function(err) {
                console.log(err);
                res.json(err);
            });
    });
}


//parsing is specific to how data is formatted in the MySQL procedure
function parseSQLJSON(sqlJSON) {
    let result = [];
    let start = "";
    let end = "";
    if (sqlJSON === null) {
        return null;
    } else if (sqlJSON.search('},{') > 0) {
        sqlJSON = sqlJSON.split('},{');
        start = "{";
        end = "}";
        
        for (let i = 0; i < sqlJSON.length; i++) {
            if (i === 0) sqlJSON[i] = `${sqlJSON[i]}${end}`;
            else if (i > 0 && i+1 < sqlJSON.length) sqlJSON[i] = `${start}${sqlJSON[i]}${end}`;
            else sqlJSON[i] = `${start}${sqlJSON[i]}`;
            result.push(JSON.parse(sqlJSON[i]))
        }
    } else if (sqlJSON.search(' | ') > 0) {
        sqlJSON = sqlJSON.split(' | ');
        for (let i = 0; i < sqlJSON.length; i++) {
            let temp1 = sqlJSON[i].split('--');
            let temp2 = JSON.parse(temp1[0]);            
            temp2.id = temp1[1];
            result.push(temp2);
        }
    } else {
        let temp = [sqlJSON];
        sqlJSON = temp;
        for (let i = 0; i < sqlJSON.length; i++) {
            if (i === 0) sqlJSON[i] = `${sqlJSON[i]}${end}`;
            else if (i > 0 && i+1 < sqlJSON.length) sqlJSON[i] = `${start}${sqlJSON[i]}${end}`;
            else sqlJSON[i] = `${start}${sqlJSON[i]}`;
            result.push(JSON.parse(sqlJSON[i]))
        }
    }
    return result;
}

function combinePhraseAnswer(phrases, answers) {
    let combined = [];
    //parse question phrases and question answers seperately
    phrases = parseSQLJSON(phrases);
    answers = parseSQLJSON(answers);
    //combine qestion phrases and question answers
    for (let i = 0; i < phrases.length; i++) {
        combined[i] = phrases[i];
        if (answers !== null)
            combined[i].answers = answers[i].answers;
        else
            combined[i].answers = null;
        combined[i].id = phrases[i].id;
    }
    return combined;
}

function getLessonData(lesson) {
    let temp = [];
    let result = [];
    //combine the phrases and answers into one JSON
    for (let i = 0 ; i < lesson.length; i++) {
        if (lesson[i].phrases && lesson[i].answers)
            temp.push(combinePhraseAnswer(lesson[i].phrases, lesson[i].answers));
    }
    //attach practice id to the before returning
    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
            temp[i][j].practice_id = lesson[i].PID;
            result.push(temp[i][j]);
        }
    }
    
    return result;
}