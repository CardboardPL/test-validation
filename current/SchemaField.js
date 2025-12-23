import { ValidatorFunctions } from './Validator.js';

export class SchemaField {
    #dataTypeMethodsLocked = false;
    #stringMethodsLocked = false;
    #numericalMethodsLocked = false;
    operationsMap = {
        stringMethods: [],
        numericalMethods: []
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
    required() {
        this.operationsMap['required'] = true;
        this.#lockMethod('required');
        return this;
    }

    // Data Type Methods
    string() {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('string');
        this.operationsMap['dataType'] = 'string';
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    number() {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('number');
        this.operationsMap['dataType'] = 'number';
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        return this;
    }

    boolean() {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('boolean');
        this.operationsMap['dataType'] = 'boolean';
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    array() {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('array');
        this.operationsMap['dataType'] = 'array';
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    object() {
        if (this.#dataTypeMethodsLocked) this.#lockMethod('object');
        this.operationsMap['dataType'] = 'object';
        this.#dataTypeMethodsLocked = true;
        this.#stringMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    // Numerical Methods
    integer() {
        if (this.#numericalMethodsLocked) this.#lockMethod('integer');
        this.#pushMethod('numericalMethods', 'integer', true, ValidatorFunctions.integer);
        this.#lockMethod('integer');
        return this;
    }

    min(value) {
        if (this.#numericalMethodsLocked) this.#lockMethod('min');
        this.#pushMethod('numericalMethods', 'min', value, ValidatorFunctions.min);
        this.#lockMethod('min');
        return this;
    }

    max(value) {
        if (this.#numericalMethodsLocked) this.#lockMethod('max');
        this.#pushMethod('numericalMethods', 'max', value, ValidatorFunctions.max);
        this.#lockMethod('max');
        return this;
    }

    // String methods
    minLength(value) {
        if (this.#stringMethodsLocked) this.#lockMethod('minLength');
        this.#pushMethod('stringMethods', 'minLength', value, ValidatorFunctions.minLength);
        this.#lockMethod('minLength');
        return this;
    }

    maxLength(value) {
        if (this.#stringMethodsLocked) this.#lockMethod('maxLength');
        this.#pushMethod('stringMethods', 'maxLength', value, ValidatorFunctions.maxLength);
        this.#lockMethod('maxLength');
        return this;
    }

    // Validation Method
    validate(data) {
        const opMap = this.operationsMap;
        const results = {
            status: true,
            checks: {}
        }

        if (opMap.required && (data == null || data === '')) {
            this.#logResults(results, { 
                status: false, 
                message: 'Field is required'
            }, 'schemaField');
            return results;
        }

        const dataType = opMap.dataType;

        // Handle Data Type Checks
        this.#logResults(results, ValidatorFunctions.dataType(dataType, data), 'dataType');

        // Run Data Type Specific Checks
        const validators = this.#getValidMethodArray(dataType);
        for (const validator of validators) {
            this.#logResults(results, validator.func(validator.value, data), validator.methodName);
        }

        return results;
    }
}