import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

const baseUrl = import.meta.env.VITE_API_URL;

async function getAll() {
  return (await axios.get<DiaryEntry[]>(`${baseUrl}/api/diaries`)).data;
}

async function add(newEntry: NewDiaryEntry) {
  return await axios.post<DiaryEntry>(`${baseUrl}/api/diaries`, newEntry);
}

export default {
  getAll,
  add,
};
