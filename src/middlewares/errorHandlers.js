export const errorHandler = (err, req, res, next) => {
    // Log the full error stack for debugging
    console.error('Error Stack:', err.stack);

    // Handle Sequelize specific database validation errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Database Validation Error',
            errors: err.errors.map(e => e.message)
        });
    }

    // Default status code and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};