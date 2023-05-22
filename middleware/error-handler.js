const { EmployeeNotFoundError, QueryError, BadRequestError } = require('../errors/errors');

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err instanceof BadRequestError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong, please try again later' });
}
module.exports = errorHandlerMiddleware;