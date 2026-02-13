const express = require('express');
const router = express.Router();
const {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are protected
router.use(protect);

router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', authorize('department:create'), createDepartment);
router.put('/:id', authorize('department:edit'), updateDepartment);
router.delete('/:id', authorize('department:delete'), deleteDepartment);

module.exports = router;
