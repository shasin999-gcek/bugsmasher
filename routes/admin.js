var express = require('express');
var router = express.Router();

var adminHandlers = require('app/controllers/adminController');
const auth = adminHandlers.auth_middleware;


router.get('/', (req, res) => res.redirect('/admin/setup'));

router.get('/setup', adminHandlers.check_admin_already_created, adminHandlers.init_setup);

router.get('/dashboard', auth, adminHandlers.admin_dashboard);

router.route('/add-questions')
			.get(auth, adminHandlers.add_questions_page)
			.post(auth, adminHandlers.upload.single('program_file'), adminHandlers.add_questions);

router.post('/question/delete', auth, adminHandlers.delete_question);
router.post('/question/view', auth, adminHandlers.view_question);

router.get('/logout', auth, adminHandlers.logout);

router.route('/login')
			.get(adminHandlers.login_page)
			.post(adminHandlers.login);

router.post('/create-admin', adminHandlers.create_admin);



module.exports = router;
