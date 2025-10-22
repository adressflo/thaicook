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

interface VerificationEmailProps {
  email: string;
  url: string;
}

export function VerificationEmail({ email, url }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse email pour Chanthana Thai Cook</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenue chez Chanthana Thai Cook!</Heading>
          <Text style={text}>
            Bonjour,
          </Text>
          <Text style={text}>
            Vous avez créé un compte avec l'adresse <strong>{email}</strong>.
          </Text>
          <Text style={text}>
            Pour activer votre compte et commencer à commander nos délicieux plats thaïlandais,
            veuillez cliquer sur le bouton ci-dessous :
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={url}>
              Vérifier mon email
            </Button>
          </Section>

          <Text style={text}>
            Ou copiez et collez ce lien dans votre navigateur :
          </Text>
          <Link href={url} style={link}>
            {url}
          </Link>

          <Text style={footer}>
            Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
          </Text>

          <Text style={footer}>
            L'équipe Chanthana Thai Cook<br />
            <Link href="mailto:contact@chanthana.com" style={link}>
              contact@chanthana.com
            </Link>
          </Text>
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
  maxWidth: '580px',
};

const h1 = {
  color: '#059669', // thai-green
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#D97706', // thai-orange
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const link = {
  color: '#D97706',
  textDecoration: 'underline',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
};

const footer = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '24px',
  marginTop: '48px',
};
