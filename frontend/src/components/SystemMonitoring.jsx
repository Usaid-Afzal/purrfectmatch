import { useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  Table,
  Badge,
  Select,
  TextInput,
  Pagination,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { notifications } from "@mantine/notifications";

const SystemMonitoring = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://purrfectmatch-backend.onrender.com/api/admin/activities",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setActivities(data);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to fetch activities",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityColor = (type) => {
    const colors = {
      listing_approved: "green",
      listing_rejected: "red",
      listing_created: "blue",
      user_registered: "teal",
      user_deleted: "orange",
      payment_received: "violet",
    };
    return colors[type] || "gray";
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesType =
      activityType === "all" || activity.type === activityType;
    const matchesDate =
      !dateRange[0] ||
      !dateRange[1] ||
      (new Date(activity.timestamp) >= dateRange[0] &&
        new Date(activity.timestamp) <= dateRange[1]);
    return matchesType && matchesDate;
  });

  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Paper p="md">
      <Stack spacing="md">
        <Title order={2}>System Activity Log</Title>

        <Group>
          <Select
            style={{ width: 200 }}
            label="Activity Type"
            placeholder="Filter by type"
            value={activityType}
            onChange={setActivityType}
            data={[
              { value: "all", label: "All Activities" },
              { value: "listing_approved", label: "Listing Approved" },
              { value: "listing_rejected", label: "Listing Rejected" },
              { value: "listing_created", label: "Listing Created" },
              { value: "user_registered", label: "User Registered" },
              { value: "user_deleted", label: "User Deleted" },
              { value: "payment_received", label: "Payment Received" },
            ]}
          />
          <DatePickerInput
            type="range"
            label="Date Range"
            placeholder="Filter by date"
            value={dateRange}
            onChange={setDateRange}
            clearable
            style={{ width: 300 }}
          />
        </Group>

        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Activity Type</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity) => (
              <tr key={activity._id}>
                <td>
                  <Text size="sm">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Text>
                </td>
                <td>
                  <Badge color={getActivityColor(activity.type)}>
                    {activity.type.replace("_", " ").toUpperCase()}
                  </Badge>
                </td>
                <td>{activity.details}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {filteredActivities.length > itemsPerPage && (
          <Group position="center">
            <Pagination
              total={Math.ceil(filteredActivities.length / itemsPerPage)}
              value={page}
              onChange={setPage}
            />
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

export default SystemMonitoring;
