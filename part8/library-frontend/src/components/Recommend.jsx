import { gql } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const RECOMMEND_ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      id
      published
      title
      genres
      author {
        id
        name
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      favoriteGenre
      username
    }
  }
`;

const Recommend = (props) => {
  const me = useQuery(ME, { skip: !props.token });
  const [call, result] = useLazyQuery(RECOMMEND_ALL_BOOKS);
  const books = result?.data?.allBooks ?? null;

  useEffect(() => {
    if (props.show) {
      call({
        variables: {
          genre: me?.data?.me?.favoriteGenre ?? null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show, me]);

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
