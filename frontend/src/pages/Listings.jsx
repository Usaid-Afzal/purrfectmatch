import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    Image,
    Text,
    Badge,
    Button,
    Group,
    Select,
    TextInput,
    Box,
    Stack,
    Paper,
    Flex,
    Loader,
    Center,
  } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { HeaderMegaMenu } from '../components/HeaderMegaMenu';
import { FooterCentered } from '../components/FooterCentered';
import axios from 'axios';


const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit: 12
      });
      if (animalType) params.append('type', animalType);
      if (location) params.append('location', location);

      const { data } = await axios.get(`http://localhost:5000/api/listings?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setListings(data.listings);
      setTotalPages(data.totalPages);
    } catch (error) {
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
  }, [page, animalType, location]);

  // Local search filter
  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <HeaderMegaMenu />
      <Container size="xl" py="xl">
        <Flex gap="md">
          {/* Sidebar Filters - same as before */}
          <Paper
            withBorder
            p="md"
            style={{
              position: "sticky",
              top: "1rem",
              height: "fit-content",
              minWidth: "250px",
            }}
          >
            <Stack spacing="md">
              <Text weight={500} size="lg">
                Filters
              </Text>
              <TextInput
                label="Search"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select
                label="Animal Type"
                placeholder="Select type"
                value={animalType}
                onChange={setAnimalType}
                data={[
                  { value: "dog", label: "Dog" },
                  { value: "cat", label: "Cat" },
                  { value: "bird", label: "Bird" },
                  { value: "other", label: "Other" },
                ]}
              />
              <Select
                label="Location"
                placeholder="Select location"
                value={location}
                onChange={setLocation}
                data={[
                  { value: "New York", label: "New York" },
                  { value: "Los Angeles", label: "Los Angeles" },
                  { value: "Chicago", label: "Chicago" },
                ]}
              />
            </Stack>
          </Paper>

          {/* Main Content */}
          <Box style={{ flex: 1 }}>
            {filteredListings.length === 0 ? (
              <Text align="center" color="dimmed" size="lg">
                No listings found
              </Text>
            ) : (
              <Grid gutter="md">
                {filteredListings.map((listing) => (
                  <Grid.Col
                    key={listing._id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{ height: "100%" }}
                    >
                      <Card.Section>
                        <Image
                          src={listing.images[0]}
                          height={200}
                          alt={listing.title}
                          fit="cover"
                        />
                      </Card.Section>

                      <Group position="apart" mt="md" mb="xs">
                        <Text weight={500}>{listing.title}</Text>
                        <Badge color="blue" variant="light">
                          ${listing.price}
                        </Badge>
                      </Group>

                      <Text size="sm" color="dimmed">
                        {listing.age} years old
                      </Text>

                      <Group position="apart" mt="md">
                        <Badge color="gray" variant="light">
                          {listing.type}
                        </Badge>
                        <Text size="sm" color="dimmed">
                          {listing.location}
                        </Text>
                      </Group>

                      <Group position="apart" mt="lg">
                        <Button
                          component="a"
                          href={`/listings/${listing._id}`}
                          variant="light"
                          color="blue"
                          fullWidth
                          style={{ marginBottom: "8px" }}
                        >
                          View Details
                        </Button>
                        <Button variant="subtle" color="pink" fullWidth>
                          Add to Favorites
                        </Button>
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}

            {totalPages > 1 && (
              <Group position="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                />
              </Group>
            )}
          </Box>
        </Flex>
      </Container>
      <FooterCentered />
    </>
  );
};

export default Listings;