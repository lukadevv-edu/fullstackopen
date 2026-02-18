import { Router } from "express";
import patients from "../data/patients";
import { NonSensitivePatient, PatientType } from "../types/main.types";
import { toNewEntry, toNewPatient } from "../utilities/patient.transform";
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

  return res.json(found);
});

router.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;

    const patient = patients.find((each) => each.id === id);

    if (!patient) {
      res.status(404).send("Not found");
      return;
    }

    const newEntry = toNewEntry(req.body);

    patient.entries.push({
      id: generateID(),
      ...newEntry,
    });

    res.json(patient);
  } catch (error: unknown) {
    let errorMessage = "Error: ";
    if (error instanceof Error) errorMessage += error.message;
    res.status(400).send(errorMessage);
  }
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

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
