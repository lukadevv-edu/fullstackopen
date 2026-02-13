import { Router } from "express";
import diagnoses from "../data/diagnoses";

const router = Router();

router.get("/", (_req, res) => {
  res.json(diagnoses);
});

export default router;
