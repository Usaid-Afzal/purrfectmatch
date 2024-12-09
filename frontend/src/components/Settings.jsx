import { useState } from 'react';
import {
  Paper,
  Title,
  Stack,
  Switch,
  NumberInput,
  TextInput,
  Button,
  Group,
  Divider,
  Text,
  Select,
  Accordion,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Pet Adoption Platform',
      contactEmail: 'admin@example.com',
      maxListingsPerUser: 10,
      requireListingApproval: true,
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      notificationFrequency: 'instant',
    },
    security: {
      passwordExpiration: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
    },
    payment: {
      currency: 'USD',
      transactionFee: 2.5,
      enableStripe: true,
      enablePayPal: false,
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');

      notifications.show({
        title: 'Success',
        message: 'Settings saved successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md">
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={2}>System Settings</Title>
          <Button
            leftIcon={<IconSettings size={16} />}
            loading={loading}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Group>

        <Accordion defaultValue="general">
          <Accordion.Item value="general">
            <Accordion.Control>General Settings</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="md">
                <TextInput
                  label="Site Name"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                />
                <TextInput
                  label="Contact Email"
                  value={settings.general.contactEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value }
                  })}
                />
                <NumberInput
                  label="Max Listings Per User"
                  value={settings.general.maxListingsPerUser}
                  onChange={(value) => setSettings({
                    ...settings,
                    general: { ...settings.general, maxListingsPerUser: value }
                  })}
                />
                <Switch
                  label="Require Listing Approval"
                  checked={settings.general.requireListingApproval}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, requireListingApproval: e.currentTarget.checked }
                  })}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="notifications">
            <Accordion.Control>Notification Settings</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="md">
                <Switch
                  label="Enable Email Notifications"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, enableEmailNotifications: e.currentTarget.checked }
                  })}
                />
                <Switch
                  label="Enable Push Notifications"
                  checked={settings.notifications.enablePushNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, enablePushNotifications: e.currentTarget.checked }
                  })}
                />
                <Select
                  label="Notification Frequency"
                  value={settings.notifications.notificationFrequency}
                  onChange={(value) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, notificationFrequency: value }
                  })}
                  data={[
                    { value: 'instant', label: 'Instant' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Digest' },
                  ]}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="security">
            <Accordion.Control>Security Settings</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="md">
                <NumberInput
                  label="Password Expiration (days)"
                  value={settings.security.passwordExpiration}
                  onChange={(value) => setSettings({
                    ...settings,
                    security: { ...settings.security, passwordExpiration: value }
                  })}
                />
                <NumberInput
                  label="Max Login Attempts"
                  value={settings.security.maxLoginAttempts}
                  onChange={(value) => setSettings({
                    ...settings,
                    security: { ...settings.security, maxLoginAttempts: value }
                  })}
                />
                <NumberInput
                  label="Session Timeout (minutes)"
                  value={settings.security.sessionTimeout}
                  onChange={(value) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: value }
                  })}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="payment">
            <Accordion.Control>Payment Settings</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="md">
                <Select
                  label="Currency"
                  value={settings.payment.currency}
                  onChange={(value) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, currency: value }
                  })}
                  data={[
                    { value: 'USD', label: 'US Dollar' },
                    { value: 'EUR', label: 'Euro' },
                    { value: 'GBP', label: 'British Pound' },
                  ]}
                />
                <NumberInput
                  label="Transaction Fee (%)"
                  value={settings.payment.transactionFee}
                  precision={2}
                  step={0.5}
                  onChange={(value) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, transactionFee: value }
                  })}
                />
                <Switch
                  label="Enable Stripe"
                  checked={settings.payment.enableStripe}
                  onChange={(e) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, enableStripe: e.currentTarget.checked }
                  })}
                />
                <Switch
                  label="Enable PayPal"
                  checked={settings.payment.enablePayPal}
                  onChange={(e) => setSettings({
                    ...settings,
                    payment: { ...settings.payment, enablePayPal: e.currentTarget.checked }
                  })}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
};

export default Settings;