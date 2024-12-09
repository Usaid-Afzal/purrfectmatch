import { FooterCentered } from '../components/FooterCentered';
import { FooterSocial } from '../components/FooterSocial';
import { HeaderMegaMenu } from '../components/HeaderMegaMenu';
import { HeroImageBackground } from '../components/HeroImageBackground';
import { Container, Grid, Card, Text, Overlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  return (
    
    <>
      <HeaderMegaMenu />
      <HeroImageBackground />
      <Container size="lg" py="xl">
  <Grid>
    <Grid.Col span={6}>
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ 
          cursor: 'pointer',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1415369629372-26f2fe60c467)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
        onClick={() => navigate('/listings')}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 'inherit',
          }}
        />
        <Text size="xl" weight={500} align="center" style={{ color: 'white', zIndex: 1 }}>
          Adopt a Pet
        </Text>
      </Card>
    </Grid.Col>
    
    <Grid.Col span={6}>
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ 
          cursor: 'pointer',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1444212477490-ca407925329e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
        onClick={() => navigate('/create-listing')}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 'inherit',
          }}
        />
        <Text size="xl" weight={500} align="center" style={{ color: 'white', zIndex: 1 }}>
          Re-home a Pet
        </Text>
      </Card>
    </Grid.Col>
  </Grid>
</Container>
      <FooterCentered />
    </>
  );
}

export default Home;
