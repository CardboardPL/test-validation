export const ValidatorFunctions = {
    dataType: (type, val) => {
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

        return {
            status: isValid,
            message: isValid ? 
                'Success' : 
                `Failed: Expected a ${type} but received a ${typeofVal}.`
        };
    },
    integer: (val) => {
        const isValid = Number.isInteger(val);
        return {
            status: isValid,
            message: isValid ? 
                'Success' :
                `Failed: Expected an integer but received ${val}.`
        };
    }
}