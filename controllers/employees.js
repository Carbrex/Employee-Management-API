const db = require('../db/db');
const { BadRequestError } = require('../errors/errors');

// Get all employees
const getAllEmployees = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
        SELECT employees.*, contacts.phone_number, contacts.email, contacts.address, contacts.city, contacts.state,
            emergency_contacts.name AS emergency_contact_name, emergency_contacts.phone_number AS emergency_contact_phone,
            emergency_contacts.relationship
        FROM employees
        LEFT JOIN contacts ON employees.id = contacts.employee_id
        LEFT JOIN emergency_contacts ON employees.id = emergency_contacts.employee_id
        LIMIT ? OFFSET ?
    `;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(results);
    });
};

// Get a specific employee by ID
const getEmployeeById = async (req, res) => {
    const employeeId = req.params.id;

    const query = `
        SELECT employees.*, contacts.phone_number, contacts.email, contacts.address, contacts.city, contacts.state,
            emergency_contacts.name AS emergency_contact_name, emergency_contacts.phone_number AS emergency_contact_phone,
            emergency_contacts.relationship
        FROM employees
        LEFT JOIN contacts ON employees.id = contacts.employee_id
        LEFT JOIN emergency_contacts ON employees.id = emergency_contacts.employee_id
        WHERE employees.id = ?
    `;

    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(results[0]);
    });
};


// Create a new employee
const createEmployee = async (req, res) => {
    const { name, designation, dateOfBirth, salary, phone, email, address, city, state, emergencyName, emergencyPhone, relationship } = req.body;

    const newEmployee = { name, designation, date_of_birth: dateOfBirth, salary };
    const newContact = { phone_number: phone, email, address, city, state };
    const newEmergencyContact = { name: emergencyName, phone_number: emergencyPhone, relationship };

    if (name === undefined || designation === undefined || dateOfBirth === undefined || salary === undefined) {
        throw new BadRequestError('Name, designation, dateOfBirth or salary field cannot be empty');
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        db.query('INSERT INTO employees SET ?', newEmployee, (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            }
            const employeeId = result.insertId;

            newContact.employee_id = employeeId;
            db.query('INSERT INTO contacts SET ?', newContact, (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error(err);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                }

                newEmergencyContact.employee_id = employeeId;
                db.query('INSERT INTO emergency_contacts SET ?', newEmergencyContact, (err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error(err);
                            return res.status(500).json({ message: 'Internal server error' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                console.error(err);
                                return res.status(500).json({ message: 'Internal server error' });
                            });
                        }
                        res.status(201).json({ message: 'Employee created successfully', id: employeeId });
                    });
                });
            });
        });
    });
};


// Update an existing employee
const updateEmployee = async (req, res) => {
    const employeeId = req.params.id;
    const { name, designation, dateOfBirth, salary, phone, email, address, city, state, emergencyName, emergencyPhone, relationship } = req.body;

    const updatedEmployee = { name, designation, date_of_birth: dateOfBirth, salary };
    const updatedContact = { phone_number: phone, email, address, city, state };
    const updatedEmergencyContact = { name: emergencyName, phone_number: emergencyPhone, relationship };

    if (name === undefined || designation === undefined || dateOfBirth === undefined || salary === undefined) {
        throw new BadRequestError('Name, designation, dateOfBirth or salary field cannot be empty');
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        db.query('UPDATE employees SET ? WHERE id = ?', [updatedEmployee, employeeId], (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            db.query('UPDATE contacts SET ? WHERE employee_id = ?', [updatedContact, employeeId], (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error(err);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                }

                db.query('UPDATE emergency_contacts SET ? WHERE employee_id = ?', [updatedEmergencyContact, employeeId], (err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error(err);
                            return res.status(500).json({ message: 'Internal server error' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                console.error(err);
                                return res.status(500).json({ message: 'Internal server error' });
                            });
                        }
                        res.json({ message: 'Employee updated successfully' });
                    });
                });
            });
        });
    });
};


// Delete an employee
const deleteEmployee = async (req, res) => {
    const employeeId = req.params.id;

    db.beginTransaction((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        db.query('DELETE FROM employees WHERE id = ?', [employeeId], (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal server error' });
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            db.query('DELETE FROM contacts WHERE employee_id = ?', [employeeId], (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error(err);
                        return res.status(500).json({ message: 'Internal server error' });
                    });
                }

                db.query('DELETE FROM emergency_contacts WHERE employee_id = ?', [employeeId], (err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error(err);
                            return res.status(500).json({ message: 'Internal server error' });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                console.error(err);
                                return res.status(500).json({ message: 'Internal server error' });
                            });
                        }
                        res.json({ message: 'Employee deleted successfully' });
                    });
                });
            });
        });
    });
};


module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};