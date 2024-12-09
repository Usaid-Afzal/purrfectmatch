// src/pages/Chat.jsx
import { useState } from 'react';
import { Container, Grid, Loader, Center } from '@mantine/core';
import ChatList from '../components/Chat/ChatList';
import ChatRoom from '../components/Chat/ChatRoom';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Chat = () => {
  const { currentUser } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Container size="xl" py="xl">
      <Grid>
        <Grid.Col span={4}>
          <ChatList 
            currentUser={currentUser} 
            onSelectChat={setSelectedChat} 
          />
        </Grid.Col>
        <Grid.Col span={8}>
          {selectedChat ? (
            <ChatRoom
              currentUser={currentUser}
              otherUser={selectedChat.otherUser}
              listingId={selectedChat.listingId}
            />
          ) : (
            <EmptyState text="Select a chat to start messaging" />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Chat;