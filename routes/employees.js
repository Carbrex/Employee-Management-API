const express = require('express');
const router = express.Router();
const db = require('../db/db');
const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee } = require('../controllers/employees');

router.route('/').get(getAllEmployees).post(createEmployee);
router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
