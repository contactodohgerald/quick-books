
export const createUniqueId = (length: Number = 20): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const numbers = '0123456789';
    const charactersLength = characters.length;
    const numbersLength = numbers.length;
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        } else {
            result += numbers.charAt(Math.floor(Math.random() * numbersLength));
        }
    }
    return result;
}

export const createConfimationCode = (length: Number = 5): string => {
    let result = '';
    const numbers = '0123456789';
    const numbersLength = numbers.length;
    for (let i = 0; i < length; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    return result;
}

export const addCountryCode = (phone: string, countryCode: string): string => {
    let newPhone, newCountryCode;
    (phone.charAt(0) === '0') ? newPhone = phone.substring(1) : newPhone = phone;

    (countryCode.charAt(0) === '+') ? newCountryCode = countryCode.substring(1) : newCountryCode = countryCode;

    return '+'+newCountryCode + newPhone;
}