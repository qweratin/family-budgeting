import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import ExpenseDialog from "../components/ExpenseDialog";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleDialogOpen = (expense = null) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleExpenseUpdated = () => {
    fetchExpenses();
    handleDialogClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Expenses
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Add Expense
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} key={expense.id}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">{expense.category}</Typography>
                <Typography>Amount: ${expense.amount}</Typography>
                <Typography>
                  Date: {new Date(expense.date).toLocaleDateString()}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDialogOpen(expense)}
                >
                  Edit
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <ExpenseDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        expense={selectedExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />
    </Container>
  );
};

export default Expenses;
