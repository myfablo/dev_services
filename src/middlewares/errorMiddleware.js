const errorMiddleware = (err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.stack || "No additional error details"
    });
};

// Middleware to handle 404 Not Found routes
const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
};

module.exports = { errorMiddleware, notFoundMiddleware };
