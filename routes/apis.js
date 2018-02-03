var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var teamHandlers = require('app/controllers/teamController');

/* POST apis listing. */
router.post('/register', teamHandlers.register);
router.post('/login', teamHandlers.login);
router.post('/language', teamHandlers.loginRequired, teamHandlers.set_language);
router.post('/code', teamHandlers.loginRequired, teamHandlers.submit_code);

/* GET apis listing. */
router.get('/', teamHandlers.loginRequired, (req, res) => res.send(req.team));
router.get('/questions', teamHandlers.loginRequired, teamHandlers.get_questions);
router.get('/settings', teamHandlers.loginRequired, teamHandlers.get_settings);
router.get('/view/language', teamHandlers.loginRequired, teamHandlers.get_lang_info);
router.get('/check/login', teamHandlers.loginRequired, (req, res) => res.json(req.team));
router.get('/finished', teamHandlers.loginRequired, teamHandlers.competition_finished);

router.get('/check/:env', (req, res) => {
	res.send(req.app.get(req.params.env));
})

module.exports = router;
