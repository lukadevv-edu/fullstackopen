import { Router } from "express";
import patients from "../data/patients";
import {
  NonSensitivePatient,
  NonSensitivePatientWithEntries,
  PatientType,
} from "../types/main.types";
import { toNewPatientEntry } from "../utilities/patient.transform";
import { generateID } from "../utilities/id.util";

const router = Router();

router.get("/", (_req, res) => {
  const sanetizedPatients: NonSensitivePatient[] = patients.map(
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

router.get("/:id", (req, res) => {
  const found = patients.find((each) => each.id === req.params.id);

  if (!found) {
    return res.status(404).end();
  }

  return res.json({
    dateOfBirth: found.dateOfBirth,
    entries: found.entries,
    gender: found.gender,
    id: found.id,
    name: found.name,
    occupation: found.occupation,
    ssn: found.ssn,
  } satisfies NonSensitivePatientWithEntries);
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);

    patients.push({
      id: generateID(),
      ...newPatient,
    } satisfies PatientType);
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
