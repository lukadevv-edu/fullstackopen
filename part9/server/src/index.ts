import express from "express";
import { getBMIResult } from "./utills/bmiCalculator";
import { calculateExercises } from "./utills/exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = req.query["height"];
  const weight = req.query["weight"];

  if (!height || !weight) {
    return res
      .json({
        error: "malformatted parameters",
      })
      .status(400);
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    return res
      .json({
        error: "malformatted parameters",
      })
      .status(400);
  }

  return res.send(getBMIResult(Number(height), Number(weight)));
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = (req.body ?? {}) as {
    daily_exercises: unknown;
    target: unknown;
  };

  if (!daily_exercises || !target) {
    return res
      .json({
        error: "parameters missing",
      })
      .status(400);
  }

  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((hours) => isNaN(Number(hours)))
  ) {
    return res.json({
      error: "malformatted parameters",
    });
  }

  return res.send(
    calculateExercises(daily_exercises as number[], target as number),
  );
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
