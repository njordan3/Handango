const db = require('./db');

const sharedSession = require("express-socket.io-session");
let { isLoggedIn, just2FAd } = require('./middleware');

module.exports = {
    initLessonRoutes: initLessonRoutes
}

function initLessonRoutes(app, session, io) {
    //share session variables with Express
    io.use(sharedSession(session, {
        autoSave: true
    }));

    io.on('connection', function(socket) {
        //check if logged in
        if (socket.handshake.session.passport) {
            socket.email = socket.handshake.session.passport.user.username;
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
                    .then(function() { socket.emit('complete-confirmation', `https://duohando.com/lesson${data.lesson}`); })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
            socket.on('quiz-complete', function(data) {
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
                    .then(function() { socket.emit('complete-confirmation', "https://duohando.com/dashboard"); })
                    .catch(function(err) {
                        console.log(err);
                    });
            });
        } else {
            console.log("Socket connection is not logged in");
        }
    });

    /////////////////////////////////////////////////////////////////////////
    app.get('/lesson1', isLoggedIn, just2FAd, function(req, res) {
        let lesson = req.session.passport.user.lessons[0];
        res.render(`lessons/lesson1/`, lesson);
    });
    app.get('/lesson1/lecture', isLoggedIn, just2FAd, function(req, res) {
        let lesson = req.session.passport.user.lessons[0];
        res.render(`lessons/lesson1/lecture`, lesson);
    });
    app.get('/lesson1/practice', isLoggedIn, just2FAd, function(req, res) {
        let lesson = req.session.passport.user.lessons[0];
        res.render(`lessons/lesson1/practice`, lesson);
    });
    app.get('/lesson1/quiz', isLoggedIn, just2FAd, function(req, res) {
        let lesson = req.session.passport.user.lessons[0];
        if (lesson.practice_complete == 1) {
            res.render(`lessons/lesson1/quiz`, lesson);
        } else {
            res.redirect(`/lesson1/practice`);
        }
    });
    ////////////////////////////////////////////////////////////////////////////////
    app.get('/lesson2', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[0].complete == 1) {
            let lesson = req.session.passport.user.lessons[1];
            res.render(`lessons/lesson2/`, lesson);
        } else {
            res.redirect('/lesson1');
        }
    });
    app.get('/lesson2/lecture', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[0].complete == 1) {
            let lesson = req.session.passport.user.lessons[1];
            res.render(`lessons/lesson2/lecture`, lesson);
        } else {
            res.redirect('/lesson1');
        }
    });
    app.get('/lesson2/practice', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[0].complete == 1) {
            let lesson = req.session.passport.user.lessons[1];
            res.render(`lessons/lesson2/practice`, lesson);
        } else {
            res.redirect('/lesson1');
        }
    });
    app.get('/lesson2/quiz', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[0].complete == 1) {
            let lesson = req.session.passport.user.lessons[1];
            if (lesson.practice_complete == 1) {
                res.render(`lessons/lesson2/quiz`, lesson);
            } else {
                res.redirect(`/lesson2/practice`);
            }
        } else {
            res.redirect('/lesson1');
        }
        
    });
    ////////////////////////////////////////////////////////////////////////
    app.get('/lesson3', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[1].complete == 1) {
            let lesson = req.session.passport.user.lessons[2];
            res.render(`lessons/lesson3/`, lesson);
        } else {
            res.redirect('/lesson2');
        }
    });
    app.get('/lesson3/lecture', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[1].complete == 1) {
            let lesson = req.session.passport.user.lessons[2];
            res.render(`lessons/lesson3/lecture`, lesson);
        } else {
            res.redirect('/lesson2');
        }
    });
    app.get('/lesson3/practice', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[1].complete == 1) {
            let lesson = req.session.passport.user.lessons[2];
            res.render(`lessons/lesson3/practice`, lesson);
        } else {
            res.redirect('/lesson2');
        }
    });
    app.get('/lesson3/quiz', isLoggedIn, just2FAd, function(req, res) {
        if (req.session.passport.user.lessons[1].complete == 1) {
            let lesson = req.session.passport.user.lessons[2];
            if (lesson.practice_complete == 1) {
                res.render(`lessons/lesson3/quiz`, lesson);
            } else {
                res.redirect(`/lesson3/practice`);
            }
        } else {
            res.redirect('/lesson2');
        }
        
    });
    ///////////////////////////////////////////////////////////////////////////
}