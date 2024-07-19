import { Router } from "express";
import { getUsers, createUser } from "../controllers/user";

const router = Router();

router.get("/", getUsers);
router.post("/create-user", createUser);

export default router;
