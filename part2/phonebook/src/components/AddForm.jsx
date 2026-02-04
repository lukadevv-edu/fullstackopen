export function AddForm({
  persons,
  newName,
  setPersons,
  newNumber,
  setNumber,
  setNewName,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (persons.some((each) => each.name === newName)) {
          // Already exists
          alert(`"${newName}" is already added to phonebook`);
        } else {
          setPersons((old) =>
            old.concat([
              {
                name: newName,
                phonenumber: newNumber,
              },
            ]),
          );
        }
      }}
    >
      <div>
        name: <input onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input onChange={(e) => setNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
