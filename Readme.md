
# Employee Management API

This is a backend API for managing employees and their contact details. It provides CRUD operations for employees and supports pagination for listing employees.


## Prerequisites

Before running the API, make sure you have the following installed on your machine:

- Node.js
- MySQL

## Installation


1. Clone the repository: 
```
git clone https://github.com/Carbrex/Employee-Management-API 
```

2. Navigate to the project directory:
```
cd employee-management-api
```

3. Install the dependencies:
```
npm install
```

4. Set up the MySQL database:

- Create a new database in your MySQL server named `employee_management`.
- Update the database configuration in the `db.js` file with your MySQL credentials and database name.

5. Run the database migration to create the required tables:
```
npm run migrate
```
6. To start the API run the following command: 
```
npm run start
```

# Employee API Documentation

## Get all employees

Endpoint: `GET /employees`

Retrieves a list of all employees.

### Query Parameters

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)

### Response

- Status Code: 200 (OK)
- Body: Array of employee objects

## Get a specific employee by ID

Endpoint: `GET /employees/:id`

Retrieves a specific employee based on the provided ID.

### Path Parameters

- `id`: ID of the employee

### Response

- Status Code: 200 (OK)
- Body: Employee object

## Create a new employee

Endpoint: `POST /employees`

Creates a new employee.

### Request Body

- `name`: Name of the employee
- `designation`: Designation of the employee
- `dateOfBirth`: Date of birth of the employee
- `salary`: Salary of the employee

### Response

- Status Code: 201 (Created)
- Body: Object containing the ID of the created employee

## Update an existing employee

Endpoint: `PUT /employees/:id`

Updates an existing employee based on the provided ID.

### Path Parameters

- `id`: ID of the employee

### Request Body

- `name`: Name of the employee
- `designation`: Designation of the employee
- `dateOfBirth`: Date of birth of the employee
- `salary`: Salary of the employee

### Response

- Status Code: 200 (OK)
- Body: Object containing a success message

## Delete an employee

Endpoint: `DELETE /employees/:id`

Deletes an employee based on the provided ID.

### Path Parameters

- `id`: ID of the employee

### Response

- Status Code: 200 (OK)
- Body: Object containing a success message
