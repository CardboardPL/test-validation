import { ValidatorFunctions } from './Validator.js';

export class SchemaField {
    #dataTypeMethodsLocked = false;
    #numericalMethodsLocked = false;
    operationsMap = {};

    #lockedFunction() {
        throw new Error('Called a locked method');
    }

    // General Methods
    required() {
        this.operationsMap['required'] = true;
        this.required = () => this.#lockedFunction();
        return this;
    }

    // Data Type Methods
    string() {
        if (this.#dataTypeMethodsLocked) this.#lockedFunction();
        this.operationsMap['dataType'] = 'string';
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    number() {
        if (this.#dataTypeMethodsLocked) this.#lockedFunction();
        this.operationsMap['dataType'] = 'number';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    boolean() {
        if (this.#dataTypeMethodsLocked) this.#lockedFunction();
        this.operationsMap['dataType'] = 'boolean';
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    array() {
        if (this.#dataTypeMethodsLocked) this.#lockedFunction();
        this.operationsMap['dataType'] = 'array';
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    object() {
        if (this.#dataTypeMethodsLocked) this.#lockedFunction();
        this.operationsMap['dataType'] = 'object';
        this.#dataTypeMethodsLocked = true;
        this.#numericalMethodsLocked = true;
        return this;
    }

    // Numerical Methods
    integer() {
        if (this.#numericalMethodsLocked) this.#lockedFunction();
        
        this.operationsMap['integer'] = true;
        this.integer = () => this.#lockedFunction();
        return this;
    }

    min(value) {
        if (this.#numericalMethodsLocked) this.#lockedFunction();

        this.operationsMap['min'] = value;
        this.min = () => this.#lockedFunction();
        return this;
    }

    // Validation Method
    validate(data) {
        const schemaFieldOpMap = this.operationsMap;
        let isValid = true;
        const results = {};

        if (schemaFieldOpMap.required && (
            data == null || data === ''
        )) {
            return { status: false, message: 'Field is required' }
        }

        // Handle Data Type Checks
        const dataTypeResults = ValidatorFunctions.dataType(schemaFieldOpMap.dataType, data);
        results['dataType'] = dataTypeResults.message;
        isValid = isValid === false ? isValid : dataTypeResults.status;

        if (!isValid) return { status: isValid, messages: results };
    }
}