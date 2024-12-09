import cx from 'clsx';
import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from '../styles/HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to Purrfect Match
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            The best place to find your new furry friend and give them a forever home.
          </Text>
        </Container>
        
      </div>
    </div>
  );
}