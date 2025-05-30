const redis = require('redis');
require('dotenv').config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = redis.createClient({
    url: redisUrl
});

client.on('connect', () => {
    console.log('✅ Connected to Redis successfully!');
});

client.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});


async function connectRedis() {
    if (!client.isOpen) {
        try {
            await client.connect();
        } catch (err) {
            console.error('❌ Redis connect() failed:', err);
        }
    }
}

connectRedis();

module.exports = client;
