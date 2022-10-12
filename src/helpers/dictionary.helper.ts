/**
 * Saves all values of the input object to a dictionary-like destination object. 
 * Keys of that dictionary will be upper-case property names.
 * Optionally, uses prefix for building keys.
 * @param {NodeJS.Dict<string>} destination Dictionary-like destination
 * @param {T} values Object wtih values to save
 * @param prefix Optional prefix for keys in dictionary
 * @returns {void}
 */
export function pushTo<T>(destination: NodeJS.Dict<string>, values: T, prefix = ""): void {
    let key: keyof T;
    for (key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
            destination[`${prefix}${key.toUpperCase()}`] = `${values[key]}`;
        }
    }
}