import { Accordion, Container, Title, Text } from '@mantine/core';
import { HeaderMegaMenu } from '../components/HeaderMegaMenu';
import { FooterSocial } from '../components/FooterSocial';
import { FooterCentered } from '../components/FooterCentered';

export default function FAQ() {
  return (
    <>
    <HeaderMegaMenu />
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: '#f0b1b8',
          padding: '40px 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <Title
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              marginBottom: '16px',
            }}
          >
            Frequently Asked Questions
          </Title>
          <Text
            style={{
              color: '#6c757d',
              fontSize: '1.125rem',
              marginBottom: '32px',
            }}
          >
            Have questions? We’re here to help! Find answers to the most common questions below.
          </Text>
        </Container>
      </div>

      {/* FAQ Section */}
      <Container style={{ marginTop: '40px', marginBottom: '40px' }}>
        <Title
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '32px',
          }}
        >
          Your Questions Answered
        </Title>
        <Accordion>
          <Accordion.Item value="question-1">
            <Accordion.Control>How does Purrfect Match work?</Accordion.Control>
            <Accordion.Panel>
              Purrfect Match connects pet seekers, adopters, and sellers in one seamless platform. You can browse,
              filter, and communicate to find the perfect pet.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="question-2">
            <Accordion.Control>Is Purrfect Match free to use?</Accordion.Control>
            <Accordion.Panel>
              Yes! Browsing and searching for pets is completely free. However, some premium features may require a
              subscription.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="question-3">
            <Accordion.Control>How can I contact a seller or adopter?</Accordion.Control>
            <Accordion.Panel>
              Once you find a pet you like, you can use our secure in-app messaging system to communicate directly with
              the seller or adopter.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="question-4">
            <Accordion.Control>What types of pets can I find?</Accordion.Control>
            <Accordion.Panel>
              We feature a wide range of pets, including cats, dogs, birds, reptiles, and small mammals. Use our
              advanced filters to find your ideal companion.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="question-5">
            <Accordion.Control>Can I list my pet for adoption?</Accordion.Control>
            <Accordion.Panel>
              Absolutely! If you have a pet that needs a new home, you can list them on Purrfect Match by creating an
              account and providing details about the pet.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
      <FooterCentered />
    </>
  );
}
