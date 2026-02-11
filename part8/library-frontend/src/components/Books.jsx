import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      author
      published
    }
  }
`;

const Books = (props) => {
  const [call, result] = useLazyQuery(ALL_BOOKS);
  const books = result?.data?.allBooks ?? null;

  useEffect(() => {
    if (props.show) {
      call();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  if (!books) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
