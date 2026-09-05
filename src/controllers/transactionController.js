import { TransactionModel } from "../models/transactionModel.js";

export const TransactionController = {
  async create(req, res) {
    try {
      const transaction = await TransactionModel.create(req.body);
      res.status(201).json(transaction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const transactions = await TransactionModel.getAll();
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const transaction = await TransactionModel.getById(req.params.id);
      res.json(transaction);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};
