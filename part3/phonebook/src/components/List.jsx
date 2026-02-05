import backend from "../services/backend.service";

export function List({ list, setPersons, setAlert }) {
  return (
    <div>
      <h2>Numbers</h2>
      {list.map((each) => (
        <p key={each.name}>
          {each.name} {each.number}
          <button
            onClick={() => {
              if (window.confirm(`Delete "${each.name}"?`)) {
                backend
                  .deleteOne(each.id)
                  .then((response) =>
                    setPersons((old) =>
                      old.filter((person) => person.id !== response.id),
                    ),
                  )
                  .catch(() => {
                    setAlert({
                      message: `Information of ${each.name} has already been removbed from server`,
                      alertType: "error",
                    });
                  });
              }
            }}
          >
            delete
          </button>
        </p>
      ))}
    </div>
  );
}
