const express = require('express');
const router = express.Router();
const { getAuditLogs, getAuditStats } = require('../controllers/auditController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are protected and require audit:view permission
router.use(protect);
router.use(authorize('audit:view'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);

module.exports = router;
