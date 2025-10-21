import { Resend } from 'resend';
import VerificationEmail from '@/emails/VerificationEmail';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Chanthana Thai Cook <onboarding@resend.dev>', // TODO: Remplacer par votre domaine vérifié
      to: [email],
      subject: 'Vérifiez votre adresse email - Chanthana Thai Cook',
      react: VerificationEmail({
        verificationUrl,
        userEmail: email,
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
      from: 'Chanthana Thai Cook <onboarding@resend.dev>', // TODO: Remplacer par votre domaine vérifié
      to: [email],
      subject: 'Réinitialisez votre mot de passe - Chanthana Thai Cook',
      react: ResetPasswordEmail({
        resetUrl,
        userEmail: email,
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
