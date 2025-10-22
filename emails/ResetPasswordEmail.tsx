import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
}

export default function ResetPasswordEmail({
  resetUrl = "https://chanthanathaicook.com/reset-password?token=example",
  userEmail = "user@example.com",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe - Chanthana Thai Cook</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={title}>🌶️ Chanthana Thai Cook</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Réinitialisation de mot de passe</Heading>

            <Text style={text}>
              Bonjour,
            </Text>

            <Text style={text}>
              Vous avez demandé la réinitialisation du mot de passe pour votre compte ({userEmail}).
            </Text>

            <Text style={text}>
              Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Réinitialiser mon mot de passe
              </Button>
            </Section>

            <Text style={text}>
              Ou copiez et collez ce lien dans votre navigateur :
            </Text>

            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>

            <Text style={warning}>
              ⚠️ Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Sawasdee! 🙏
              <br />
              L'équipe Chanthana Thai Cook
            </Text>
            <Text style={footerLinks}>
              <Link href="https://chanthanathaicook.com" style={footerLink}>
                Site web
              </Link>
              {' | '}
              <Link href="https://chanthanathaicook.com/contact" style={footerLink}>
                Contact
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#dc2626', // Thai red
  padding: '24px',
  textAlign: 'center' as const,
};

const title = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const content = {
  padding: '0 48px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 24px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const warning = {
  color: '#dc2626',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#fef2f2',
  borderRadius: '8px',
  border: '1px solid #fecaca',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const link = {
  color: '#dc2626',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  margin: '32px 48px 0',
  padding: '24px 0 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
};

const footerLinks = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

const footerLink = {
  color: '#dc2626',
  textDecoration: 'none',
};
