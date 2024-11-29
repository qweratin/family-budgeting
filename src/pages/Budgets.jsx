import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import BudgetDialog from "../components/BudgetDialog";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/budgets");
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      fetchBudgets(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleDialogOpen = (budget = null) => {
    setSelectedBudget(budget);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBudget(null);
  };

  const handleBudgetUpdated = () => {
    fetchBudgets();
    handleDialogClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Budgets
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Create Budget
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {budgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">{budget.name}</Typography>
                <Typography>Total Amount: ${budget.totalAmount}</Typography>
                <Typography>
                  Duration: {new Date(budget.startDate).toLocaleDateString()} -{" "}
                  {new Date(budget.endDate).toLocaleDateString()}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(budget.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDialogOpen(budget)}
                >
                  Edit
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <BudgetDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        budget={selectedBudget}
        onBudgetUpdated={handleBudgetUpdated}
      />
    </Container>
  );
};

export default Budgets;
