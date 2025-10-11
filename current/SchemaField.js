class SchemaField {
    #dataTypeMethodsLocked = false;
    orderArray = [];

    string() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.orderArray.push({
            dataType: 'string'
        });
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    number() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.orderArray.push({
            dataType: 'number'
        });
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    boolean() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.orderArray.push({
            dataType: 'boolean'
        });
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    array() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.orderArray.push({
            dataType: 'array'
        });
        this.#dataTypeMethodsLocked = true;
        return this;
    }

    object() {
        if (this.#dataTypeMethodsLocked) throw new Error('Called a locked method');
        this.orderArray.push({
            dataType: 'object'
        });
        this.#dataTypeMethodsLocked = true;
        return this;
    }
}