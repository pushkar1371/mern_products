
import dotenv from "dotenv";
dotenv.config();

import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_ENDPOINT,
        port: 18647
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();
export default redisClient;








