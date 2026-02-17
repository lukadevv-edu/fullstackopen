export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export type Entry = {};

export type DiagnoseType = {
  code: string;
  name: string;
  latin?: string;
};

export type PatientType = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

export type NonSensitivePatient = Omit<PatientType, "ssn" | "entries">;

// Don't exclude "ssn" to be it easier for patient page (individual)
// export type NonSensitivePatientWithEntries = Omit<PatientType, "ssn">;
export type NonSensitivePatientWithEntries = PatientType;
