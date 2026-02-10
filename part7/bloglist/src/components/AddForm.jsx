import { useRef, useState } from "react";
import { Togglable } from "./Togglable";
import blogService from "../services/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { sendNotification } from "../reducers/notificationReducer";

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
      <div>
        <h2>create new</h2>

        <form
          onSubmit={(e) => {
            handleSubmit(e, title, author, url);

            setTitle("");
            setAuthor("");
            setUrl("");
          }}
        >
          <div>
            title
            <input
              id="create-title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              id="create-author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              id="create-url"
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </Togglable>
  );
}
