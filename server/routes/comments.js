const express = require('express');
const db = require('../database/db');
const router = express.Router();

//TODO: regler le probleme de session (il faut que ca soit bien l'utlisateur connecté qui puisse faire ca)

router.get('/comments', (req, res) => {
    db.query('SELECT * FROM ??',
    ['comments'], (err, rows) => {
        if (err){
            res.sendStatus(500);
            res.end()
        }
        res.json(rows)
    })
});

// router.get('/comments/post/:postID', (req, res) =>{
//     console.log('method ', req.method);
//     console.log('path: ', req.route.path);
//     console.log('query: ', req.query);
//     db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.post_id = ?', 
//     ['comments', 'posts', req.params.postID], function(err, rows){
//         if (err){
//             res.sendStatus(500);
//             res.end()
//         }
//         res.json(rows)
//     })
// })


router.route('/comment/:commentID')
    .get((req, res) => {
        db.query('SELECT * FROM ?? WHERE comment_id = ?',
            ['comments', req.params.commentID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
    })
    //Pour simplifier, pour l'instant on ne peut pas modifier les commentaires.
    // .put((req, res) => {
    //     const method = req.method; const routePath = req.route.path; const query = req.query;
    //     console.log({ method, routePath, query });
    //     db.query('UPDATE ?? SET ?? = ? WHERE comment_id = ?',
    //         ['comments', 'content', req.body.commentContent, req.params.commentID], (err, rows) => {
    //             if (err) {
    //                 res.sendStatus(500);
    //                 res.end()
    //             }
    //             res.json(rows)
    //         })
    // })
    .delete((req, res) => {
        db.query('DELETE FROM ?? WHERE comment_id = ?',
            ['comments', req.params.commentID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.send(rows)
            })
    });


//getCommentChildren
// router.get('comment/:commentID/comments', (req, res) => {
//     db.query('',
//     [], (err, rows) => {

//     })
// })


router.get('comment/:commentID/upvotes', (req, res) => {
    db.query('SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 1',
        ['comments', 'comment_vote', req.params.commentID], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

.get('comment/:commentID/downvotes', (req, res) => {
    db.query('SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 0',
        ['comments', 'comment_vote', req.params.commentID], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

.post('comment/:commentID/upvote', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query('INSERT INTO comment_vote(??, ??, ??) VALUES (?, ?, ?)',
            ['upvote', 'username', 'comment_id', 1, req.session.username, req.params.commentID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end;
                }
                res.send(rows)
            })
    }
    else {
        res.sendStatus(401)
    }
})

.post('comment/:commentID/downvote', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query('INSERT INTO comment_vote(??, ??, ??) VALUES (?, ?, ?)',
            ['upvote', 'username', 'comment_id', 0, req.session.username, req.params.commentID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end;
                }
                res.send(rows)
            })
    }
    else {
        res.sendStatus(401)
    }
})


router.post('/newComment', (req, res) => {
    if (req.session.isLoggedIn){
        db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
            ['comments', 'username', 'post_id', 'content', req.body.loggedUser, req.body.commentPost, req.body.commentContent], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                console.log('commentID créé', rows.insertID)
                res.send(rows)
            })
    }
    else {
        res.sendStatus(401)
    }
})

router.post('/:commentID/newChildComment', (req, res) => {
    if (req.session.isLoggedIn){

    }
    db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
        ['comments', 'username', 'post_id', 'comment_id_parent', 'content', req.session.username, req.body.commentPost, req.body.commentParent ,req.body.commentContent], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            console.log('commentID créé', rows.insertID)
            res.send(rows)
        })
})

module.exports = router;