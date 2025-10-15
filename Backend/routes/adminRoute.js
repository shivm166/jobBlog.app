import express from "express";
import { getAllUser } from "../controllers/userController.js";
import isAdmin from "../middelware/isAdmin.js";
const adminRoute = express.Router();

adminRoute.get("/getAllUser", isAdmin, getAllUser);

export default adminRoute;
