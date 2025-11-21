import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ChanthanaWelcomeEmailProps {
  userName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ChanthanaWelcomeEmail = ({
  userName = '',
}: ChanthanaWelcomeEmailProps) => {
  const previewText = `Sawat dee Kha ! Bienvenue dans la famille ChanthanaThaiCook`;

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
                font-size: 14px !important; /* Reduce font size for mobile */
                white-space: nowrap !important; /* Force single line, but with reduced font size to prevent overflow */
              }
              .signature-column {
                width: 100% !important;
                display: block !important;
                padding: 8px 0 !important;
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

          {/* Contenu principal */}
          <Section style={contentSection}>
            {/* Titre principal avec salutation thaï */}
            <Section style={greetingSection}>
              <Heading style={h1}>Sawatdee !</Heading>
              <Img
                src={`${baseUrl}/media/animations/ui/Sawadee.gif`}
                alt="Sawatdee Animation"
                width="128"
                height="72"
                style={sawatdeeGifStyle}
              />

              {userName && <Text style={greeting}>{userName},</Text>}

              <Text style={welcomeText}>
                Nous sommes <strong style={highlight}>ravis</strong> de vous
                accueillir dans notre famille !
              </Text>
            </Section>

            {/* Section Pourquoi nous rejoindre */}
            <Section style={whySection}>
              <Link href={`${baseUrl}/`} style={{ textDecoration: 'none' }}>
                <Heading style={h2}>
                  🌟 En rejoignant ChanthanaThaiCook, vous profitez d'une
                  expérience culinaire exceptionnelle
                </Heading>
                <Text style={subtitle}>
                  Qui vous transporte directement au cœur de la Thaïlande
                  authentique
                </Text>
              </Link>
            </Section>

            {/* 4 avantages en grille - Design identique à la page a-propos */}
            <Section style={featuresSection}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td className="column" style={featureCell}>
                    {/* Heart Icon - Gradient orange to gold */}
                    <Link
                      href={`${baseUrl}/`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={featureCreamBox}>
                        <div style={iconCircleOrangeGold}>
                          <svg
                            width="32"
                            height="32"
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
                        <Text style={featureTitle}>Cuisine Authentique</Text>
                        <Text style={featureDesc}>
                          Des recettes traditionnelles thaïlandaises préparées
                          avec amour et des ingrédients frais importés
                          directement de Thaïlande
                        </Text>
                      </div>
                    </Link>
                  </td>
                  <td
                    className="column"
                    style={{ ...featureCell, ...cellSpacing }}
                  >
                    {/* Utensils Icon - Gradient green to orange */}
                    <Link
                      href={`${baseUrl}/commander`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={featureCreamBox}>
                        <div style={iconCircleGreenOrange}>
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                            <path d="M7 2v20"></path>
                            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                          </svg>
                        </div>
                        <Text style={featureTitle}>Commande Facile</Text>
                        <Text style={featureDesc}>
                          Commandez vos plats préférés en quelques clics pour
                          une récupération rapide et une expérience sans stress
                        </Text>
                      </div>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td
                    className="column"
                    style={{ ...featureCell, paddingTop: '16px' }}
                  >
                    {/* Calendar Icon - Gradient gold to green */}
                    <Link
                      href={`${baseUrl}/evenements`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={featureCreamBox}>
                        <div style={iconCircleGoldGreen}>
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <Text style={featureTitle}>Événements Spéciaux</Text>
                        <Text style={featureDesc}>
                          Organisez vos événements avec nos menus personnalisés
                          pour groupes et célébrations mémorables
                        </Text>
                      </div>
                    </Link>
                  </td>
                  <td
                    className="column"
                    style={{
                      ...featureCell,
                      ...cellSpacing,
                      paddingTop: '16px',
                    }}
                  >
                    {/* Award Icon - Gradient orange to red */}
                    <Link
                      href={`${baseUrl}/a-propos`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={featureCreamBox}>
                        <div style={iconCircleOrangeRed}>
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="8" r="7"></circle>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                          </svg>
                        </div>
                        <Text style={featureTitle}>Excellence Reconnue</Text>
                        <Text style={featureDesc}>
                          Plus de 20 ans d'expérience culinaire avec une passion
                          authentique pour la gastronomie thaïlandaise
                        </Text>
                      </div>
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Section Menus renouvelés */}
            <Section style={renewSection}>
              <Link
                href={`${baseUrl}/commander`}
                style={{ textDecoration: 'none' }}
              >
                <Text style={renewText}>
                  <svg
                    width="20"
                    height="20"
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
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                    <path d="M7 2v20"></path>
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                  </svg>
                  Je propose des{' '}
                  <strong style={{ color: '#FF7B54' }}>
                    menus complets à emporter
                  </strong>{' '}
                  et autres délices qui{' '}
                  <strong>se renouvellent chaque semaine</strong>. Partez à la
                  découverte de ces plats authentiques et laissez-vous
                  surprendre !
                </Text>
              </Link>
            </Section>

            {/* Boutons d'action */}
            <Section style={buttonSection}>
              <table cellPadding="0" cellSpacing="0" width="100%">
                <tr>
                  <td
                    align="center"
                    className="button-column"
                    style={{ padding: '0 5px' }}
                  >
                    <Link
                      href={`${baseUrl}/`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={primaryButton}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ margin: '0 auto' }}
                        >
                          <tr>
                            <td
                              style={{
                                paddingRight: '8px',
                                verticalAlign: 'middle',
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                              </svg>
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>Accueil</td>
                          </tr>
                        </table>
                      </div>
                    </Link>
                  </td>
                  <td
                    align="center"
                    className="button-column"
                    style={{ padding: '0 5px' }}
                  >
                    <Link
                      href={`${baseUrl}/profil`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={secondaryButton}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ margin: '0 auto' }}
                        >
                          <tr>
                            <td
                              style={{
                                paddingRight: '8px',
                                verticalAlign: 'middle',
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                              Compléter mon profil
                            </td>
                          </tr>
                        </table>
                      </div>
                    </Link>
                  </td>
                  <td
                    align="center"
                    className="button-column"
                    style={{ padding: '0 5px' }}
                  >
                    <Link
                      href={`${baseUrl}/nous-trouver`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={tertiaryButton}>
                        <table
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ margin: '0 auto' }}
                        >
                          <tr>
                            <td
                              style={{
                                paddingRight: '8px',
                                verticalAlign: 'middle',
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                              Nous trouver
                            </td>
                          </tr>
                        </table>
                      </div>
                    </Link>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Signature */}
            <Section style={signatureSection}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td align="center">
                    <table cellPadding="0" cellSpacing="0">
                      <tr>
                        <td
                          className="signature-column"
                          style={{
                            paddingRight: '15px',
                            verticalAlign: 'middle',
                          }}
                        >
                          {/* Utensils Icon */}
                          <div style={signatureIconCircleOrangeGold}>
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
                        <td
                          className="signature-column"
                          style={{ verticalAlign: 'middle' }}
                        >
                          <Text style={signature}>
                            <strong>Merci pour votre confiance ! </strong>
                            <strong style={signatureTeam}>
                              ChanthanaThaiCook
                            </strong>
                          </Text>
                        </td>
                        <td
                          className="signature-column"
                          style={{
                            paddingLeft: '15px',
                            verticalAlign: 'middle',
                          }}
                        >
                          {/* Heart Icon */}
                          <div style={signatureIconCircleGreenOrange}>
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
                              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                              <path d="M7 2v20"></path>
                              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                            </svg>
                          </div>
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
                Vous recevez cet email car vous avez créé un compte sur
                ChanthanaThaiCook.
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

export default ChanthanaWelcomeEmail;

// ==================== STYLES ====================

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
  color: '#2D5016', // Vert Thaï - IDENTIQUE à l'image
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

const h2 = {
  color: '#2D5016',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 12px 0',
  lineHeight: '1.4',
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
  fontSize: '18px',
  lineHeight: '28px',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const highlight = {
  color: '#FF7B54',
  fontWeight: '600' as const,
};

const divider = {
  borderColor: '#e6e6e6',
  margin: '16px 0',
};

const greetingSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54', // border-thai-orange/20
  padding: '20px',
  margin: '24px 0',
};

const whySection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54', // border-thai-orange/20
  padding: '20px',
  margin: '24px 0',
};

const subtitle = {
  color: '#2D5016',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '8px 0 24px',
  fontStyle: 'italic' as const,
};

const featuresSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54', // border-thai-orange/20
  padding: '20px',
  margin: '24px 0',
};

const featureCell = {
  verticalAlign: 'top' as const,
  textAlign: 'center' as const,
};

const cellSpacing = {
  paddingLeft: '16px',
};

// Cercles d'icônes avec gradients - identiques à la page a-propos
const iconCircleOrangeGold = {
  width: '64px',
  height: '64px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF7B54 0%, #FFD700 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconCircleGreenOrange = {
  width: '64px',
  height: '64px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #2D5016 0%, #FF7B54 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconCircleGoldGreen = {
  width: '64px',
  height: '64px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FFD700 0%, #2D5016 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconCircleOrangeRed = {
  width: '64px',
  height: '64px',
  margin: '0 auto 16px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF7B54 0%, #DC2626 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const signatureIconCircleGreenOrange = {
  width: '64px',
  height: '64px',
  margin: '0 auto', // No bottom margin
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FFD700 0%, #2D5016 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const signatureIconCircleOrangeGold = {
  width: '64px',
  height: '64px',
  margin: '0 auto', // No bottom margin
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF7B54 0%, #FFD700 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const featureTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#2D5016',
  margin: '8px 0',
};

const featureDesc = {
  fontSize: '14px',
  color: '#2D5016',
  lineHeight: '20px',
  margin: '4px 0',
};

const featureCreamBox = {
  backgroundColor: '#FEF7E0', // Fond crème
  borderRadius: '8px',
  padding: '12px',
  border: '1px solid rgba(255, 123, 84, 0.15)',
  borderLeft: '5px solid #2D5016', // Bordure subtile
  height: '100%',
};


const renewSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54', // border-thai-orange/20
  padding: '20px',
  margin: '24px 0',
};

const renewText = {
  color: '#2D5016',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0',
};

const renewLink = {
  color: '#FF7B54',
  textDecoration: 'underline',
  fontWeight: '600' as const,
};

const statsSection = {
  margin: '24px 0',
};

const statCell = {
  textAlign: 'center' as const,
  padding: '12px',
  backgroundColor: '#FEF7E0',
  borderRadius: '8px',
};

const statNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#FF7B54',
  marginBottom: '4px',
};

const statLabel = {
  fontSize: '12px',
  color: '#2D5016',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '12px 0',
};

const primaryButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // bg-white/90
  borderRadius: '9999px', // rounded-full
  color: '#2D5016',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '8px 16px', // px-4 py-2
  border: '1px solid rgba(255, 123, 84, 0.2)', // border-thai-orange/20
  cursor: 'pointer',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
};

const secondaryButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // bg-white/90
  borderRadius: '9999px', // rounded-full
  color: '#FF7B54',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '8px 16px', // px-4 py-2
  border: '1px solid rgba(255, 123, 84, 0.2)', // border-thai-orange/20
  cursor: 'pointer',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
};

const tertiaryButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // bg-white/90
  borderRadius: '9999px', // rounded-full
  color: '#2D5016', // text-thai-green
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '8px 16px', // px-4 py-2
  border: '1px solid rgba(255, 123, 84, 0.2)', // border-thai-orange/20
  cursor: 'pointer',
  boxShadow:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
};

const signatureSection = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(255, 123, 84, 0.2)',
  borderLeft: '5px solid #FF7B54',
  padding: '20px',
  margin: '24px 0',
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

const sawatdeeGifStyle = {
  margin: '0 auto',
  display: 'block',
  paddingBottom: '20px', // Add some space below the GIF
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
