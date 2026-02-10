import { useRef, useState } from "react";
import { Togglable } from "./Togglable";
import blogService from "../services/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { sendNotification } from "../reducers/notificationReducer";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";

export function AddForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const createBlogRef = useRef();
  const queryClient = useQueryClient();
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();

  const handleSubmitMutation = useMutation({
    mutationFn: async ({ title, author, url }) => {
      return await blogService.createBlog(user, title, author, url);
    },
    onSuccess: (blog) => {
      if (!user) {
        throw new Error("User is not logged in!");
      }

      dispatch(
        sendNotification({
          message: `a new blog ${blog.title} by ${blog.author} added`,
          alertType: "success",
        }),
      );

      const blogs = queryClient.getQueryData(["blogs"]);

      queryClient.setQueryData(["blogs"], blogs.concat(blog));
    },
    onError: (e) => {
      dispatch(
        sendNotification({
          message: e?.message ?? e?.error?.message ?? "Error caught!",
          alertType: "error",
        }),
      );
    },
  });

  const handleSubmit = useCallback(
    (e, title, author, url) => {
      e.preventDefault();

      handleSubmitMutation.mutate({ title, author, url });
    },
    [user],
  );

  return (
    <Togglable ref={createBlogRef} buttonLabel="create new blog">
      <Container className="bg-light p-3 mb-2">
        <h2 className="mb-3">Create New</h2>

        <form
          onSubmit={(e) => {
            handleSubmit(e, title, author, url);
            setTitle("");
            setAuthor("");
            setUrl("");
          }}
          className="d-flex flex-column gap-3"
        >
          <div>
            <label htmlFor="create-title" className="form-label">
              Title
            </label>
            <input
              className="form-control"
              id="create-title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>

          <div>
            <label htmlFor="create-author" className="form-label">
              Author
            </label>
            <input
              className="form-control"
              id="create-author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>

          <div>
            <label htmlFor="create-url" className="form-label">
              URL
            </label>
            <input
              className="form-control"
              id="create-url"
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>

          <Button className="btn btn-primary align-self-start" type="submit">
            Create
          </Button>
        </form>
      </Container>
    </Togglable>
  );
}
