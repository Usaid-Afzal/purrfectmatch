// src/pages/admin/Dashboard.jsx
import { useState } from 'react';
import {
  AppShell,
  Group,
  Title,
  UnstyledButton,
  ThemeIcon,
  Text,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconUsers,
  IconGauge,
  IconList,
  IconSettings,
  IconPlugConnected,
  IconCoin,
} from '@tabler/icons-react';
import UserManagement from '../components/UserManagement';
import SystemMonitoring from '../components/SystemMonitoring';
import ListingModeration from '../components/ListingModeration';
import Settings from '../components/Settings';
import FinancialOversight from '../components/FinancialOversight';

const navItems = [
  { icon: IconUsers, color: 'blue', label: 'User Management', component: UserManagement },
  { icon: IconGauge, color: 'teal', label: 'System Monitoring', component: SystemMonitoring },
  { icon: IconList, color: 'violet', label: 'Listing Moderation', component: ListingModeration },
  { icon: IconSettings, color: 'grape', label: 'Settings', component: Settings },
  { icon: IconCoin, color: 'yellow', label: 'Financial Oversight', component: FinancialOversight },
];

const NavbarButton = ({ icon: Icon, color, label, active, onClick }) => (
  <UnstyledButton
    onClick={onClick}
    style={(theme) => ({
      display: 'block',
      width: '100%',
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: active ? theme.colors[color][6] : theme.colors.gray[7],
      backgroundColor: active ? theme.colors[color][0] : 'transparent',
      '&:hover': {
        backgroundColor: theme.colors[color][0],
      },
    })}
  >
    <Group>
      <ThemeIcon color={color} variant={active ? 'filled' : 'light'}>
        <Icon size={16} />
      </ThemeIcon>
      <Text size="sm">{label}</Text>
    </Group>
  </UnstyledButton>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('User Management');
  const ActiveComponent = navItems.find(item => item.label === activeTab)?.component;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: false }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Title order={3}>Admin Panel</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack spacing="xs">
          {navItems.map((item) => (
            <NavbarButton
              key={item.label}
              {...item}
              active={activeTab === item.label}
              onClick={() => setActiveTab(item.label)}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {ActiveComponent && <ActiveComponent />}
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminDashboard;