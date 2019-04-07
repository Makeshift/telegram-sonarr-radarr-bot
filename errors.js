function replaceErrors(key, value) {
    if (value instanceof Error) {
        let error = {};

        Object.getOwnPropertyNames(value).forEach(function(key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}

module.exports = {
    replaceErrors: replaceErrors
}