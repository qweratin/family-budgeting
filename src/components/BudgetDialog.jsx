import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const BudgetDialog = ({ open, onClose, budget, onBudgetUpdated }) => {
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setTotalAmount(budget.totalAmount);
      setStartDate(budget.startDate.split("T")[0]);
      setEndDate(budget.endDate.split("T")[0]);
    } else {
      setName("");
      setTotalAmount("");
      setStartDate("");
      setEndDate("");
    }
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const budgetData = {
      name,
      totalAmount: parseFloat(totalAmount),
      startDate,
      endDate,
    };

    try {
      if (budget) {
        await axios.put(`/budgets/${budget.id}`, budgetData);
      } else {
        await axios.post("/budgets", budgetData);
      }
      onBudgetUpdated();
      onClose();
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{budget ? "Update Budget" : "Create Budget"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Budget Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Total Amount"
          type="number"
          fullWidth
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Start Date"
          type="date"
          fullWidth
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
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

export default BudgetDialog;
