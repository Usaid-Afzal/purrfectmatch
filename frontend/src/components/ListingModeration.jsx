import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  Button,
  Stack,
  Modal,
  Image,
  Select,
  TextInput,
  Pagination,
  Title,
  Loader,
  Center,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconSearch, IconEye } from '@tabler/icons-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ListingModeration = () => {
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!token || !isAdmin()) {
      navigate('/login');
    }
  }, [token, isAdmin, navigate]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/admin/listings/moderation', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setListings(data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch listings',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/listings/${id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      notifications.show({
        title: 'Success',
        message: 'Listing approved successfully',
        color: 'green'
      });
      
      fetchListings();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to approve listing',
        color: 'red'
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/listings/${id}/reject`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      notifications.show({
        title: 'Success',
        message: 'Listing rejected successfully',
        color: 'green'
      });
      
      fetchListings();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to reject listing',
        color: 'red'
      });
    }
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  const filteredListings = listings.filter(listing => {
    const matchesStatus = status === 'all' || listing.status === status;
    const matchesSearch = listing.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedListings = filteredListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Paper p="md">
      <Stack spacing="md">
        <Group position="apart">
          <Title order={2}>Listing Moderation</Title>
          <Group>
            <Select
              value={status}
              onChange={setStatus}
              data={[
                { value: 'all', label: 'All Listings' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
              style={{ width: 200 }}
            />
            <TextInput
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<IconSearch size={14} />}
            />
          </Group>
        </Group>

        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedListings.map((listing) => (
              <tr key={listing._id}>
                <td>{listing.title}</td>
                <td>{listing.type}</td>
                <td>${listing.price}</td>
                <td>{listing.location}</td>
                <td>
                  <Badge 
                    color={
                      listing.status === 'approved' ? 'green' : 
                      listing.status === 'rejected' ? 'red' : 'yellow'
                    }
                  >
                    {listing.status}
                  </Badge>
                </td>
                <td>
                  <Group spacing={0}>
                    <ActionIcon 
                      onClick={() => {
                        setSelectedListing(listing);
                        setModalOpen(true);
                      }}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    {listing.status === 'pending' && (
                      <>
                        <ActionIcon 
                          color="green"
                          onClick={() => handleApprove(listing._id)}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon 
                          color="red"
                          onClick={() => handleReject(listing._id)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </>
                    )}
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedListing(null);
          }}
          size="lg"
          title="Listing Details"
        >
          {selectedListing && (
            <Stack>
              <Image
                src={selectedListing.images[0]}
                height={300}
                fit="contain"
              />
              <Title order={3}>{selectedListing.title}</Title>
              <Text>{selectedListing.description}</Text>
              <Group>
                <Badge>{selectedListing.type}</Badge>
                <Badge color="blue">${selectedListing.price}</Badge>
                <Badge color="gray">{selectedListing.breed}</Badge>
                <Badge color="gray">{selectedListing.age} years</Badge>
              </Group>
              <Text size="sm">
                <b>Location:</b> {selectedListing.location}
              </Text>
              <Text size="sm">
                <b>Vaccinated:</b> {selectedListing.vaccinated ? 'Yes' : 'No'}
              </Text>
              <Text size="sm">
                <b>Neutered:</b> {selectedListing.neutered ? 'Yes' : 'No'}
              </Text>
              {selectedListing.status === 'pending' && (
                <Group position="apart">
                  <Button 
                    color="green"
                    onClick={() => {
                      handleApprove(selectedListing._id);
                      setModalOpen(false);
                    }}
                  >
                    Approve Listing
                  </Button>
                  <Button 
                    color="red"
                    onClick={() => {
                      handleReject(selectedListing._id);
                      setModalOpen(false);
                    }}
                  >
                    Reject Listing
                  </Button>
                </Group>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Paper>
  );
};

export default ListingModeration;