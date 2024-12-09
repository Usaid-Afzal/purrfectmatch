import { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  Avatar,
  UnstyledButton,
} from '@mantine/core';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';

const ChatList = ({ currentUser, onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const chatsRef = ref(db, 'chats');
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatList = Object.entries(data)
          .filter(([chatId]) => chatId.includes(currentUser.uid))
          .map(([chatId, chat]) => ({
            id: chatId,
            ...chat,
            lastMessage: Object.values(chat.messages).pop(),
          }));
        setChats(chatList);
      }
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Stack spacing="md">
        <Text weight={500} size="lg">Messages</Text>
        {chats.map((chat) => (
          <UnstyledButton
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            sx={(theme) => ({
              padding: theme.spacing.sm,
              borderRadius: theme.radius.md,
              '&:hover': {
                backgroundColor: theme.colors.gray[0],
              },
            })}
          >
            <Group>
              <Avatar radius="xl" />
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {chat.otherUser.name}
                </Text>
                <Text size="xs" color="dimmed">
                  {chat.lastMessage?.text}
                </Text>
              </div>
              <Text size="xs" color="dimmed">
                {new Date(chat.lastMessage?.timestamp).toLocaleDateString()}
              </Text>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Paper>
  );
};

export default ChatList;