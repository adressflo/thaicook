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
  email: string; // Renamed from userEmail
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export default function ResetPasswordEmail({
  resetUrl = "https://chanthanathaicook.com/reset-password?token=example",
  email = "user@example.com", // Renamed from userEmail
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head>
        <style>
          {`
            @media (max-width: 720px) {
              .tagline-mobile {
                font-size: 14px !important;
                white-space: nowrap !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>Réinitialisez votre mot de passe - Chanthana Thai Cook</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Link href={`${baseUrl}/`} style={{ textDecoration: 'none' }}>
              <div style={headerContent}>
                <Heading style={brandName}>ChanthanaThaiCook</Heading>
                <Text className="tagline-mobile" style={tagline}>
                  <Img
                    src={`${baseUrl}/logo.ico`}
                    width="20"
                    height="20"
                    style={inlineLogoStyle}
                  />{' '}
                  L'art culinaire thaïlandais authentique{' '}
                  <Img
                    src={`${baseUrl}/logo.ico`}
                    width="20"
                    height="20"
                    style={inlineLogoStyle}
                  />
                </Text>
              </div>
            </Link>
          </Section>

          <Section style={content}>
            {/* Section 1: "Vous avez demandé..." */}
            <Section style={greenLeftBorderSection}>
              <Text style={text}>
                Vous avez demandé la{' '}
                <Link href={resetUrl} style={orangeLink}>
                  réinitialisation du mot de passe
                </Link>{' '}
                pour{' '}
                <Link href={`${baseUrl}/profil`} style={orangeLink}>
                  votre compte
                </Link>{' '}
                {' '}({email}).
              </Text>
            </Section>

            {/* Section 2: "Cliquez sur le bouton..." */}
            <Section style={contentSection}>
              <Text style={text}>
                <strong>Cliquez</strong> sur le bouton ci-dessous pour définir <strong>un nouveau mot de passe</strong>
              </Text>
              <Section style={buttonContainer}>
                <Button style={button} href={resetUrl}>
                  Réinitialiser mon mot de passe
                </Button>
              </Section>
              <Text style={text}>
                ou copiez et collez ce lien
              </Text>
              <Link href={resetUrl} style={link}>
                {resetUrl}
              </Link>
            </Section>

            {/* The original warning text block */}
            <Section style={warningSection}>
              <Text style={warning}>
                ⚠️ Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette
                réinitialisation, ignorez cet email.
              </Text>{' '}
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Vous recevez cet email car vous avez demandé la réinitialisation
              du mot de passe sur ChanthanaThaiCook.
            </Text>
            <Text style={footerCopyright}>
              © ChanthanaThaiCook. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '0',
};

const container = {
  backgroundColor: '#FEF7E0', // Thai Cream
  margin: '0 auto',
  borderRadius: '12px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '2px 20px 16px 16px',
};

const headerSection = {
  background: 'linear-gradient(135deg, #FF7B54 0%, #FFD700 100%)',
  borderLeft: '5px solid #FF7B54', // Gradient with orange and gold
  padding: '1px', // Border thickness
  borderRadius: '8px', // No rounded corners
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
};

const headerContent = {
  background: 'radial-gradient(#FEF7E0 60%  ,#ffffff )',
  padding: '20px 16px', // 20px top/bottom, 16px left/right
  textAlign: 'center' as const,
  borderRadius: '0', // No rounded corners
};

const brandName = {
  color: '#2D5016', // Vert Thaï
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textShadow: 'none',
};

const tagline = {
  color: '#2D5016',
  fontSize: '16px',
  margin: '0',
  fontStyle: 'italic' as const,
};

const inlineLogoStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
};

const title = {
  color: '#2D5016', // Vert Thaï
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0', // Simplified margin
  textShadow: 'none',
};

const content = {
  padding: '20 16px',
};

const contentSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const, // Center all content within this section
};

const greenLeftBorderSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(45, 80, 22, 0.2)', // Subtle green border
  borderLeft: '5px solid #2D5016', // Green left border
  padding: '20px',
  margin: '24px 0',
};

const warningSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(45, 80, 22, 0.2)', // Subtle green border
  borderLeft: '5px solid #2D5016', // Green left border
  padding: '20px',
  margin: '24px 0',
};

const text = {
  color: '#2D5016', // Green
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const warning = {
  color: '#2D5016', // Green
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#FEF7E0', // Cream
  borderRadius: '8px',
  border: '1px solid #FF7B54', // Orange
  textAlign: 'center' as const, // Centered
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#FF7B54', // bg-white/90
  borderRadius: '9999px', // rounded-full
  color: '#ffffff', // Orange text
  fontSize: '16px', // Increased font size
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px', // Increased padding
  border: '1px solid rgba(255, 123, 84, 0.2)', // border-thai-orange/20
  cursor: 'pointer',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
};

const orangeLink = {
  color: '#FF7B54', // Orange
  textDecoration: 'none',
  fontWeight: 'bold' as const,
};

const link = {
  color: '#FF7B54',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  fontWeight: 'bold' as const,
};

const footer = {
  borderTop: '1px solid #e6e6e6',
  paddingTop: '24px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#999',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const footerCopyright = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0 0',
};

const footerLinks = {
  color: '#999',
  fontSize: '12px',
  margin: '0',
};

const footerLink = {
  color: '#FF7B54', // Orange
  textDecoration: 'none',
};
