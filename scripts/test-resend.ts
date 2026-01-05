import { resend } from '../lib/resend';

async function testResendAPI() {
  console.log('🧪 Testing Resend API...\n');

  try {
    const result = await resend.emails.send({
      from: 'ChanthanaThaiCook <noreply@cthaicook.com>',
      to: 'fouquet_florian@hotmail.com', // Test avec domaine vérifié
      subject: 'Test Resend API - ChanthanaThaiCook',
      html: `
        <h1>Test Email</h1>
        <p>Si vous recevez cet email, votre clé Resend API fonctionne correctement!</p>
        <p>Date: ${new Date().toISOString()}</p>
      `
    });

    console.log('📦 Réponse complète de Resend:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n---');

    if (result.data?.id) {
      console.log('✅ Email envoyé avec succès!');
      console.log('📧 Email ID:', result.data.id);
      console.log('\n⏳ Vérifiez votre boîte email (+ spam) pour "Test Resend API"');
    } else if (result.error) {
      console.error('❌ Erreur Resend:', result.error);
    } else {
      console.warn('⚠️ Réponse inattendue - pas d\'ID ni d\'erreur');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi:', error);

    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testResendAPI();
