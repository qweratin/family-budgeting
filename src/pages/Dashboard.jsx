import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import {
  AccountBalance as BudgetIcon,
  MoneyOff as ExpenseIcon,
  AttachMoney as IncomeIcon,
} from "@mui/icons-material";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBudget: 0,
    totalExpenses: 0,
    totalIncomes: 0,
    expenseCategories: [],
    monthlyTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard data from multiple endpoints
        const [budgetsResponse, expensesResponse, incomesResponse] =
          await Promise.all([
            axios.get("/budgets"),
            axios.get("/expenses"),
            axios.get("/incomes"),
          ]);

        setDashboardData({
          totalBudget: budgetsResponse.data.reduce(
            (sum, budget) => sum + budget.totalAmount,
            0
          ),
          totalExpenses: expensesResponse.data.reduce(
            (sum, expense) => sum + expense.amount,
            0
          ),
          totalIncomes: incomesResponse.data.reduce(
            (sum, income) => sum + income.amount,
            0
          ),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const FinancialSummaryCard = ({ icon, title, value, color }) => (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            backgroundColor: color,
            color: "white",
            p: 1,
            borderRadius: 2,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="h6">${value.toFixed(2)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Financial Summary Cards */}
        <Grid item xs={12} md={4}>
          <FinancialSummaryCard
            icon={<BudgetIcon />}
            title="Total Budget"
            value={dashboardData.totalBudget}
            color="#0088FE"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FinancialSummaryCard
            icon={<ExpenseIcon />}
            title="Total Expenses"
            value={dashboardData.totalExpenses}
            color="#FFBB28"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FinancialSummaryCard
            icon={<IncomeIcon />}
            title="Total Incomes"
            value={dashboardData.totalIncomes}
            color="#00C49F"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
