import { Gender, PatientType } from "../types/main.types";

type NewPatientEntry = Omit<PatientType, "id">;

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

export function toNewPatientEntry(object: unknown): NewPatientEntry {
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
    const newEntry: NewPatientEntry = {
      name: entry.name,
      dateOfBirth: entry.dateOfBirth,
      ssn: entry.ssn,
      gender: entry.gender,
      occupation: entry.occupation,
    };

    return newEntry;
  }

  throw new Error("Some fields are missing or invalid to create a 'NewPatientEntry'");
}
