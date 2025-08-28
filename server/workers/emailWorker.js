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
      case 'sendPasswordResetEmail':
        await emailService.sendPasswordResetEmail(data.email, data.token, data.name);
        break;
      case 'sendOrderConfirmationEmail':
    await emailService.sendOrderConfirmationEmail(data.order, data.user);
    break;
      case 'sendOrderNotificationToAdmin':
    await emailService.sendOrderNotificationToAdmin(data.order, data.user);
    break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }
     console.log(`[${job.id}] Successfully sent email. Response: ${result.response}`);
    console.log(`[${job.id}] Message ID: ${result.messageId}`);
    console.log(`[${job.id}] Accepted by: ${result.accepted}`);
    
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