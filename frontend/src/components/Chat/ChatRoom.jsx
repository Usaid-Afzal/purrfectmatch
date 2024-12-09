import { useState, useEffect } from 'react';
import {
  Paper,
  TextInput,
  Button,
  Stack,
  Group,
  Text,
  ScrollArea,
  Avatar,
} from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { db } from '../../firebase';
import { ref, push, onValue } from 'firebase/database';

const ChatRoom = ({ currentUser, otherUser, listingId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const chatId = [currentUser.uid, otherUser.uid].sort().join('-');

  useEffect(() => {
    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setMessages(messagesList);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    await push(messagesRef, {
      text: message,
      senderId: currentUser.uid,
      timestamp: Date.now(),
      listingId,
    });

    setMessage('');
  };

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Stack spacing="md" h={500}>
        <Group position="apart">
          <Group>
            <Avatar src={otherUser.avatar} radius="xl" />
            <Text weight={500}>{otherUser.name}</Text>
          </Group>
        </Group>

        <ScrollArea h={400} offsetScrollbars>
          <Stack spacing="xs">
            {messages.map((msg) => (
              <Paper
                key={msg.id}
                p="xs"
                radius="md"
                bg={msg.senderId === currentUser.uid ? 'blue.1' : 'gray.0'}
                style={{
                  alignSelf: msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Text size="sm">{msg.text}</Text>
                <Text size="xs" color="dimmed">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        <Group position="apart">
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            style={{ flex: 1 }}
          />
          <Button onClick={sendMessage} leftIcon={<IconSend size={16} />}>
            Send
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default ChatRoom;