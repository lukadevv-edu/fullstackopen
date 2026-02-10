import { useState, useCallback, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import { AddForm } from "./components/AddForm";
import { Alert } from "./components/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
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
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/Spinner";

const App = () => {
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spinner />
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
    <main>
      <Router>
        {user && (
          <>
            <header className="p-2">
              <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                  <div className="d-flex align-items-center gap-2 w-100">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Brand as={Link} to="/" className="me-2">
                      Blog App
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="me-auto">
                        <Nav.Link as={Link} to="/blogs">
                          Blogs
                        </Nav.Link>
                        <Nav.Link as={Link} to="/users">
                          Users
                        </Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                    <div className="d-flex align-items-center gap-2 ms-auto">
                      <span>{user?.name} logged in</span>
                      <LogoutButton handleLogout={handleLogout} />
                    </div>
                  </div>
                </Container>
              </Navbar>
            </header>
          </>
        )}
        <Alert />
        {!user ? (
          <form
            onSubmit={handleLogin}
            className="d-flex flex-column gap-3 bg-light p-4 mt-2"
          >
            <div>
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>

            <Button className="btn btn-primary align-self-start" type="submit">
              Login
            </Button>
          </form>
        ) : (
          <Routes>
            <Route
              path="*"
              element={
                <Container>
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
                </Container>
              }
            />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<BlogRoute />} />
          </Routes>
        )}
      </Router>
    </main>
  );
};

function LogoutButton({ handleLogout }) {
  const navigate = useNavigate();

  return (
    <Button
      variant="danger"
      onClick={() => {
        navigate("/");
        handleLogout();
      }}
    >
      logout
    </Button>
  );
}

export default App;
