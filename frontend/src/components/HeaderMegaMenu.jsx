import {
    IconBook,
    IconChartPie3,
    IconChevronDown,
    IconCode,
    IconCoin,
    IconFingerprint,
    IconNotification,
  } from '@tabler/icons-react';
  import {
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
  } from '@mantine/core';
  import { useDisclosure } from '@mantine/hooks';
  import { MantineLogo } from '@mantinex/mantine-logo';
  import classes from '../styles/HeaderMegaMenu.module.css';
  import { useAuth } from '../contexts/AuthContext';
  import { notifications } from '@mantine/notifications';
  import { useNavigate, Link } from 'react-router-dom';

  const mockdata = [
    {
      icon: IconCode,
      title: 'Dogs',
      description: '',
    },
    {
      icon: IconCoin,
      title: 'Cats',
      description: '',
    },
    {
      icon: IconBook,
      title: 'Birds',
      description: '',
    },
    {
      icon: IconFingerprint,
      title: 'Small Animals',
      description: '',
    },
  ];
  
  export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green'
      });
      navigate('/');
    };
  
    const links = mockdata.map((item) => (
      <UnstyledButton className={classes.subLink} key={item.title}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon size={22} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    ));
  
    return (
      <Box pb={0}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
          <img src='/src/assets/logo.png' alt='Logo' width={30} height={30} />
  
            <Group h="100%" gap={0} visibleFrom="sm">
              <a href="/" className={classes.link}>
                Home
              </a>
              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <a href="/listings" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Browse Listings
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>
  
                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Categories:</Text>
                    <Anchor href="/listings" fz="xs">
                      View all
                    </Anchor>
                  </Group>
  
                  <Divider my="sm" />
  
                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>
  
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="/aboutus" className={classes.link}>
                About Us
              </a>
              <a href="/faq" className={classes.link}>
                FAQ
              </a>
            </Group>
  
            <Group visibleFrom="sm">
              {user ? (
                <>
                  <Text weight={500}>{user.username}</Text>
                  <Button variant="default" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <Button variant="default" component={Link} to="/login">
                  Sign In
                </Button>
              )}
            </Group>
  
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>
  
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            <Divider my="sm" />
  
            <a href="#" className={classes.link}>
              Home
            </a>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5} ml={15}>
                  Browse Listings
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              About Us
            </a>
            <a href="#" className={classes.link}>
              FAQ
            </a>
  
            <Divider my="sm" />
  
            <Group justify="center" grow pb="xl" px="md">
            <Button component='a' href='/login'>Sign In</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
    );
  }