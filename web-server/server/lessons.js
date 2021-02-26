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
                db.setLectureProgress(socket.email, socket.id, data.slide, data.lesson)
                    .then(function(row) {
                        //update session variables
                        socket.handshake.session.passport.user.lessons[data.lesson-1].lecture_prog = row.lesson_lectprog.split(",")[data.lesson-1];
                        socket.handshake.session.save();
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('practice-progress', function(data) {
                db.setPracticeProgress(socket.email, socket.id, data.slide, data.lesson)
                    .then(function(row) {
                        //update session variables
                        socket.handshake.session.passport.user.lessons[data.lesson-1].practice_prog = row.lesson_practprog.split(",")[data.lesson-1];
                        socket.handshake.session.save();
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('practice-complete', function(data) {
                db.setPracticeComplete(socket.email, socket.id, data.lesson)
                    .then(function(row) {
                        //update session variables
                        socket.handshake.session.passport.user.lessons[data.lesson-1].practice_complete = row.lesson_practcomp.split(",")[data.lesson-1];
                        socket.handshake.session.save();
                        return Promise.resolve();
                    })
                    .then(function() { socket.emit('complete-confirmation'); })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('quiz-complete', function(data) {
                console.log(data.grade);
                db.setQuizComplete(socket.email, socket.id, data.lesson)
                    .then(function(row) {
                        //organize lessons into array of JSONs to update session variables because a new lesson was unlocked
                        let desc = row.lesson_desc.split(",");
                        let unlock_date = row.lesson_udate.split(",");
                        let lecture_prog = row.lesson_lectprog.split(",");
                        let practice_prog = row.lesson_practprog.split(",");
                        let practice_comp = row.lesson_practcomp.split(",");
                        let complete = row.lesson_complete.split(",");
                        let lessons = [];
                        for (let i = 0; i < desc.length; i++) { 
                            lessons[i] = { 
                                desc: desc[i], unlock_date: unlock_date[i],
                                lecture_prog: lecture_prog[i], practice_prog: practice_prog[i],
                                practice_complete: practice_comp[i], complete: complete[i]
                            };
                        }
                        socket.handshake.session.passport.user.lessons = lessons;
                        socket.handshake.session.save();

                        return Promise.resolve();                        
                    })
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
        } else {
            console.log("Socket connection is not logged in");
        }
    });
}

function initLessonRoutes(app) {
    app.post('/is-lesson-unlocked', isLoggedIn, function(req, res) {
        let msg = {};
        if (!req.session.passport) {    //check login status
            msg = {
                loggedIn: false,
                unlocked: false,
                message: "Login to unlock this lesson."
            };
        } else {
            msg.loggedIn = true;
            let {num, type} = req.body;
            let lessons = req.session.passport.user.lessons;
            if (lessons[num-1] !== undefined) {   //if logged in, check if lesson is unlocked
                if (type === 'quiz') {   //if it's a quiz, check if the practice is complete
                    if (lessons[num-1].practice_complete == 1) {
                        msg.unlocked = true;
                        msg.lesson = lessonData[num-1].quiz;
                    } else {
                        msg.unlocked = false;
                        msg.message = "Finish this lesson's practice to unlock the quiz.";
                    }
                } else {
                    msg.unlocked = true;
                    msg.lesson = lessonData[num-1][type];
                    msg.slide = lessons[num-1][`${type}_prog`];
                }
            } else {
                msg.unlocked = false;
                msg.message = "Finish the prior lesson's quiz to unlock this lesson.";
            }
            
        }
        res.json(msg);
    });
}

let lessonData = [
    {
        practice: [ //==========[PRACTICE 1]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
                }
            ]},
        ],
        quiz: [ //==========[QUIZ 1]==========
            {type: "Webcam", phrases: "G"},
            {type: "DragDrop", phrases: ["J", "B", "Z"]},
            {type: "FingerSpellingInterp", phrases: ["food", "drink", "napkin"]},
            {type: "FingerSpelling", phrases: ["food", "drink", "napkin"]},
            {type: "MultipleChoice", phrases: [
                {
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
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
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
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
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
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
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
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
                    question: "Question 1?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 1
                },
                {
                    question: "Question 2?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 3
                },
                {
                    question: "Question 3?",
                    choices:    [
                        "Choice 1",
                        "Choice 2",
                        "Choice 3",
                        "Choice 4",
                    ],
                    correct: 0
                }
            ]},
        ]
    }
];