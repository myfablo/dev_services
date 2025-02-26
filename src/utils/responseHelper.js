exports.successResponse = (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

exports.errorResponse = (res, error, message = "Error", statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error
    });
};
