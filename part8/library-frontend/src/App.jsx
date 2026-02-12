import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { useWSSubscribe } from "./hooks/useWSSubscribe";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(localStorage.getItem("token") ?? null);
  }, []);

  useWSSubscribe();

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
          </>
        )}
        {token ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
              setPage("books");
            }}
          >
            logout
          </button>
        ) : (
          <button
            onClick={() => {
              setPage("login");
            }}
          >
            login
          </button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      {!token && (
        <LoginForm
          show={page === "login"}
          setToken={setToken}
          onSuccess={() => setPage("books")}
        />
      )}
      <Recommend show={page === "recommend"} token={!!token} />
    </div>
  );
};

export default App;
