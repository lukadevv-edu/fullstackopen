import { Router } from "express";
import patients from "../data/patients";
import { PatientType } from "../types/main.types";
import { toNewPatientEntry } from "../utilities/patient.transform";
import { generateID } from "../utilities/id.util";

const router = Router();

router.get("/", (_req, res) => {
  const sanetizedPatients: Omit<PatientType, "ssn">[] = patients.map(
    ({ dateOfBirth, gender, id, name, occupation }) => ({
      dateOfBirth,
      gender,
      id,
      name,
      occupation,
    }),
  );

  res.json(sanetizedPatients);
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);

    patients.push({
      id: generateID(),
      ...newPatient
    } satisfies PatientType)
  } catch (e) {
    res
      .json({
        error: (e instanceof Error
          ? e
          : {
              message: "Please put valid information!",
            }
        ).message,
      })
      .status(400);
  }
});

export default router;
