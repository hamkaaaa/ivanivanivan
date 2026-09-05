import express from "express";
import { TransactionController } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", TransactionController.create);
router.get("/", TransactionController.getAll);
router.get("/:id", TransactionController.getById);

export default router;
