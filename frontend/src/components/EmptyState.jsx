// src/components/EmptyState.jsx
import { Stack, Text, Center } from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';

const EmptyState = ({ text }) => (
  <Center h={400}>
    <Stack align="center" spacing="md">
      <IconMessageCircle size={48} color="gray" />
      <Text color="dimmed">{text}</Text>
    </Stack>
  </Center>
);

export default EmptyState;