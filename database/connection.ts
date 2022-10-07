import dotevn from 'dotenv';

dotevn.config();

const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.g5jalov.mongodb.net/`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 9000;

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    }
} 