import { ValidatorFunctions } from './Validator.js';

export class SchemaField {
    #dataTypeMethodsLocked = false;
    operationsMap = {};

    string() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.operationsMap['dataType'] = 'string';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    number() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.operationsMap['dataType'] = 'number';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    boolean() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.operationsMap['dataType'] = 'boolean';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    array() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.operationsMap['dataType'] = 'array';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    object() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.operationsMap['dataType'] = 'object';
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    required() {
        this.operationsMap['required'] = true;
        this.required = function() {
            throw new Error('Called a locked method');
        };
        return this;
    }

    validate(data) {
        const schemaFieldOpMap = this.operationsMap;
        let isValid = true;
        const results = {};

        if (schemaFieldOpMap.required && (
            data == null || data === ''
        )) {
            return { status: false, message: 'Field is required' }
        }

        const handleDataType = (obj) => {
            const { status, message } = obj;
            isValid = isValid === false ? isValid : status;
            results['dataType'] = message
        }

        switch (schemaFieldOpMap.dataType) {
            case 'string':
                handleDataType(ValidatorFunctions.string(data));
                break;
            case 'number':
                handleDataType(ValidatorFunctions.number(data))
                break;
            case 'boolean':
                handleDataType(ValidatorFunctions.boolean(data))
                break;
            case 'array':
                handleDataType(ValidatorFunctions.array(data))
                break;
            case 'object':
                handleDataType(ValidatorFunctions.object(data))
                break;
            default:
                throw new Error('Invalid Data Type');
        }

        return { status: isValid, messages: results };
    }
}