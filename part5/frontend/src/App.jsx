import { useState, useCallback, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { AddForm } from "./components/AddForm";
import { Alert } from "./components/Alert";

const App = () => {
  const [blogs, setRawBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const setBlogs = useCallback(
    (blogsFC) => {
      setRawBlogs([...blogsFC(blogs)].sort((a, b) => b.likes - a.likes));
    },
    [blogs],
  );

  const onLike = useCallback(
    (blog) => {
      blogService.addLike(user, blog).then((r) => {
        setBlogs((old) =>
          old.map((each) => {
            if (each.id === blog.id) {
              return {
                ...each,
                likes: r.likes,
              };
            }

            return each;
          }),
        );
      });
    },
    [setBlogs, user],
  );

  const onRemove = useCallback(
    (blog) => {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        blogService.remove(user, blog.id).then(() => {
          setBlogs((old) => old.filter((each) => each.id !== blog.id));
        });
      }
    },
    [setBlogs, user],
  );

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

    blogService.getAll(user).then((blogs) => setBlogs(() => blogs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = useCallback(
    (e, title, author, url) => {
      e.preventDefault();

      blogService
        .createBlog(user, title, author, url)
        .then((newBlog) => {
          setAlert({
            message: `a new blog ${title} by ${author} added`,
            alertType: "success",
          });

          setBlogs((old) => old.concat(newBlog));
        })
        .catch((e) => {
          setAlert({
            message: e?.message ?? e?.error?.message ?? "Error caught!",
            alertType: "error",
          });
        });
    },
    [setAlert, setBlogs, user],
  );

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
      <AddForm handleSubmit={handleSubmit} />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={() => onLike(blog)}
          onRemove={() => onRemove(blog)}
        />
      ))}
    </main>
  );
};

export default App;
