const db = require('./db');

const sharedSession = require("express-socket.io-session");
let { isLoggedIn, just2FAd } = require('./middleware');

module.exports = {
    initLessonRoutes: initLessonRoutes,
    initSocketIO: initSocketIO
}

function initSocketIO(session, io) {
    //share session variables with Express
    io.use(sharedSession(session, {
        autoSave: true
    }));

    io.on('connection', function(socket) {
        //check if logged in
        if (socket.handshake.session.passport) {
            socket.email = socket.handshake.session.passport.user.email;
            socket.id = socket.handshake.session.passport.user.id;
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
                console.log(data.grade);
                db.setQuizComplete(socket.email, socket.ext_id, data.lesson)
                    .then(function() { socket.emit('complete-confirmation'); })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('asl-frame', function(data) {
                //maybe use bitmap or other file formats instead of jpeg?
                //maybe compress the data before sending and test the model confidence with and without compression?
                //BLOB = BINARY LARGE OBJECT
                console.log(data);
            });
            socket.on('update-answer', function(data) {
                db.setPracticeAnswer(data.practice_id, data.id, `{"answers": ${JSON.stringify(data.answers)}}`, data.type)
                    .then(function() {
                        console.log("answer updated");
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
        } else {
            console.log("Socket connection is not logged in");
        }
    });
    /*
    db.getUserLessons(402, 1)
            .then(function(lesson) {     
                let lessonDetails = lesson.shift();
                let lectureDetails = lessonDetails.PID.split('-');
                let practiceDetails = lessonDetails.answers.split('-');
                let quizDetails = lessonDetails.phrases;
                let lessonData = getLessonData(lesson);
            })
            .catch(function(err) {
                console.log(err);
            })
    */
}

function initLessonRoutes(app) {
    app.post('/is-lesson-unlocked', isLoggedIn, function(req, res) {
        let {num, type} = req.body;
        let msg = {loggedIn: true};
        db.getUserLessons(req.session.passport.user.id, num)
            .then(function(lesson) {
                let lessonDetails = lesson.shift();
                let lectureDetails = lessonDetails.PID.split('-');
                let practiceDetails = lessonDetails.answers.split('-');
                let quizDetails = lessonDetails.phrases;
                let lessonData = getLessonData(lesson);
                if (lesson != undefined) {
                    switch(type) {
                        case "lecture":
                            msg.unlocked = true;
                            msg.slide = lectureDetails[1];
                            msg.desc = lectureDetails[0];
                            break;
                        case "practice": {
                            msg.unlocked = true;
                            msg.lesson = lessonData;
                            msg.slide = practiceDetails[1];
                            break;
                        }
                        case "quiz": {
                            if (practiceDetails[2] == 1) {
                                msg.unlocked = true;
                                //msg.lesson = lessonData[0].quiz;
                            } else {
                                msg.unlocked = false;
                                msg.message = "Finish this lesson's practice to unlock the quiz.";
                            }
                            break;
                        }
                    }
                } else {
                    msg.unlocked = false;
                    msg.message = "Finish the prior lesson's quiz to unlock this lesson.";
                }
                res.json(msg);
            })
            .catch(function(err) {
                console.log(err);
                res.json(err);
            });
    });
}


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
            if (i % 2 === 0) sqlJSON[i] = `${sqlJSON[i]}${end}`;
            else sqlJSON[i] = `${start}${sqlJSON[i]}`;
            result.push(JSON.parse(sqlJSON[i]))
        }
    } else if (sqlJSON.search(' | ') > 0) {
        sqlJSON = sqlJSON.split(' | ');
        for (let i = 0; i < sqlJSON.length; i++) {
            let temp1 = sqlJSON[i].split('-');
            let temp2 = JSON.parse(temp1[0]);            
            temp2.id = temp1[1];
            result.push(temp2);
        }
    } else {
        let temp = [sqlJSON];
        sqlJSON = temp;
        for (let i = 0; i < sqlJSON.length; i++) {
            if (i % 2 === 0) sqlJSON[i] = `${sqlJSON[i]}${end}`;
            else sqlJSON[i] = `${start}${sqlJSON[i]}`;
            result.push(JSON.parse(sqlJSON[i]))
        }
    }
    return result;
}

function combinePhraseAnswer(phrases, answers) {
    let combined = [];
    phrases = parseSQLJSON(phrases);
    answers = parseSQLJSON(answers);
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
    for (let i = 0 ; i < lesson.length; i++) {
        //console.log(lesson[i]);
        temp.push(combinePhraseAnswer(lesson[i].phrases, lesson[i].answers));
    }
    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].length; j++) {
            temp[i][j].practice_id = lesson[0].PID;
            result.push(temp[i][j]);
        }
    }
    
    return result;
}

/*
let lessonData = [
    {
        practice: [ //==========[PRACTICE 1]==========
            {"type": "Webcam", "phrases": "G"},
            {"type": "DragDrop", "phrases": ["J", "B", "Z"]},
            {"type": "FingerSpellingInterp", "phrases": ["food", "drink", "napkin"]},
            {"type": "FingerSpelling", "phrases": ["food", "drink", "napkin"]},
            {"type": "MultipleChoice", "phrases": [{"question": "Question 1?", "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"], "correct": 1}, {"question": "Question 2?", "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"], "correct": 3}, {"question": "Question 3?", "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"], "correct": 0}]},
        ],
        quiz: [ //==========[QUIZ 1]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    "question": "Question 1?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 1
                },
                {
                    "question": "Question 2?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 3
                },
                {
                    "question": "Question 3?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 0
                }
            ]},
        ]
    },
    {
        practice: [ //==========[PRACTICE 2]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    "question": "Question 1?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 1
                },
                {
                    "question": "Question 2?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 3
                },
                {
                    "question": "Question 3?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 0
                }
            ]},
        ],
        quiz: [ //==========[QUIZ 2]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    "question": "Question 1?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 1
                },
                {
                    "question": "Question 2?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 3
                },
                {
                    "question": "Question 3?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 0
                }
            ]},
        ]
    },
    {
        practice: [ //==========[PRACTICE 3]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    "question": "Question 1?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 1
                },
                {
                    "question": "Question 2?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 3
                },
                {
                    "question": "Question 3?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 0
                }
            ]},
        ],
        quiz: [ //==========[QUIZ 3]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    "question": "Question 1?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 1
                },
                {
                    "question": "Question 2?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 3
                },
                {
                    "question": "Question 3?",
                    "choices":    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    "correct": 0
                }
            ]},
        ]
    }
];
*/