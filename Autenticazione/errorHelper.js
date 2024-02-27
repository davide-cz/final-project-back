export const StatusError = (code, msg) => {
    const error = new Error(msg);
    error.statusCode = code;
    return error;
}

export const handleResponseError = (res, error) => {
    console.error(error);
    const code = error.statusCode || 500;
    res.status(code).send(code !== 500 ? error.message : "Server Error");
}