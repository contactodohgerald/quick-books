import { generateFromEmail } from 'unique-username-generator';

export function generateUsername(email: string) {

    const username: string = generateFromEmail(email, 3);

    return username;
}