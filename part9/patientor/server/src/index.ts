import express from "express";
import cors from "cors";
import route_diagnose from "./routes/diagnose.route";
import route_patients from "./routes/patient.route";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

// Routes
{
  app.use("/api/diagnoses", route_diagnose);
  app.use("/api/patients", route_patients);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
