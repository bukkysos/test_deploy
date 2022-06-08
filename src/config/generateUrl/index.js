export const generateUrl = (parameters) => {
    const queryStringArray = [];
    for (const key in parameters) {
        if (parameters[key] !== '') {
            queryStringArray.push(`${key}=${encodeURIComponent(parameters[key])}`);
        }
    }
    return `${queryStringArray.join('&')}`;
};