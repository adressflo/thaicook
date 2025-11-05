import {
  Body,
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

interface ChanthanaEmailChangeConfirmationProps {
  userName?: string;
  oldEmail?: string;
  newEmail?: string;
  verificationUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ChanthanaEmailChangeConfirmation = ({
  userName = '',
  oldEmail = 'ancien@email.com',
  newEmail = 'nouveau@email.com',
  verificationUrl = `${baseUrl}/auth/verify-email`,
}: ChanthanaEmailChangeConfirmationProps) => {
  const previewText = `Confirmation de changement d'email - ChanthanaThaiCook`;

  return (
    <Html>
      <Head>
        <style>
          {`
            @media (max-width: 720px) {
              .column {
                width: 100% !important;
                display: block !important;
                padding: 10px 0 !important;
              }
              .button-column {
                width: 100% !important;
                display: block !important;
                padding: 5px 0 !important;
              }
              .tagline-mobile {
                font-size: 14px !important;
                white-space: nowrap !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
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

          {/* Main Content */}
          <Section style={contentSection}>
            {/* Title Section */}
            <Section style={greetingSection}>
              <Heading style={h1}>Changement d'email</Heading>

              {/* Shield Icon */}
              <div style={iconCircleBlueGold}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>

              {userName && <Text style={greeting}>Bonjour {userName},</Text>}

              <Text style={welcomeText}>
                Vous avez récemment demandé à modifier l'adresse email associée à votre compte ChanthanaThaiCook.
              </Text>
            </Section>

            {/* Email Change Details */}
            <Section style={detailsSection}>
              <Heading style={h3}>Détails du changement</Heading>

              <div style={emailBox}>
                <Text style={emailLabel}>Ancienne adresse email :</Text>
                <Text style={emailValue}>{oldEmail}</Text>
              </div>

              <div style={arrowContainer}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF7B54"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>

              <div style={emailBox}>
                <Text style={emailLabel}>Nouvelle adresse email :</Text>
                <Text style={emailValueNew}>{newEmail}</Text>
              </div>
            </Section>

            {/* Security Notice */}
            <Section style={securitySection}>
              <Heading style={h3}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF7B54"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: '8px',
                  }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Information importante
              </Heading>

              <Text style={securityText}>
                <strong>Vérification requise :</strong> Pour finaliser ce changement, vous devez vérifier votre nouvelle adresse email en cliquant sur le bouton ci-dessous.
              </Text>

              <Text style={securityText}>
                <strong>Vous n'êtes pas à l'origine de cette demande ?</strong> Si vous n'avez pas demandé ce changement, contactez-nous immédiatement à{' '}
                <Link href="mailto:support@chanthanathaccook.fr" style={link}>
                  support@chanthanathaccook.fr
                </Link>
              </Text>
            </Section>

            {/* Verification Button */}
            <Section style={buttonSection}>
              <Link href={verificationUrl} style={{ textDecoration: 'none' }}>
                <div style={primaryButton}>
                  <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                    <tr>
                      <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        Vérifier mon nouvel email
                      </td>
                    </tr>
                  </table>
                </div>
              </Link>
            </Section>

            {/* Expiration Notice */}
            <Section style={expirationSection}>
              <Text style={expirationText}>
                ⏰ Ce lien de vérification expire dans <strong>24 heures</strong>. Si vous ne vérifiez pas votre email dans ce délai, vous devrez refaire la demande de changement.
              </Text>
            </Section>

            {/* Signature */}
            <Section style={signatureSection}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td align="center">
                    <table cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ paddingRight: '15px', verticalAlign: 'middle' }}>
                          <div style={signatureIconCircle}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <Text style={signature}>
                            <strong>L'équipe </strong>
                            <strong style={signatureTeam}>ChanthanaThaiCook</strong>
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                Vous recevez cet email car vous avez demandé à modifier votre adresse email sur ChanthanaThaiCook.
              </Text>
              <Text style={footerCopyright}>
                © ChanthanaThaiCook. Tous droits réservés.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ChanthanaEmailChangeConfirmation;

// ==================== STYLES ====================

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '0',
};

const container = {
  backgroundColor: '#FEF7E0',
  margin: '0 auto',
  borderRadius: '12px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '2px 20px 16px 16px',
};

const headerSection = {
  background: 'linear-gradient(135deg, #3B82F6 0%, #FFD700 100%)',
  borderLeft: '5px solid #3B82F6',
  padding: '1px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
};

const headerContent = {
  background: 'radial-gradient(#FEF7E0 60%, #ffffff)',
  padding: '20px 16px',
  textAlign: 'center' as const,
  borderRadius: '0',
};

const brandName = {
  color: '#2D5016',
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

const contentSection = {
  padding: '20px 16px',
};

const h1 = {
  color: '#2D5016',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
  lineHeight: '1.3',
};

const h3 = {
  color: '#2D5016',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#2D5016',
  fontSize: '20px',
  fontWeight: '600' as const,
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
};

const welcomeText = {
  color: '#2D5016',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
};

const greetingSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderLeft: '5px solid #3B82F6',
  padding: '20px',
  margin: '24px 0',
};

const detailsSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
};

const emailBox = {
  backgroundColor: '#FEF7E0',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0',
  border: '1px solid rgba(255, 123, 84, 0.2)',
};

const emailLabel = {
  fontSize: '13px',
  color: '#666',
  margin: '0 0 8px 0',
  fontWeight: '600' as const,
};

const emailValue = {
  fontSize: '16px',
  color: '#999',
  margin: '0',
  textDecoration: 'line-through',
};

const emailValueNew = {
  fontSize: '16px',
  color: '#2D5016',
  margin: '0',
  fontWeight: '600' as const,
};

const arrowContainer = {
  textAlign: 'center' as const,
  margin: '8px 0',
};

const securitySection = {
  backgroundColor: '#FFF4E6',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.3)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
};

const securityText = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '12px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const primaryButton = {
  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
};

const expirationSection = {
  backgroundColor: '#FFEDD5',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  padding: '16px',
  margin: '24px 0',
};

const expirationText = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0',
};

const link = {
  color: '#3B82F6',
  textDecoration: 'underline',
};

const iconCircleBlueGold = {
  width: '80px',
  height: '80px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3B82F6 0%, #FFD700 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const signatureSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
};

const signatureIconCircle = {
  width: '48px',
  height: '48px',
  margin: '0 auto',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3B82F6 0%, #FFD700 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const signature = {
  color: '#2D5016',
  fontSize: '16px',
  textAlign: 'center' as const,
};

const signatureTeam = {
  color: '#FF7B54',
  fontSize: '18px',
};

const inlineLogoStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
};

const footer = {
  borderTop: '1px solid #e6e6e6',
  paddingTop: '24px',
  marginTop: '32px',
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
