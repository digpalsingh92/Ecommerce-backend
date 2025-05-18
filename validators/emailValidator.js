import validator from 'validator';

export const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
}