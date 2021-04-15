export const validateEmail = (value) => {
    if (value.length === 0) return true;
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(value).toLowerCase());
}

export const checkEmptyInput = (value) => {
    return value ? value.length === 0 : true;
}

export const validatePassword = (value) => {
    if (value.length === 0) return true;
    return value.length >= 8;
}

export const validatePhone = (value) => {
    if (value.length === 0) return true;
    return (/[0-9]/.test(value)) && (value.length >= 10);
}