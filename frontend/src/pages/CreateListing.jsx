// src/pages/CreateListing.jsx
import { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  FileInput,
  Button,
  Group,
  Stack,
  Image,
  SimpleGrid,
  Paper,
  ActionIcon
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconCurrentLocation,
} from "@tabler/icons-react";
import { FooterSocial } from "../components/FooterSocial";
import { HeaderMegaMenu } from "../components/HeaderMegaMenu";
import { FooterCentered } from "../components/FooterCentered";


const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

const CreateListing = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [locationLoading, setLocationLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      type: "",
      breed: "",
      age: "",
      gender: "",
      price: "",
      location: "",
      vaccinated: "false",
      neutered: "false",
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      type: (value) => (!value ? "Pet type is required" : null),
      price: (value) => {
        if (!value) return "Price is required";
        if (isNaN(value) || value < 0) return "Price must be a positive number";
        return null;
      },
      location: (value) => (!value ? "Location is required" : null),
      gender: (value) => (!value ? "Gender is required" : null),
    },
  });

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      notifications.show({
        title: "Error",
        message: "Geolocation is not supported by your browser",
        color: "red",
      });
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.results.length > 0) {
            const city = data.results[0].components.city;
            form.setFieldValue("location", city);
          }
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Failed to fetch location",
            color: "red",
          });
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
        setLocationLoading(false);
      }
    );
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Update handleSubmit in CreateListing.jsx
  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();

    // Append form values
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Append images
    images.forEach((image) => {
      formData.append("images", image.file);
    });

    try {
      const response = await fetch("https://purrfectmatch-backend.onrender.com/api/listings", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create listing");
      }

      const data = await response.json();

      notifications.show({
        title: "Success",
        message: "Listing created successfully",
        color: "green",
      });

      // Navigate to the newly created listing
      navigate(`/listings/${data.listing._id}`);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <Container size="md" py="xl">
        <Paper shadow="sm" radius="md" p="xl">
          <Title order={2} mb="xl">
            Create New Listing
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput
                required
                label="Title"
                placeholder="Enter listing title"
                {...form.getInputProps("title")}
              />

              <Textarea
                required
                label="Description"
                placeholder="Describe your pet"
                minRows={4}
                {...form.getInputProps("description")}
              />

              <Select
                required
                label="Pet Type"
                placeholder="Select pet type"
                data={[
                  { value: "dog", label: "Dog" },
                  { value: "cat", label: "Cat" },
                  { value: "bird", label: "Bird" },
                  { value: "other", label: "Other" },
                ]}
                {...form.getInputProps("type")}
              />

              <Group grow>
                <TextInput
                  label="Breed"
                  placeholder="Pet breed"
                  {...form.getInputProps("breed")}
                />

                <NumberInput
                  label="Age"
                  placeholder="Pet age"
                  min={0}
                  precision={0}
                  {...form.getInputProps("age")}
                />
              </Group>

              <Group grow>
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  data={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  {...form.getInputProps("gender")}
                />

                <NumberInput
                  required
                  label="Price"
                  placeholder="Enter price"
                  min={0}
                  precision={2}
                  {...form.getInputProps("price")}
                />
              </Group>

              <TextInput
                required
                label="Location"
                placeholder="Enter location"
                {...form.getInputProps("location")}
                rightSection={
                  <ActionIcon
                    loading={locationLoading}
                    onClick={getCurrentLocation}
                    variant="subtle"
                  >
                    <IconCurrentLocation size={16} />
                  </ActionIcon>
                }
              />

              <Group grow>
                <Select
                  label="Vaccinated"
                  placeholder="Vaccination status"
                  data={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  {...form.getInputProps("vaccinated")}
                />

                <Select
                  label="Neutered"
                  placeholder="Neutered status"
                  data={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                  {...form.getInputProps("neutered")}
                />
              </Group>

              <FileInput
                label="Upload Images"
                placeholder="Upload pet images"
                accept="image/*"
                multiple
                icon={<IconUpload size={14} />}
                onChange={handleImageUpload}
              />

              {images.length > 0 && (
                <SimpleGrid cols={4} spacing="xs">
                  {images.map((image, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <Image
                        src={image.preview}
                        alt={`Preview ${index}`}
                        radius="md"
                      />
                      <Button
                        size="xs"
                        color="red"
                        variant="filled"
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <IconX size={14} />
                      </Button>
                    </div>
                  ))}
                </SimpleGrid>
              )}

              <Button type="submit" size="lg" loading={loading} mt="xl">
                Create Listing
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
      <FooterCentered />
    </>
  );
};

export default CreateListing;
