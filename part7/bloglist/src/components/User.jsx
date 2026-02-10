import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function User() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueriesData("blogs")?.[0]?.[1] ?? [];
  const userData = useMemo(() => {
    const result = {
      username: null,
      blogs: [],
    };

    for (const each of blogs) {
      if (each.user.id === id) {
        if (!result.username) {
          result.username = each.user.username;
        }

        result.blogs.push(each);
      }
    }

    if (!result.username) {
      return null;
    }

    return result;
  }, []);

  if (!userData) {
    return (
      <div>
        <h3>User was not found!</h3>
      </div>
    );
  }

  return (
    <div>
      <h2>{userData.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {userData.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
