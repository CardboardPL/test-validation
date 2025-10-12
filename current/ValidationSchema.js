import { SchemaField } from './SchemaField.js';

class ValidationSchema {
    #schema;

    constructor(schema) {
        // Ensure that the schema is a plain object
        if (schema == null || 
            typeof schema !== 'object' || 
            Object.getPrototypeOf(schema) !== Object.prototype
        ) throw new Error('Invalid Schema: Schema must be a plain object.');

        // Ensure that the schema is not empty
        let run = false;
        for (const key in schema) {
            run = true;

            // Ensure that the value of the properties of the schema is either an instance of SchemaField or ValidationSchema            
            if (!(schema[key] instanceof SchemaField) || !(schema[key] instanceof ValidationSchema)) {
                throw new Error(`Invalid Schema: Invalid Field at ${key}`);
            }
        }
        if (!run) throw new Error('Invalid Schema: Schema must not be empty.');

        this.#schema = schema;
    }
}