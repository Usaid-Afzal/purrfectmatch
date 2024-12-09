import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, useMantineTheme } from '@mantine/core';

export function InputWithButton(props) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '2rem',
      }}
    >
      <TextInput
        radius="xl"
        size="md"
        placeholder="Search for pets..." 
        rightSectionWidth={42}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>
        }
        style={{ width: '300px' }} // Set a fixed width
        {...props}
      />
    </div>
  );
}