import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

const IncomeDialog = ({ open, onClose, income, onIncomeUpdated }) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [budgets, setBudgets] = useState([]);

  // Fetch available budgets when the dialog opens
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("/budgets");
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    if (open) {
      fetchBudgets();
    }
  }, [open]);

  // Populate form when an existing income is being edited
  useEffect(() => {
    if (income) {
      setAmount(income.amount);
      setSource(income.source);
      setDate(income.date.split("T")[0]);
      setDescription(income.description);
      setBudgetId(income.budgetId);
    } else {
      // Reset form for new income
      setAmount("");
      setSource("");
      setDate("");
      setDescription("");
      setBudgetId("");
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeData = {
      amount: parseFloat(amount),
      source,
      date,
      description,
      budgetId,
    };

    try {
      if (income) {
        await axios.put(`/incomes/${income.id}`, incomeData);
      } else {
        await axios.post("/incomes", incomeData);
      }
      onIncomeUpdated();
      onClose();
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{income ? "Update Income" : "Add Income"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Source"
          type="text"
          fullWidth
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense" required>
          {" "}
          <InputLabel>Budget</InputLabel>
          <Select
            value={budgetId}
            label="Budget"
            onChange={(e) => setBudgetId(e.target.value)}
          >
            {budgets.map((budget) => (
              <MenuItem key={budget.id} value={budget.id}>
                {budget.name} (${budget.totalAmount})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeDialog;
