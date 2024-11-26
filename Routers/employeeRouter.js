import express from "express";
import {
  getEmployee,
  loginEmployee,
  registerEmployee,
} from "../Controllers/employeeController.js";
import authMiddleware from "../Middleware/employeeMiddleware.js";

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/getemployee", authMiddleware, getEmployee);
export default router;
