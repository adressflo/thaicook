import { Resend } from 'resend';

/**
 * Resend client for sending transactional emails
 * API Key must be configured in .env file
 */
export const resend = new Resend(process.env.RESEND_API_KEY);
