var express = require('express');
var router = express.Router();

var adminHandlers = require('app/controllers/adminController');
const auth = adminHandlers.auth_middleware;


router.get('/', (req, res) => res.redirect('/admin/login'));

router.get('/setup', adminHandlers.check_admin_already_created, adminHandlers.init_setup);

router.get('/dashboard', auth, adminHandlers.admin_dashboard);

router.get('/leaderboard', auth, adminHandlers.leaderboard_page);
router.get('/leaderboard/:teamName', auth, adminHandlers.show_result);
router.get('/leaderboard/:teamName/:level/download', auth, adminHandlers.download_program);

router.route('/add-questions')
			.get(auth, adminHandlers.add_questions_page)
			.post(auth, adminHandlers.add_questions);

router.route('/settings')
	  .get(auth, adminHandlers.settings_page)
	  .post(auth, adminHandlers.settings);

router.post('/team/remove', auth, adminHandlers.remove_team);
router.post('/question/delete', auth, adminHandlers.delete_question);
router.post('/question/view', auth, adminHandlers.view_question);

router.get('/logout', auth, adminHandlers.logout);

router.route('/login')
			.get(adminHandlers.login_page)
			.post(adminHandlers.login);

router.post('/create-admin', adminHandlers.create_admin);



module.exports = router;
