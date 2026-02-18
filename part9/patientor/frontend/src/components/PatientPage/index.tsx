import { useParams } from "react-router-dom";
import { Gender, PatientType } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { Female, Male } from "@mui/icons-material";
import { EntryDetails } from "../EntryDetails";
import { AddEntryForm } from "./AddEntryForm";
import { Button } from "@mui/material";

export default function PatientPage() {
  const id = useParams().id;

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [showAdd, setShowAdd] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const getPatient = async () => {
      const patient = await patientService.getOne(id);

      setPatient(patient);
    };

    getPatient();
  }, [id]);

  if (!id || !patient) {
    return <p>Not found!</p>;
  }

  return (
    <div>
      <div>
        <h2>
          {patient.name}{" "}
          <span>{patient.gender === Gender.male ? <Male /> : <Female />}</span>
        </h2>
      </div>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      {showAdd ? (
        <AddEntryForm
          id={id}
          onCancel={() => setShowAdd(false)}
          onSuccess={setPatient}
        />
      ) : (
        <Button variant="contained" onClick={() => setShowAdd(true)}>
          ADD NEW ENTRY
        </Button>
      )}

      <div>
        <h2>entries</h2>
        {patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
