function createValidationResult(status, errorMessage = 'Failed', successMessage = 'Success') {
    return {
        status,
        message: status ? 
            successMessage :
            errorMessage
    };
}

export const ValidatorFunctions = {
    dataType: (type, val, errorMessage, successMessage) => {
        const validTypes = ['string', 'number', 'boolean', 'array', 'object'];
        if (!validTypes.includes(type)) throw new Error('Invalid Data Type');

        const typeofVal = typeof val;
        let isValid = typeofVal === type;

        if (type === 'array') {
            isValid = Array.isArray(val);
            typeofVal = isValid ? 'array' : typeofVal;
        }

        if (val === null) {
            typeofVal = 'null';
            isValid = type === 'object' ? false : isValid;
        }

        return createValidationResult(
            isValid, 
            errorMessage || `Failed: Expected a ${type} but received a ${typeofVal}.`, 
            successMessage || 'Success'
        );
    },
    
    // Number specific functions
    integer: (val, errorMessage, successMessage) => {
        const isValid = Number.isInteger(val);
        return createValidationResult(
            isValid, 
            errorMessage || `Failed: Expected an integer but received ${val}.`, 
            successMessage || 'Success'
        );
    }
}