import { useEffect } from "react";
import { useState } from "react";

import backend from "./services/backend.service";
import { useMemo } from "react";
import { Country } from "./components/Country";

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [allCountries, setAllCountries] = useState(null);

  useEffect(() => {
    backend.getAll().then((r) => setAllCountries(r));
  }, []);

  // useEffect(() => {
  //   if (search) {
  //     backend.findOne(search).then((response) => setResult(response));
  //   }
  // }, [search]);

  const filtered = useMemo(
    () =>
      search &&
      allCountries?.filter((each) =>
        each.name.common.toLowerCase().includes(search.toLowerCase()),
      ),
    [allCountries, search],
  );

  useEffect(() => {
    if (filtered.length === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(filtered[0]);
    } else {
      setResult(null);
    }
  }, [filtered]);

  return (
    <main>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <p>Find countries</p>
          <input onChange={(e) => allCountries && setSearch(e.target.value)} />
        </div>
        {result ? (
          <Country {...filtered[0]} />
        ) : filtered ? (
          filtered.length <= 10 ? (
            <ul>
              {filtered.map((each) => (
                <li key={each.id + each.name.common}>
                  {each.name.common}{" "}
                  <button onClick={() => setResult(each)}>show</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Too many matches, specify another filter</p>
          )
        ) : (
          <></>
        )}
      </form>
    </main>
  );
}

export default App;
