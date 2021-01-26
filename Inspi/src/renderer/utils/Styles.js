
const createParser = (matcher, replacer) => {
    const regex = RegExp(matcher, 'g');
    return string => {
        // * throw an error if not a string
        if (typeof string !== 'string')
            throw new TypeError(`expected an argument of type string, but got ${typeof styleObj}`);

        // * if no match between string and matcher
        if (!string.match(regex))
            return string;

        // * executes the replacer function for each match
        // ? replacer can take any arguments valid for String.prototype.replace
        return string.replace(regex, replacer);
    };
}

const camelToKebab = createParser(/[A-Z]/, match => `-${match.toLowerCase()}`);

export const objToString = (style) => {
    if (!style || typeof style != 'object' || Array.isArray(style))
        throw new TypeError(`Expected an argument of type object, but got ${typeof style}`);

    const lines = Object.keys(style).map( prop => `${camelToKebab(prop)}: ${style[prop]};`);
    return lines.join('\n');
}