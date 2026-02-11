import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { SetBirthYear } from "./SetBirthYear";

// eslint-disable-next-line react-refresh/only-export-components
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

const Authors = (props) => {
  const [call, result] = useLazyQuery(ALL_AUTHORS);
  const authors = result?.data?.allAuthors ?? null;

  useEffect(() => {
    if (props.show) {
      call();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  if (!authors) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors.map((each) => each.name)} />
    </div>
  );
};

export default Authors;
