import { Resend } from 'resend';
import { VerificationEmail } from '@/emails/VerificationEmail';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Mode développement : utilise onboarding@resend.dev
// Mode production : utilise noreply@cthaicook.com
const FROM_EMAIL = process.env.NODE_ENV === 'production'
  ? 'Chanthana Thai Cook <noreply@cthaicook.com>'
  : 'Chanthana Thai Cook <onboarding@resend.dev>';

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Vérifiez votre adresse email - Chanthana Thai Cook',
      react: VerificationEmail({
        url: verificationUrl,
        email: email,
      }),
    });

    if (error) {
      console.error('Erreur Resend lors de l\'envoi de l\'email de vérification:', error);
      throw new Error(`Échec de l'envoi de l'email de vérification: ${error.message}`);
    }

    console.log('✅ Email de vérification envoyé avec succès:', data?.id);
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    throw error;
  }
}

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Réinitialisez votre mot de passe - Chanthana Thai Cook',
      react: ResetPasswordEmail({
        resetUrl,
        email,
      }),
    });

    if (error) {
      console.error('Erreur Resend lors de l\'envoi de l\'email de réinitialisation:', error);
      throw new Error(`Échec de l'envoi de l'email de réinitialisation: ${error.message}`);
    }

    console.log('✅ Email de réinitialisation envoyé avec succès:', data?.id);
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw error;
  }
}
