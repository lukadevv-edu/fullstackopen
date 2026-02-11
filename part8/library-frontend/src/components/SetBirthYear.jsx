import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useCallback, useState } from "react";
import Select from "react-select";

const EDIT_BOOK = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      id
      name
      born
      bookCount
    }
  }
`;

export function SetBirthYear({ authors }) {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [call] = useMutation(EDIT_BOOK);

  const authorOptions = authors.map((a) => ({
    value: a,
    label: a,
  }));

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      call({
        variables: {
          name,
          setBornTo: Number(born),
        },
      });

      setName("");
      setBorn("");
    },
    [born, call, name],
  );

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <Select
            value={authorOptions.find((opt) => opt.value === name)}
            onChange={(option) => setName(option ? option.value : "")}
            options={authorOptions}
            placeholder="Select or type..."
            isClearable
          />
        </div>
        <div>
          born
          <input
            value={born}
            type="number"
            max={2026}
            min={0}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
}
