import axios from "axios";
import { apiBaseUrl } from "../constants";
import { DiagnoseType } from "../types";

const getAll = async () => {
  const { data } = await axios.get<DiagnoseType[]>(`${apiBaseUrl}/diagnoses`);

  return data;
};

export default {
  getAll,
};
