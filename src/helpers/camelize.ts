export function camelize(str) {
    return (str.charAt(0).toLowerCase() + str.slice(1)).replace(' ', '');
}