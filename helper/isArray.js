export function isArray(value, direct = true) {
    if (typeof direct !== 'boolean') throw new Error('Rule value must be a boolean');
    
    const isArray = Array.isArray(value);
    if (direct) {
        if (!isArray) return { status: false, message: 'Value must be an array' }
        return { status: true, message: '' };
    }
    
    if (isArray) return { status: false, message: 'Value must not be an array' }
    return { status: true, message: '' };
}