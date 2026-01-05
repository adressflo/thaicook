import { resend } from './resend';
import { VerificationEmail } from '@/emails/VerificationEmail';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';

/**
 * Send email verification to user
 * Called by Better Auth when a new user signs up
 */
export async function sendVerificationEmail({ user, url }: { user: { email: string }; url: string }) {
  try {
    await resend.emails.send({
      // Domaine vérifié sur Resend : cthaicook.com
      from: 'ChanthanaThaiCook <noreply@cthaicook.com>',
      to: user.email,
      subject: 'Vérifiez votre email - ChanthanaThaiCook',
      react: VerificationEmail({ email: user.email, url })
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Send password reset email to user
 * Called by Better Auth when user requests password reset
 */
export async function sendPasswordResetEmail({ user, url }: { user: { email: string }; url: string }) {
  try {
    await resend.emails.send({
      // Domaine vérifié sur Resend : cthaicook.com
      from: 'ChanthanaThaiCook <noreply@cthaicook.com>',
      to: user.email,
      subject: 'Réinitialisation de mot de passe - ChanthanaThaiCook',
      react: ResetPasswordEmail({ resetUrl: url, email: user.email })
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}
