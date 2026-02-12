import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client/react";
import { BOOK_FRAGMENT } from "../components/Books";

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_FRAGMENT}
`;

export function useWSSubscribe() {
  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const newBook = data.data.bookAdded;

      window.alert(`New book added! "${newBook.title}"`);

      // 👉 Crear ref normalizada del nuevo libro
      const newBookRef = client.cache.writeFragment({
        data: newBook,
        fragment: gql`
          fragment BookCache on Book {
            id
            title
            published
            genres
            author {
              id
              name
            }
          }
        `,
      });

      // =============================
      // ✅ UPDATE ALL_BOOKS
      // =============================
      client.cache.modify({
        fields: {
          allBooks(existingRefs = [], { args }) {
            // 🧠 Solo agregar si:
            // - genre null (lista principal)
            // - o el genre coincide con el libro

            const genreFilter = args?.genre ?? null;

            if (genreFilter !== null && !newBook.genres.includes(genreFilter)) {
              return existingRefs;
            }

            const alreadyExists = existingRefs.some(
              (ref) => ref.__ref === newBookRef.__ref,
            );

            if (alreadyExists) return existingRefs;

            return [...existingRefs, newBookRef];
          },
        },
      });

      // =============================
      // ✅ UPDATE ALL_AUTHORS
      // =============================
      client.cache.modify({
        fields: {
          allAuthors(existingAuthors = []) {
            const authorId = newBook.author.id;
            const authorRefId = `Author:${authorId}`;

            const existingRef = existingAuthors.find(
              (a) => a.__ref === authorRefId,
            );

            // 🟢 Si NO existe → crear author nuevo
            if (!existingRef) {
              const newAuthorRef = client.cache.writeFragment({
                data: {
                  ...newBook.author,
                  born: null,
                  bookCount: 1,
                  __typename: "Author",
                },
                fragment: gql`
                  fragment NewAuthor on Author {
                    id
                    name
                    born
                    bookCount
                  }
                `,
              });

              return [...existingAuthors, newAuthorRef];
            }

            // 🟡 Si existe → incrementar bookCount
            client.cache.modify({
              id: authorRefId,
              fields: {
                bookCount(c = 0) {
                  return c + 1;
                },
              },
            });

            return existingAuthors;
          },
        },
      });
    },
  });
}
