const express = require('express');
const router = express.Router();
const {
    getLeaves,
    getMyLeaves,
    applyLeave,
    approveLeave,
    rejectLeave,
    getLeaveStats,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are protected
router.use(protect);

router.get('/stats', getLeaveStats);
router.get('/my-leaves', getMyLeaves);
router.get('/', getLeaves);
router.post('/', applyLeave);
router.put('/:id/approve', authorize('leave:approve'), approveLeave);
router.put('/:id/reject', authorize('leave:approve'), rejectLeave);

module.exports = router;
