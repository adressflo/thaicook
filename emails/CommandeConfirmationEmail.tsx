import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

export const CommandeConfirmationEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Aperçu du bouton de suivi de commande</Preview>
      <Body style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif', backgroundColor: '#ffffff' }}>
        <Container style={{ margin: '0 auto', padding: '20px', textAlign: 'center' as const }}>
          <Section style={{ margin: '20px 0' }}>
            <Button 
              style={{
                backgroundColor: '#F97316',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '8px',
                fontWeight: 'bold' as const,
                textDecoration: 'none',
                display: 'inline-block',
              }}
              href="/suivi-commande/ID_COMMANDE_ICI" // Placeholder link
            >
              Suivre ma commande
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CommandeConfirmationEmail;
