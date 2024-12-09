import { useState, useEffect } from "react";
import {
  Container,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Paper,
  Grid,
  Title,
  Stack,
  Loader,
  Avatar,
  Divider,
  Center,
} from "@mantine/core";
import { IconArrowLeft, IconHeart, IconMessage, IconStar } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { HeaderMegaMenu } from "../components/HeaderMegaMenu";
import { FooterSocial } from "../components/FooterSocial";
import { FooterCentered } from "../components/FooterCentered";

const ListingDetails = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(
          `https://purrfectmatch-backend.onrender.com/api/listings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListing(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message:
            error.response?.data?.message || "Failed to fetch listing details",
          color: "red",
        });
        navigate("/listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const handleStartChat = async () => {
    try {
      const { data } = await axios.post(
        "https://purrfectmatch-backend.onrender.com/api/chats",
        {
          sellerId: listing.owner._id,
          listingId: listing._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate(`/chat/${data.chatId}`);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to start chat",
        color: "red",
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

  if (!listing) {
    return null;
  }

  return (
    <>
      <HeaderMegaMenu />
      <Container size="xl" py="xl">
        <Button
          leftIcon={<IconArrowLeft size={16} />}
          variant="subtle"
          onClick={() => navigate(-1)}
          mb="lg"
        >
          Back to Listings
        </Button>

        <Grid>
          <Grid.Col span={8}>
            <Paper shadow="sm" radius="md" p="xl" withBorder>
              <Image
                src={listing.images[0]}
                height={400}
                fit="cover"
                radius="md"
              />

              <Group position="apart" mt="xl">
                <Title order={2}>{listing.title}</Title>
                <Badge size="xl" color="blue" variant="light">
                  ${listing.price}
                </Badge>
              </Group>

              <Group spacing="xs" mt="md">
                <Badge color="gray">{listing.type}</Badge>
                <Badge color="gray">{listing.breed}</Badge>
                <Badge color="gray">{listing.age} years</Badge>
                <Badge color="gray">{listing.gender}</Badge>
              </Group>

              <Text mt="xl" size="lg">
                {listing.description}
              </Text>

              <Stack spacing="md" mt="xl">
                <Title order={4}>Details</Title>
                <Grid>
                  <Grid.Col span={6}>
                    <Text>
                      <b>Location:</b> {listing.location}
                    </Text>
                    <Text>
                      <b>Vaccinated:</b> {listing.vaccinated ? "Yes" : "No"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text>
                      <b>Neutered:</b> {listing.neutered ? "Yes" : "No"}
                    </Text>
                    <Text>
                      <b>Gender:</b> {listing.gender}
                    </Text>
                  </Grid.Col>
                </Grid>
              </Stack>

              {listing.images.length > 1 && (
                <Stack spacing="md" mt="xl">
                  <Title order={4}>Additional Photos</Title>
                  <Grid>
                    {listing.images.slice(1).map((img, index) => (
                      <Grid.Col key={index} span={4}>
                        <Image src={img} height={120} radius="md" fit="cover" />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              )}
            </Paper>
          </Grid.Col>

          <Grid.Col span={4}>
            <Stack spacing="md">
              {/* Seller Info Card */}
              <Paper shadow="sm" radius="md" p="xl" withBorder>
                <Title order={4} mb="md">Seller Information</Title>
                <Group mb="md">
                  <Avatar 
                    src={listing.owner?.avatar} 
                    size="lg" 
                    radius="xl"
                  />
                  <div>
                    <Text size="lg" weight={500}>
                      {listing.owner?.username || 'Unknown Seller'}
                    </Text>
                    <Text size="sm" color="dimmed">
                      Member since {listing.owner?.createdAt ? 
                        new Date(listing.owner.createdAt).toLocaleDateString() : 
                        'N/A'
                      }
                    </Text>
                  </div>
                </Group>

                <Button
                  fullWidth
                  size="lg"
                  color="blue"
                  leftIcon={<IconMessage size={20} />}
                  onClick={handleStartChat}
                >
                  Contact Seller
                </Button>
              </Paper>

              {/* Pet Details Card */}
              <Paper shadow="sm" radius="md" p="xl" withBorder>
                <Title order={4} mb="md">
                  Pet Details
                </Title>
                <Stack spacing="xs">
                  <Group position="apart">
                    <Text color="dimmed">Type:</Text>
                    <Text weight={500}>{listing.type}</Text>
                  </Group>
                  <Group position="apart">
                    <Text color="dimmed">Breed:</Text>
                    <Text weight={500}>{listing.breed}</Text>
                  </Group>
                  <Group position="apart">
                    <Text color="dimmed">Age:</Text>
                    <Text weight={500}>{listing.age} years</Text>
                  </Group>
                  <Group position="apart">
                    <Text color="dimmed">Gender:</Text>
                    <Text weight={500}>{listing.gender?.charAt(0).toUpperCase() + listing.gender?.slice(1) || 'Not specified'}</Text>
                  </Group>
                  <Divider my="sm" />
                  <Group position="apart">
                    <Text color="dimmed">Vaccinated:</Text>
                    <Badge color={listing.vaccinated ? "green" : "red"}>
                      {listing.vaccinated ? "Yes" : "No"}
                    </Badge>
                  </Group>
                  <Group position="apart">
                    <Text color="dimmed">Neutered:</Text>
                    <Badge color={listing.neutered ? "green" : "red"}>
                      {listing.neutered ? "Yes" : "No"}
                    </Badge>
                  </Group>
                  <Divider my="sm" />
                  <Group position="apart">
                    <Text color="dimmed">Location:</Text>
                    <Text weight={500}>{listing.location}</Text>
                  </Group>
                  <Group position="apart">
                    <Text color="dimmed">Listed:</Text>
                    <Text weight={500}>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </Text>
                  </Group>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <FooterCentered />
    </>
  );
};

export default ListingDetails;
