// src/pages/admin/components/UserManagement.jsx
import { useState, useEffect } from "react";
import {
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  TextInput,
  Modal,
  Button,
  Stack,
  Select,
  Paper,
  Title,
  MantineProvider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash, IconSearch } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://purrfectmatch-backend.onrender.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
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

  // Update handleEditUser function
  const handleEditUser = async (values) => {
    try {
      const response = await fetch(
        `https://purrfectmatch-backend.onrender.com/api/admin/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: editingUser.username,
            email: editingUser.email,
            role: editingUser.role,
            isActive: editingUser.isActive,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      notifications.show({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });

      fetchUsers();
      setEditModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    }
  };

  // Update handleDeleteUser function
  const handleDeleteUser = (user) => {
    modals.openConfirmModal({
      title: "Delete User",
      children: (
        <Text size="sm">
          Are you sure you want to delete {user.username}? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await axios.delete(
            `https://purrfectmatch-backend.onrender.com/api/admin/users/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          notifications.show({
            title: "Success",
            message: "User deleted successfully",
            color: "green",
          });
          fetchUsers();
        } catch (error) {
          notifications.show({
            title: "Error",
            message: error.response?.data?.message || "Failed to delete user",
            color: "red",
          });
        }
      },
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <Paper p="md">
      <Stack spacing="md">
        <Group position="apart">
          <Title order={2}>User Management</Title>
          <TextInput
            placeholder="Search by username or email..."
            icon={<IconSearch size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </Group>

        <Table striped withBorder>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registration Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <Badge color={user.role === "admin" ? "red" : "blue"}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge color={user.isActive ? "green" : "gray"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <Badge color="cyan">{user.registrationType}</Badge>
                </td>
                <td>
                  <Group spacing={0} position="left">
                    <ActionIcon
                      onClick={() => {
                        setEditingUser({
                          ...user,
                          name: user.username,
                          active: user.isActive,
                        });
                        setEditModalOpen(true);
                      }}
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          opened={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingUser(null);
          }}
          title="Edit User"
        >
          {editingUser && (
            <Stack>
              <TextInput
                label="Username"
                defaultValue={editingUser.username}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    username: e.target.value,
                  })
                }
              />
              <TextInput
                label="Email"
                defaultValue={editingUser.email}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    email: e.target.value,
                  })
                }
              />
              <Select
                label="Role"
                defaultValue={editingUser.role}
                data={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                onChange={(value) =>
                  setEditingUser({
                    ...editingUser,
                    role: value,
                  })
                }
              />
              <Select
                label="Status"
                defaultValue={editingUser.isActive ? "active" : "inactive"}
                data={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                onChange={(value) =>
                  setEditingUser({
                    ...editingUser,
                    isActive: value === "active",
                  })
                }
              />
              <Button onClick={() => handleEditUser(editingUser)}>
                Save Changes
              </Button>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Paper>
  );
};

export default UserManagement;
