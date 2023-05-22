const express = require('express');
require('express-async-errors');
const app = express();
const employeesRouter = require('./routes/employees');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use('/employees', employeesRouter);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`)
);