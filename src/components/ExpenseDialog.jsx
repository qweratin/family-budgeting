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

const ExpenseDialog = ({ open, onClose, expense, onExpenseUpdated }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
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

  // Populate form when an existing expense is being edited
  useEffect(() => {
    if (expense) {
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(expense.date.split("T")[0]);
      setDescription(expense.description);
      setBudgetId(expense.budgetId);
    } else {
      // Reset form for new expense
      setAmount("");
      setCategory("");
      setDate("");
      setDescription("");
      setBudgetId("");
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      amount: parseFloat(amount),
      category,
      date,
      description,
      budgetId,
    };

    try {
      if (expense) {
        await axios.put(`/expenses/${expense.id}`, expenseData);
      } else {
        await axios.post("/expenses", expenseData);
      }
      onExpenseUpdated();
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{expense ? "Update Expense" : "Add Expense"}</DialogTitle>
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
          label="Category"
          type="text"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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

export default ExpenseDialog;
