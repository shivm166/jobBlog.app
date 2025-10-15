import express from "express";
import { login, signup } from "../controllers/userController.js";
import { loginSchema, signupSchema } from "../middelware/userValidation.js";

const route = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

route.post("/signup", validate(signupSchema), signup);
route.post("/login", validate(loginSchema), login);
export default route;
