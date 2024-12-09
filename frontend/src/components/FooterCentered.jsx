import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import { ActionIcon, Anchor, Group } from '@mantine/core';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../styles/FooterCentered.module.css';

const links = [
  { link: '/', label: 'Back To Home' },
  { link: '/listings', label: 'Browse Listings' },
  { link: '/aboutus', label: 'About Us' },
  { link: '/faq', label: 'FAQ' },
];

export function FooterCentered() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      //navigate to the link when clicked
    onClick={(event) => {
        event.preventDefault();
        window.location.href = link.link;
    }}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
      <img src='/src/assets/logo.png' alt='Logo' width={30} height={30} />

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}