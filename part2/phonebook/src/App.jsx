import { useMemo } from "react";
import { useState } from "react";
import { AddForm } from "./components/AddForm";
import { Search } from "./components/Search";
import { List } from "./components/List";
import { useEffect } from "react";
import backend from "./services/backend.service";
import { Alert } from "./components/Alert";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const list = useMemo(() => {
    return persons.filter((person) =>
      person.name.toLowerCase().startsWith(filterName.toLowerCase()),
    );
  }, [filterName, persons]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    backend.getAll().then((persons) => setPersons(persons));
  }, []);

  // Alert auto remove
  useEffect(() => {
    if (alert) {
      setTimeout(() => setAlert(null), 5000);
    }
  }, [alert]);

  return (
    <div>
      <h2>Phonebook</h2>
      <Alert alert={alert} />
      <Search setFilterName={setFilterName} />
      <AddForm
        newName={newName}
        newNumber={newNumber}
        persons={persons}
        setNewName={setNewName}
        setNumber={setNumber}
        setPersons={setPersons}
        setAlert={setAlert}
      />
      <List list={list} setPersons={setPersons} />
    </div>
  );
};

export default App;
