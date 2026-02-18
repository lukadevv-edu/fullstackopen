import {
  DiagnosisType,
  Gender,
  HealthCheckRating,
  NewEntry,
  PatientType,
} from "../types/main.types";

type NewPatient = Omit<PatientType, "id">;

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: unknown): param is HealthCheckRating => {
  return (
    typeof param === "number" &&
    Object.values(HealthCheckRating).includes(param)
  );
};

function parseDiagnosisCodes(object: unknown): Array<DiagnosisType["code"]> {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisType["code"]>;
  }

  return object.diagnosisCodes as Array<DiagnosisType["code"]>;
}

export function toNewPatient(object: unknown): NewPatient {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  // Use a type-safe record to access properties for validation
  const entry = object as Record<string, unknown>;

  if (
    "name" in entry &&
    isString(entry.name) &&
    "dateOfBirth" in entry &&
    isString(entry.dateOfBirth) &&
    isDate(entry.dateOfBirth) &&
    "ssn" in entry &&
    isString(entry.ssn) &&
    "gender" in entry &&
    isString(entry.gender) &&
    isGender(entry.gender) &&
    "occupation" in entry &&
    isString(entry.occupation)
  ) {
    const newEntry: NewPatient = {
      name: entry.name,
      dateOfBirth: entry.dateOfBirth,
      ssn: entry.ssn,
      gender: entry.gender,
      occupation: entry.occupation,
      entries: [],
    };

    return newEntry;
  }

  throw new Error(
    "Some fields are missing or invalid to create a 'NewPatientEntry'",
  );
}

export function toNewEntry(object: unknown): NewEntry {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("description" in object) || !isString(object.description))
    throw new Error("Invalid description");
  if (!("date" in object) || !isString(object.date) || !isDate(object.date))
    throw new Error("Invalid date");
  if (!("specialist" in object) || !isString(object.specialist))
    throw new Error("Invalid specialist");
  if (!("type" in object)) throw new Error("Missing type");

  const common = {
    description: object.description,
    date: object.date,
    specialist: object.specialist,
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case "HealthCheck":
      if (
        !("healthCheckRating" in object) ||
        !isHealthCheckRating(object.healthCheckRating)
      ) {
        throw new Error("Invalid health check rating");
      }
      return {
        ...common,
        type: "HealthCheck",
        healthCheckRating: object.healthCheckRating,
      };

    case "Hospital":
      if (
        !("discharge" in object) ||
        typeof object.discharge !== "object" ||
        !object.discharge
      )
        throw new Error("Invalid discharge");

      const d = object.discharge as Record<string, unknown>;
      if (!isString(d.date) || !isDate(d.date) || !isString(d.criteria))
        throw new Error("Invalid discharge fields");
      return {
        ...common,
        type: "Hospital",
        discharge: { date: d.date, criteria: d.criteria },
      };

    case "OccupationalHealthcare":
      if (!("employerName" in object) || !isString(object.employerName))
        throw new Error("Invalid employer name");

      const newOccupationalEntry: NewEntry = {
        ...common,
        type: "OccupationalHealthcare",
        employerName: object.employerName,
      };

      if (
        "sickLeave" in object &&
        typeof object.sickLeave === "object" &&
        object.sickLeave
      ) {
        const s = object.sickLeave as Record<string, unknown>;
        if (
          isString(s.startDate) &&
          isDate(s.startDate) &&
          isString(s.endDate) &&
          isDate(s.endDate)
        ) {
          newOccupationalEntry.sickLeave = {
            startDate: s.startDate,
            endDate: s.endDate,
          };
        }
      }
      return newOccupationalEntry;

    default:
      throw new Error("Invalid entry type");
  }
}
