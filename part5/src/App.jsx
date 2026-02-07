import { useState, useCallback, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { AddForm } from "./components/AddForm";
import { Alert } from "./components/Alert";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  // local storage
  const [loading, setLoading] = useState(true);

  // Alert auto remove
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 5000);

      return () => clearTimeout(timeout);
    }
  }, [alert]);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");

    if (userStorage) {
      setUser(JSON.parse(userStorage));
    }

    setLoading(false);
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const user = await loginService.login(username, password);

        setUser(user);
        setUsername("");
        setPassword("");
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        setAlert({
          message: "wrong username of password",
          alertType: "error",
        });
      }
    },
    [password, username],
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    blogService.getAll(user).then((blogs) => setBlogs(blogs));
  }, [user]);

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Alert alert={alert} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    );
  }

  return (
    <main>
      <div>
        <h2>blogs</h2>
        <Alert alert={alert} />
        <div
          style={{
            display: "flex",
            gap: 5,
          }}
        >
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      </div>

      <div>
        <h2>create new</h2>
        <AddForm user={user} setAlert={setAlert} />
      </div>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </main>
  );
};

export default App;
