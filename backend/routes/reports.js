const express = require('express');
const router = express.Router();
const {
    getEmployeeReport,
    getDepartmentReport,
    getLeaveReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All report routes require report:view permission
router.use(protect);
router.use(authorize('report:view'));

router.get('/employees', getEmployeeReport);
router.get('/departments', getDepartmentReport);
router.get('/leaves', getLeaveReport);

module.exports = router;
