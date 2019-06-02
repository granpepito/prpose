const express = require('express');
const db = require('../models/db');
const router = express.Router();

router
	.get('/all', function(req, res) {
		db.query('SELECT * from ??', ['themes'], (err, rows) => {
			if (err) {
				res.sendStatus(500);
			}
			res.json(rows);
		});
	})

	.get('/theme/:theme', (req, res) => {
		db.query(
			'SELECT * FROM ?? WHERE theme = ?',
			['themes', req.params.theme],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	})

	.get('/:theme/posts', (req, res) => {
		if (req.query.sort) {
			switch (req.query.sort) {
				case 'new':
					'SELECT ??.* FROM ??, ??, ?? ORDER BY ?? DESC, ?? DESC',
						[
							'posts',
							'posts',
							'post_theme',
							'themes',
							'posts.publication_hour',
							'posts.publication_date'
						],
						(err, rows) => {
							if (err) {
								res.sendStatus(500);
							}
							res.send(rows);
						};
					break;
				case 'best':
					db.query(
						'SELECT posts.*, u.positive, (t.total - u.positive) AS negative, ((u.positive + 1.9208) / (u.positive + (t.total - u.positive)) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (u.positive + (t.total - u.positive)) + 0.9604) / (u.positive + (t.total - u.positive))) / (1 + 3.8416 / (u.positive + (t.total - u.positive))) AS ci_lower_bound ' +
							'FROM (posts, post_theme, themes) ' +
							'INNER JOIN (SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id) u ON u.post_id = posts.post_id ' +
							'INNER JOIN (SELECT post_id, count(*) AS total from post_vote GROUP BY post_id) t ON t.post_id = posts.post_id ' +
							'WHERE  (u.positive + (t.total - u.positive) > 0) ' +
							'AND post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND post_theme.theme = ?' +
							'ORDER BY ci_lower_bound DESC, publication_date DESC;',
						[req.params.theme],
						(err, rows) => {
							if (err) {
								console.log(err);
								res.sendStatus(500);
							}
							res.send(rows);
						}
					);
					break;
				case 'top':
					db.query(
						'SELECT ??.*, u.positive, (t.total - u.positive) AS negative ' +
							'FROM (??, ??, ??) ' +
							'INNER JOIN (SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id) u ON u.post_id = posts.post_id ' +
							'INNER JOIN (SELECT post_id, count(*) AS total FROM post_vote GROUP BY post_id) t ON t.post_id = posts.post_id ' +
							'WHERE ?? = ?? AND ?? = ?? AND ?? = ? ' +
							'ORDER BY ?? DESC;',
						[
							'posts',
							'posts',
							'post_theme',
							'themes',
							'post_theme.post_id',
							'posts.post_id',
							'themes.theme',
							'post_theme.theme',
							'post_theme.theme',
							req.params.theme,
							'u.positive'
						],
						(err, rows) => {
							console.log(err);
							if (err) res.sendStatus(500);
							res.send(rows);
						}
					);
					break;
				default:
					res.sendStatus(500);
			}
		} else {
			res.sendStatus(500);
			// db.query(
			// 	'SELECT posts.* FROM ??, ??, ?? WHERE post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND post_theme.theme = ?',
			// 	['posts', 'post_theme', 'themes', req.params.theme],
			// 	(err, rows) => {
			// 		if (err) {
			// 			res.sendStatus(500);
			// 			res.end();
			// 		}
			// 		res.json(rows);
			// 	}
			// );
		}
	});

module.exports = router;
