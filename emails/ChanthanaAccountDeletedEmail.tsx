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

interface ChanthanaAccountDeletedEmailProps {
  userName?: string;
  userEmail?: string;
  deletionDate?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ChanthanaAccountDeletedEmail = ({
  userName = '',
  userEmail = 'utilisateur@email.com',
  deletionDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
}: ChanthanaAccountDeletedEmailProps) => {
  const previewText = `Confirmation de suppression de votre compte - ChanthanaThaiCook`;

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
              <Heading style={h1}>Votre compte a été supprimé</Heading>

              {/* Trash Icon */}
              <div style={iconCircleRedGray}>
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>

              {userName && <Text style={greeting}>{userName},</Text>}

              <Text style={welcomeText}>
                Nous vous confirmons que votre compte ChanthanaThaiCook a été <strong>définitivement supprimé</strong>.
              </Text>
            </Section>

            {/* Deletion Details */}
            <Section style={detailsSection}>
              <Heading style={h3}>Détails de la suppression</Heading>

              <div style={infoBox}>
                <Text style={infoLabel}>Adresse email du compte :</Text>
                <Text style={infoValue}>{userEmail}</Text>
              </div>

              <div style={infoBox}>
                <Text style={infoLabel}>Date de suppression :</Text>
                <Text style={infoValue}>{deletionDate}</Text>
              </div>

              <div style={infoBox}>
                <Text style={infoLabel}>Statut :</Text>
                <Text style={statusValue}>Supprimé définitivement</Text>
              </div>
            </Section>

            {/* What was deleted */}
            <Section style={gdprSection}>
              <Heading style={h3}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D5016"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: '8px',
                  }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Données supprimées (RGPD)
              </Heading>

              <Text style={gdprText}>
                Conformément au règlement européen sur la protection des données (RGPD), les informations suivantes ont été supprimées ou anonymisées :
              </Text>

              <ul style={listStyle}>
                <li style={listItem}>Vos informations personnelles (nom, prénom, téléphone, adresse)</li>
                <li style={listItem}>Votre adresse email</li>
                <li style={listItem}>Votre photo de profil</li>
                <li style={listItem}>Vos préférences alimentaires</li>
                <li style={listItem}>Votre mot de passe (déjà chiffré)</li>
                <li style={listItem}>Vos sessions de connexion</li>
              </ul>
            </Section>

            {/* What we keep */}
            <Section style={retentionSection}>
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
                Données conservées (conformité légale)
              </Heading>

              <Text style={retentionText}>
                Pour des raisons de conformité fiscale et légale, certaines données sont conservées de manière anonymisée :
              </Text>

              <ul style={listStyle}>
                <li style={listItem}><strong>Historique des commandes :</strong> Conservé 10 ans (obligation comptable)</li>
                <li style={listItem}><strong>Factures :</strong> Archivées sans données personnelles identifiables</li>
                <li style={listItem}><strong>Paiements :</strong> Références de transactions (obligation fiscale)</li>
              </ul>

              <Text style={retentionNotice}>
                ℹ️ Ces données ne peuvent plus être associées à votre identité personnelle.
              </Text>
            </Section>

            {/* Return Section */}
            <Section style={returnSection}>
              <Heading style={h2}>Vous nous manquerez ! 😢</Heading>

              <Text style={returnText}>
                Nous sommes <strong style={highlight}>tristes</strong> de vous voir partir. Votre satisfaction est notre priorité et nous espérons vous revoir bientôt.
              </Text>

              <Text style={returnText}>
                Si vous changez d'avis, vous pouvez créer un nouveau compte à tout moment et redécouvrir nos délicieux plats thaïlandais authentiques.
              </Text>

              {/* Return Button */}
              <div style={buttonContainer}>
                <Link href={`${baseUrl}/`} style={{ textDecoration: 'none' }}>
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
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          Retourner sur ChanthanaThaiCook
                        </td>
                      </tr>
                    </table>
                  </div>
                </Link>
              </div>
            </Section>

            {/* Contact Section */}
            <Section style={contactSection}>
              <Text style={contactText}>
                <strong>Une question sur la suppression de vos données ?</strong>
              </Text>
              <Text style={contactText}>
                Contactez-nous à{' '}
                <Link href="mailto:support@chanthanathaccook.fr" style={link}>
                  support@chanthanathaccook.fr
                </Link>
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
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <Text style={signature}>
                            <strong>Au revoir et à bientôt ! </strong>
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
                Vous recevez cet email pour confirmer la suppression de votre compte ChanthanaThaiCook.
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

export default ChanthanaAccountDeletedEmail;

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
  border: '1px solid rgba(220, 38, 38, 0.2)',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '2px 20px 16px 16px',
};

const headerSection = {
  background: 'linear-gradient(135deg, #DC2626 0%, #6B7280 100%)',
  borderLeft: '5px solid #DC2626',
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
  color: '#DC2626',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
  lineHeight: '1.3',
};

const h2 = {
  color: '#2D5016',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
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
  border: '1px solid rgba(220, 38, 38, 0.2)',
  borderLeft: '5px solid #DC2626',
  padding: '20px',
  margin: '24px 0',
};

const detailsSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(220, 38, 38, 0.2)',
  borderLeft: '5px solid #DC2626',
  padding: '20px',
  margin: '24px 0',
};

const infoBox = {
  backgroundColor: '#FEF7E0',
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '8px 0',
  border: '1px solid rgba(220, 38, 38, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const infoLabel = {
  fontSize: '13px',
  color: '#666',
  margin: '0',
  fontWeight: '600' as const,
};

const infoValue = {
  fontSize: '15px',
  color: '#2D5016',
  margin: '0',
};

const statusValue = {
  fontSize: '15px',
  color: '#DC2626',
  margin: '0',
  fontWeight: '600' as const,
};

const gdprSection = {
  backgroundColor: '#F0FDF4',
  borderRadius: '8px',
  border: '1px solid rgba(45, 80, 22, 0.2)',
  borderLeft: '5px solid #2D5016',
  padding: '20px',
  margin: '24px 0',
};

const gdprText = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px 0',
};

const listStyle = {
  margin: '12px 0',
  paddingLeft: '20px',
};

const listItem = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const retentionSection = {
  backgroundColor: '#FFF7ED',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
};

const retentionText = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px 0',
};

const retentionNotice = {
  color: '#666',
  fontSize: '13px',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
  margin: '16px 0 0 0',
};

const returnSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
};

const returnText = {
  color: '#2D5016',
  fontSize: '15px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '12px 0',
};

const highlight = {
  color: '#FF7B54',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0 0 0',
};

const primaryButton = {
  background: 'linear-gradient(135deg, #FF7B54 0%, #DC2626 100%)',
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
  boxShadow: '0 4px 6px rgba(255, 123, 84, 0.3)',
};

const contactSection = {
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const contactText = {
  color: '#2D5016',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const link = {
  color: '#3B82F6',
  textDecoration: 'underline',
};

const iconCircleRedGray = {
  width: '80px',
  height: '80px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #DC2626 0%, #6B7280 100%)',
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
  background: 'linear-gradient(135deg, #FF7B54 0%, #FFD700 100%)',
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
