const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are protected
router.use(protect);

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', authorize('role:create'), createRole);
router.put('/:id', authorize('role:edit'), updateRole);
router.delete('/:id', authorize('role:delete'), deletRole);

module.exports = router;
