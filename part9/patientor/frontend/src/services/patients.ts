import axios from "axios";
import { PatientType, PatientFormValues, NewEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<PatientType[]>(`${apiBaseUrl}/patients`);

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<PatientType>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<PatientType>(
    `${apiBaseUrl}/patients`,
    object,
  );

  return data;
};

const addEntry = async (id: string, object: NewEntry) => {
  const response = await axios.post<PatientType>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object,
  );

  return response.data;
};

export default {
  getAll,
  getOne,
  create,
  addEntry,
};
