import { useParams } from "react-router-dom";
import { Gender, Patient } from "../../types";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { Female, Male } from "@mui/icons-material";

export default function PatientPage() {
  const id = useParams().id;

  const [patient, setPatient] = useState<Patient | null>(null);

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

  if (!patient) {
    return <p>Not found!</p>;
  }

  return (
    <div>
      <div>
        <h2>
          {patient.name}{" "}
          <span>{patient.gender === Gender.Male ? <Male /> : <Female />}</span>
        </h2>
      </div>
      <p>ssh: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
    </div>
  );
}
