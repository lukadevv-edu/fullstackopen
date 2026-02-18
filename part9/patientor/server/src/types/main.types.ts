export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

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

export type DiagnosisType = {
  code: string;
  name: string;
  latin?: string;
};

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

type BaseEntry = {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnosisType["code"]>;
};

export type HospitalEntry = BaseEntry & {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
};

export type OccupationalHealthcareEntry = BaseEntry & {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
};

export type HealthCheckEntry = BaseEntry & {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
};

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

type UnionOmit<T, K extends keyof Entry> = T extends T ? Omit<T, K> : never;
export type NewEntry = UnionOmit<Entry, "id">;
