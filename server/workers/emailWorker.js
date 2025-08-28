const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const emailService = require('../emailService/EmailService'); // Adjust path as needed

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker('emailQueue', async (job) => {
  const { type, data } = job.data;
  console.log(`Processing email job: ${type}`);

  try {
    switch (type) {
      case 'sendVerificationEmail':
        await emailService.sendVerificationEmail(data.email, data.token, data.name);
        break;
      // Add cases for other emails like 'sendWelcomeEmail', 'sendPasswordResetEmail', etc.
      case 'sendPasswordResetEmail':
        await emailService.sendPasswordResetEmail(data.email, data.token, data.name);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }
    
    
  } catch (error) {
    console.error(`Failed to send email for job ${job.id}`, error);
    throw error; // This will cause BullMQ to retry the job
  }
}, { connection });

console.log('Email worker started...');

worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});