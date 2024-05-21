export function flattenContactsAttributes(data: any): any {
    // Base case for recursion
    if (!data) {
        return null;
    }

    // Handling array data
    if (Array.isArray(data)) {
        return data.map(flattenContactsAttributes);
    }

    let flattened: { [key: string]: any } = {};

    // Handling attributes
    if (data.attributes) {
        for (const key in data.attributes) {
            if (
                typeof data.attributes[key] === 'object' &&
                data.attributes[key] !== null &&
                'data' in data.attributes[key]
            ) {
                flattened[key] = flattenContactsAttributes(
                    data.attributes[key].data
                );
            } else {
                flattened[key] = data.attributes[key];
            }
        }
    }

    // Copying non-attributes and non-data properties
    for (const key in data) {
        if (key !== 'attributes' && key !== 'data') {
            flattened[key] = data[key];
        }
    }

    // Handling nested data
    if (data.data) {
        flattened = { ...flattened, ...flattenContactsAttributes(data.data) };
    }

    return flattened;
}
