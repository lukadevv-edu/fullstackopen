import { useMemo } from "react";
import { useState } from "react";
import { AddForm } from "./components/AddForm";
import { Search } from "./components/Search";
import { List } from "./components/List";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const list = useMemo(() => {
    return persons.filter((person) =>
      person.name.toLowerCase().startsWith(filterName.toLowerCase()),
    );
  }, [filterName, persons]);

  return (
    <div>
      <h2>Phonebook</h2>
      <Search setFilterName={setFilterName} />
      <AddForm
        newName={newName}
        newNumber={newNumber}
        persons={persons}
        setNewName={setNewName}
        setNumber={setNumber}
        setPersons={setPersons}
      />
      <List list={list} />
    </div>
  );
};

export default App;
