import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import blogService from "../services/blogs";
import { sendNotification } from "../reducers/notificationReducer";

export function BlogRoute() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueriesData("blogs")?.[0]?.[1] ?? [];
  const blogData = useMemo(() => blogs.find((each) => each.id === id), [blogs]);
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();

  const likeMutation = useMutation({
    mutationFn: async () => await blogService.addLike(user, blogData),
    onSuccess: (targetBlog) => {
      dispatch(
        sendNotification({
          message: `you voted "${targetBlog.title}"`,
          alertType: "success",
        }),
      );

      const blogs = queryClient.getQueryData(["blogs"]);

      queryClient.setQueryData(
        ["blogs"],
        blogs.map((each) => (each.id === targetBlog.id ? targetBlog : each)),
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      if (window.confirm("Are you sure?")) {
        await blogService.remove(user, blogData.id);

        return blogData;
      }

      throw new Error("Operation was cancelled!");
    },
    onSuccess: (targetBlog) => {
      dispatch(
        sendNotification({
          message: `you have removed "${targetBlog.title}"`,
          alertType: "success",
        }),
      );

      const blogs = queryClient.getQueryData(["blogs"]);

      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((each) => each.id !== targetBlog.id),
      );
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment) =>
      await blogService.addComment(user, blogData.id, comment),
    onSuccess: (targetBlog) => {
      dispatch(
        sendNotification({
          message: `you have commented in "${targetBlog.title}"`,
          alertType: "success",
        }),
      );

      const blogs = queryClient.getQueryData(["blogs"]);

      queryClient.setQueryData(
        ["blogs"],
        blogs.map((each) => (each.id === targetBlog.id ? targetBlog : each)),
      );
    },
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const value = e.target.comment.value;

    if (!value || value.length < 1) {
      alert("Please put a valid comment...");
      return;
    }

    addCommentMutation.mutate(value);

    e.target.comment.value = "";
  }, []);

  if (!blogData) {
    return (
      <div>
        <p>Blog was not found!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>
        {blogData.title} {blogData.author}
      </h2>
      <a href={blogData.url} target="_blank" rel="noreferrer">
        {blogData.url}
      </a>
      <div>
        <p>
          {blogData.likes}
          <span> likes</span>
        </p>
        <button onClick={() => likeMutation.mutate(blogData)}>like</button>
      </div>
      <p>added by {blogData.author}</p>
      {user && user.username === blogData.user.username && (
        <button onClick={() => removeMutation.mutate(blogData)}>remove</button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blogData.comments?.map((each, i) => (
          <li key={each + i}>{each}</li>
        ))}
      </ul>
    </div>
  );
}
