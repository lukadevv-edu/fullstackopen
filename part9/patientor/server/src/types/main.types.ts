export enum Gender {
  male = "male",
  female = "female",
  other = "other"
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
};
