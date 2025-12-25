import { ValidatorFunctions } from './Validator.js';

export class SchemaField {
    #dataTypeMethodsLocked = false;
    #stringMethodsLocked = false;
    #numericalMethodsLocked = false;
    operationsMap = {
        stringMethods: [],
        numericalMethods: [],
        requiredParams: [false],
    };

    #lockMethod(methodName) {
        this[methodName] = () => { 
            throw new Error(`${methodName} can't be called at this stage.`);
        };
    }

    #logResults(results, checkResult, key) {
        results.checks[key] = checkResult;
        if (results.status !== false && results.status !== checkResult.status) {
            results.status = checkResult.status;
        }
    }

    #pushMethod(location, methodName, value, func) {
        if (!Array.isArray(this.operationsMap[location])) throw new Error('Invalid location.');
        this.operationsMap[location].push({
            methodName,
            value,
            func
        });
    }

    #getValidMethodArray(dataType) {
        switch(dataType) {
            case 'number':
                return this.operationsMap.numericalMethods;
            case 'string':
                return this.operationsMap.stringMethods;
            default:
                throw new Error('Invalid data type');
        }
    }

    // General Methods
    required(errorMessage = null, successMessage = null) {
        this.operationsMap['requiredParams'] = [true, errorMessage, successMessage];
        this.#lockMethod('required');
        return this;
    }

    // Data Type Methods
    string(errorMessage = null, successMessage = null) {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('string');
        this.operationsMap['dataTypeParams'] = ['string', errorMessage, successMessage];
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    number(errorMessage = null, successMessage = null) {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('number');
        this.operationsMap['dataTypeParams'] = ['number', errorMessage, successMessage];
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        return this;
    }

    boolean(errorMessage = null, successMessage = null) {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('boolean');
        this.operationsMap['dataTypeParams'] = ['boolean', errorMessage, successMessage];
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    array(errorMessage = null, successMessage = null) {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('array');
        this.operationsMap['dataTypeParams'] = ['array', errorMessage, successMessage];
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    object(errorMessage = null, successMessage = null) {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('object');
        this.operationsMap['dataTypeParams'] = ['object', errorMessage, successMessage];
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    // Numerical Methods
    integer(errorMessage = null, successMessage = null) {
        if (this.#numericalMethodsLocked) this.#lockMethod('integer');
        this.#pushMethod('numericalMethods', 'integer', [errorMessage, successMessage], ValidatorFunctions.integer);
        this.#lockMethod('integer');
        return this;
    }

    min(value, errorMessage = null, successMessage = null) {
        if (this.#numericalMethodsLocked) this.#lockMethod('min');
        this.#pushMethod('numericalMethods', 'min', [value, errorMessage, successMessage], ValidatorFunctions.min);
        this.#lockMethod('min');
        return this;
    }

    max(value, errorMessage = null, successMessage = null) {
        if (this.#numericalMethodsLocked) this.#lockMethod('max');
        this.#pushMethod('numericalMethods', 'max', [value, errorMessage, successMessage], ValidatorFunctions.max);
        this.#lockMethod('max');
        return this;
    }

    // String methods
    minLength(value, errorMessage = null, successMessage = null) {
        if (this.#stringMethodsLocked) this.#lockMethod('minLength');
        this.#pushMethod('stringMethods', 'minLength', [value, errorMessage, successMessage], ValidatorFunctions.minLength);
        this.#lockMethod('minLength');
        return this;
    }

    maxLength(value, errorMessage = null, successMessage = null) {
        if (this.#stringMethodsLocked) this.#lockMethod('maxLength');
        this.#pushMethod('stringMethods', 'maxLength', [value, errorMessage, successMessage], ValidatorFunctions.maxLength);
        this.#lockMethod('maxLength');
        return this;
    }

    // Validation Method
    validate(
        data, 
        earlyExit = {
            req: true
        }
    ) {
        const opMap = this.operationsMap;
        const results = {
            status: true,
            checks: {}
        }

        const reqParams = opMap['requiredParams'];
        const reqResults = ValidatorFunctions.required(data, ...reqParams);
        this.#logResults(
            results, 
            reqResults, 
            'required'
        );

        if (earlyExit.req && !reqResults.status) return results;

        const dataTypeParams = opMap.dataTypeParams;

        // Handle Data Type Checks
        this.#logResults(results, ValidatorFunctions.dataType(data, ...dataTypeParams), 'dataType');

        // Run Data Type Specific Checks
        const validators = this.#getValidMethodArray(dataTypeParams[0]);
        for (const validator of validators) {
            this.#logResults(results, validator.func(data, ...validator.value), validator.methodName);
        }

        return results;
    }
}