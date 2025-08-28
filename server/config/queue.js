const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Use your production Redis connection string from your environment variables
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, 
});

const emailQueue = new Queue('emailQueue', { connection });

module.exports = emailQueue;