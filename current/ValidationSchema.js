import { SchemaField } from "./SchemaField";

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

            // Ensure that the values of the properties of the scheme is an instance of a SchemaField
            if (!(schema[key] instanceof SchemaField)) throw new Error('Invalid Schema: The values of the properties of a schema must be an instance of a "SchemaField"');
        }
        if (!run) throw new Error('Invalid Schema: Schema must not be empty.');

        this.#schema = schema;
    }
}