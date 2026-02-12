import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ALL_BOOKS = gql`
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

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre,
    },
    skip: !props.show,
  });
  const books = result?.data?.allBooks ?? null;
  const genres =
    books?.reduce((set, each) => {
      for (const genre of each.genres ?? []) {
        set.add(genre);
      }

      return set;
    }, new Set()) ?? null;

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
      <div>
        {genres &&
          [...genres].map((each) => (
            <button
              style={
                genre === each
                  ? {
                      background: "gray",
                    }
                  : undefined
              }
              key={each}
              onClick={() => setGenre((old) => (old === each ? null : each))}
            >
              {each}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Books;
