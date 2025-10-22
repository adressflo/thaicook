
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ChanthanaWelcomeEmailProps {
  userName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ChanthanaWelcomeEmail = ({
  userName = 'Client',
}: ChanthanaWelcomeEmailProps) => {
  const previewText = `Bienvenue chez ChanthanaThaiCook !`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                'thai-orange': '#FF7A00',
                'thai-gold': '#FFB800',
                'thai-green': '#004D40',
              },
            },
          },
        }}
      >
        <Body style={main}>
          <Container style={container}>
            <Section style={logoContainer}>
              <Img
                src={`${baseUrl}/public/logo.svg`}
                width="120"
                height="50"
                alt="ChanthanaThaiCook Logo"
                style={logo}
              />
            </Section>
            <Heading style={heading}>
              Bienvenue chez ChanthanaThaiCook !
            </Heading>
            <Text style={text}>Bonjour {userName},</Text>
            <Text style={text}>
              Nous sommes ravis de vous accueillir. Préparez-vous à découvrir les saveurs authentiques de la Thaïlande.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/commander`}>
                Commander maintenant
              </Button>
            </Section>
            <Text style={text}>
              Bon appétit,
              <br />
              L'équipe ChanthanaThaiCook
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ChanthanaWelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  color: '#004D40', // thai-green
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#FF7A00', // thai-orange
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
};
