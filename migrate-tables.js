const connection = require('./db/db');

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');

  // Create the employees table
  const createEmployeesTableQuery = `
    CREATE TABLE employees (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      date_of_birth DATE NOT NULL,
      salary DECIMAL(10, 2) NOT NULL
    )
  `;
  connection.query(createEmployeesTableQuery, (err) => {
    if (err) {
      console.error('Error creating employees table:', err);
      return;
    }
    console.log('Employees table created.');

    // Create the contacts table
    const createContactsTableQuery = `
      CREATE TABLE contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `;
    connection.query(createContactsTableQuery, (err) => {
      if (err) {
        console.error('Error creating contacts table:', err);
        return;
      }
      console.log('Contacts table created.');

      // Create the emergency_contacts table
      const createEmergencyContactsTableQuery = `
        CREATE TABLE emergency_contacts (
          id INT PRIMARY KEY AUTO_INCREMENT,
          employee_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone_number VARCHAR(20) NOT NULL,
          relationship VARCHAR(100) NOT NULL,
          FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        )
      `;
      connection.query(createEmergencyContactsTableQuery, (err) => {
        if (err) {
          console.error('Error creating emergency_contacts table:', err);
          return;
        }
        console.log('Emergency_contacts table created.');

        // Close the database connection
        connection.end((err) => {
          if (err) {
            console.error('Error closing the database connection:', err);
            return;
          }
          console.log('Database connection closed.');
        });
      });
    });
  });
});
