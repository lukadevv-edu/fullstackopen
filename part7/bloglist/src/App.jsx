import { useState, useCallback, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import { AddForm } from "./components/AddForm";
import { Alert } from "./components/Alert";
import { useDispatch, useSelector } from "react-redux";
import { sendNotification } from "./reducers/notificationReducer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initLoggedUser, loginUser, logoutUser } from "./reducers/userReducer";
import { Users } from "./components/Users";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import { User } from "./components/User";
import { BlogRoute } from "./components/BlogRoute";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryGetAll = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => await blogService.getAll(user),
    enabled: !!user,
  });

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      dispatch(
        loginUser({
          username,
          password,
        }),
      );
    },
    [password, username],
  );

  const handleLogout = useCallback(() => {
    setUsername("");
    setPassword("");
    dispatch(logoutUser());
  }, []);

  useEffect(() => {
    dispatch(initLoggedUser());
  }, []);

  if (queryGetAll.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (queryGetAll.isError) {
    return (
      <div>
        <p>Service is not available due to problems in the server...</p>
      </div>
    );
  }

  return (
    <Router>
      <Alert />
      {user && (
        <>
          <header
            style={{
              background: "gray",
              padding: 10,
            }}
          >
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <Link to={"/"}>blogs</Link>
                <Link to={"/users"}>users</Link>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                }}
              >
                <p>{user.name} logged in</p>
                <LogoutButton handleLogout={handleLogout} />
              </div>
            </nav>
          </header>
          <h2>blog app</h2>
        </>
      )}
      {!user ? (
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
      ) : (
        <Routes>
          <Route
            path="*"
            element={
              <main>
                {user ? (
                  <>
                    <AddForm />
                    {queryGetAll.data.map((blog) => (
                      <Blog key={blog.id} blog={blog} />
                    ))}
                  </>
                ) : (
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
                )}
              </main>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogRoute />} />
        </Routes>
      )}
    </Router>
  );
};

function LogoutButton({ handleLogout }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate("/");
        handleLogout();
      }}
    >
      logout
    </button>
  );
}

export default App;
