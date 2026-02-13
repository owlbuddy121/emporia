const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getDashboardStats,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are protected
router.use(protect);

// Dashboard stats
router.get('/stats/dashboard', getDashboardStats);

// Employee CRUD
router.get('/', authorize('employee:view'), getEmployees);
router.get('/:id', getEmployee);
router.post('/', authorize('employee:create'), createEmployee);
router.put('/:id', authorize('employee:edit'), updateEmployee);
router.delete('/:id', authorize('employee:delete'), deleteEmployee);

module.exports = router;
