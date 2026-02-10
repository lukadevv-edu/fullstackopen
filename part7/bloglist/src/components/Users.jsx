import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function Users() {
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueriesData("blogs")?.[0]?.[1] ?? [];
  const users = useMemo(() => {
    const result = {};
    for (const blog of blogs) {
      if (!result[blog.user.id]) {
        result[blog.user.id] = 1;
      } else {
        result[blog.user.id]++;
      }
    }

    const arrayResult = [];

    for (const userId in result) {
      const username =
        blogs.find((each) => each.user.id === userId)?.user.username ??
        "Unnamed";

      arrayResult.push({
        id: userId,
        username,
        blogs: result[userId],
      });
    }

    arrayResult.sort((a, b) => b.blogs - a.blogs);

    return arrayResult;
  }, []);

  if (!users?.length) {
    return <></>;
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td />
            <td>
              <strong>blogs created</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
