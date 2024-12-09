import { Container, Title, Text, Grid, Card, Avatar, Group } from '@mantine/core';
import { HeaderMegaMenu } from '../components/HeaderMegaMenu';
import { FooterSocial } from '../components/FooterSocial';
import { FooterCentered } from '../components/FooterCentered';

export default function AboutUs() {
  // Sample team data
  const teamMembers = [
    {
      name: 'Usaid Afzal',
      role: 'Founder & CEO',
      avatar: 'https://via.placeholder.com/150',
    },
    {
      name: 'Sahar Iqbal',
      role: 'CTO',
      avatar: 'https://via.placeholder.com/150',
    },
    {
      name: 'Adnan Johnson',
      role: 'Designer',
      avatar: 'https://via.placeholder.com/150',
    },
  ];

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
            About Us
          </Title>
          <Text
            style={{
              color: 'black',
              fontSize: '1.125rem',
              marginBottom: '32px',
            }}
          >
            We are passionate about connecting pets and people. Learn more about our mission, vision, and the amazing
            team behind the platform.
          </Text>
        </Container>
      </div>

      {/* Mission Section */}
      <Container style={{ marginTop: '40px', marginBottom: '40px' }}>
        <Title
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '16px',
          }}
        >
          Our Mission
        </Title>
        <Text
          style={{
            textAlign: 'center',
            fontSize: '1rem',
            color: '#6c757d',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          At Purrfect Match, our mission is to create a seamless platform that brings together pet lovers, adopters, and
          sellers. We aim to make the process of finding a pet transparent, enjoyable, and stress-free while promoting
          responsible pet ownership.
        </Text>
      </Container>

      {/* Team Section */}
      <Container>
        <Title
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '32px',
          }}
        >
          Meet Our Team
        </Title>
        <Grid>
          {teamMembers.map((member, index) => (
            <Grid.Col key={index} xs={12} sm={6} md={4}>
              <Card
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  size={80}
                  style={{
                    margin: '0 auto',
                    marginBottom: '16px',
                  }}
                />
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: '1.25rem',
                    marginBottom: '8px',
                  }}
                >
                  {member.name}
                </Text>
                <Text
                  style={{
                    fontSize: '0.875rem',
                    color: '#6c757d',
                  }}
                >
                  {member.role}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <FooterCentered />
    </>
  );
}
