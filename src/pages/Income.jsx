import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import IncomeDialog from "../components/IncomeDialog";

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get("/incomes");
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/incomes/${id}`);
      fetchIncomes(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const handleDialogOpen = (income = null) => {
    setSelectedIncome(income);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedIncome(null);
  };

  const handleIncomeUpdated = () => {
    fetchIncomes();
    handleDialogClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Incomes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Add Income
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {incomes.map((income) => (
            <Grid item xs={12} sm={6} md={4} key={income.id}>
              <Paper elevation={2} sx={{ padding: 2 }}>
                <Typography variant="h6">{income.source}</Typography>
                <Typography>Amount: ${income.amount}</Typography>
                <Typography>
                  Date: {new Date(income.date).toLocaleDateString()}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(income.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleDialogOpen(income)}
                >
                  Edit
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      <IncomeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        income={selectedIncome}
        onIncomeUpdated={handleIncomeUpdated}
      />
    </Container>
  );
};

export default Incomes;
