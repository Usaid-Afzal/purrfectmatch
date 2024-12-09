import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Card,
  Loader,
  Center,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconDownload, IconCurrency, IconUsers, IconReceipt } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const FinancialOversight = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageTransactionValue: 0,
    totalTransactions: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = () => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Get the current month's transactions
    const now = new Date();
    const monthlyTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === now.getMonth() && 
             tDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransactionValue = transactions.length > 0 
      ? totalRevenue / transactions.length 
      : 0;
  
    return {
      totalRevenue,
      monthlyRevenue,
      averageTransactionValue,
      totalTransactions: transactions.length
    };
  };
  
  const generateRevenueData = () => {
    const last30Days = [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 1000 + 500 // Random revenue between 500-1500
      };
    }).reverse();
    
    setRevenueData(last30Days);
  };

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/admin/financial-data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          startDate: dateRange[0]?.toISOString(),
          endDate: dateRange[1]?.toISOString()
        }
      });

      setStatistics(data.statistics);
      setTransactions(data.transactions);
      setRevenueData(data.revenueData);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch financial data',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  useEffect(() => {
    if (transactions.length) {
      const stats = calculateStats();
      setStatistics(stats);
      generateRevenueData();
    }
  }, [transactions]);

  const handleExport = () => {
    const headers = 'Date,Type,Amount,Status\n';
    const csv = headers + transactions.map(t => 
      `${new Date(t.date).toLocaleDateString()},${t.type},${t.amount.toFixed(2)},${t.status}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Paper p="md">
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={2}>Financial Overview</Title>
          <Group>
            <DatePickerInput
              type="range"
              label="Date Range"
              value={dateRange}
              onChange={setDateRange}
              clearable
            />
            <Button
              leftIcon={<IconDownload size={16} />}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed">Total Revenue</Text>
                  <Text size="lg" weight={500}>${statistics.totalRevenue.toFixed(2)}</Text>
                </div>
                <IconCurrency size={24} color="blue" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed">Monthly Revenue</Text>
                  <Text size="lg" weight={500}>${statistics.monthlyRevenue.toFixed(2)}</Text>
                </div>
                <IconReceipt size={24} color="green" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed">Avg Transaction</Text>
                  <Text size="lg" weight={500}>${statistics.averageTransactionValue.toFixed(2)}</Text>
                </div>
                <IconCurrency size={24} color="violet" />
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card withBorder p="md">
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed">Total Transactions</Text>
                  <Text size="lg" weight={500}>{statistics.totalTransactions}</Text>
                </div>
                <IconUsers size={24} color="orange" />
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Paper withBorder p="md">
          <Title order={3} mb="md">Revenue Trend</Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="revenue" stroke="#1c7ed6" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Stack>
          <Title order={3}>Recent Transactions</Title>
          <Table striped withBorder>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>
                    <Badge color={
                      transaction.type === 'sale' ? 'green' :
                      transaction.type === 'refund' ? 'red' : 'blue'
                    }>
                      {transaction.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>
                    <Badge 
                      color={
                        transaction.status === 'completed' ? 'green' :
                        transaction.status === 'pending' ? 'yellow' : 'red'
                      }
                    >
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FinancialOversight;