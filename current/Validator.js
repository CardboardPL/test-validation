export const ValidatorFunctions = {
    string: (val) => {
        const isString = typeof val === 'string';
        return { 
            status: isString, 
            message: isString ? "Success" : `Failed: Expected a string but received a ${typeof val}` 
        };
    },

    number: (val) => {
        const isNumber = typeof val === 'number';
        return { 
            status: isNumber, 
            message: isNumber ? "Success" : `Failed: Expected a number but received a ${typeof val}` 
        };
    },

    boolean: (val) => {
        const isBoolean = typeof val === 'boolean';
        return { 
            status: isBoolean, 
            message: isBoolean ? "Success" : `Failed: Expected a boolean but received a ${typeof val}` 
        };
    },

    array: (val) => {
        const isArray = Array.isArray(val);
        return { 
            status: isArray, 
            message: isArray ? "Success" : `Failed: Expected an array but received a ${typeof val}` 
        };
    },

    object: (val) => {
        const isObject = typeof val === 'object';
        return { 
            status: isObject, 
            message: isObject ? "Success" : `Failed: Expected an object but received a ${typeof val}` 
        };
    },
}