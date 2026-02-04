import backend from "../services/backend.service";

export function AddForm({
  persons,
  newName,
  setPersons,
  newNumber,
  setNumber,
  setNewName,
  setAlert,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const matchValue = persons.find((each) => each.name === newName);

        if (matchValue) {
          // Already exists
          if (
            window.confirm(
              `${newName} is already added to phonebook, replace the old number with a new one?`,
            )
          ) {
            backend
              .update(matchValue.id, {
                ...matchValue,
                number: newNumber,
              })
              .then((data) => {
                setPersons((old) =>
                  old.map((each) => {
                    if (each.id === matchValue.id) {
                      return {
                        ...each,
                        ...data,
                      };
                    } else {
                      return each;
                    }
                  }),
                );

                setAlert({
                  message: `Updated ${newName}`,
                });
              })
              .catch(() => {
                setAlert({
                  message: `Information of ${newName} has already been removbed from server`,
                  alertType: "error",
                });
              });
          }
        } else {
          backend
            .create({
              name: newName,
              number: newNumber,
            })
            .then((data) => {
              setPersons((old) => old.concat(data));

              setAlert({
                message: `Added ${newName}`,
              });
            })
            .catch(() => {
              setAlert({
                message: `Information of ${newName} has already been removbed from server`,
                alertType: "error",
              });
            });
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
