import { useEffect, useState } from "react";
import diaresService from "./services/diares.service";
import type { DiaryEntry } from "./types";
import { Entry } from "./components/Entry";
import { AddNew } from "./components/AddNew";

function App() {
  const [diares, setDiares] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaresService.getAll().then(setDiares);
  }, []);

  return (
    <main>
      <div>
        <h2>Add new entry</h2>
        <AddNew
          addToLocal={(newData) => setDiares((old) => [...old, newData])}
        />
      </div>
      <div>
        <h2>Diary Entries</h2>
        <div>
          {diares.map((diare) => (
            <Entry key={diare.id} diare={diare} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
