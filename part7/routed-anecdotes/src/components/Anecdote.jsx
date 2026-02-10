import { useParams } from "react-router-dom";

export function Anecdote({ anecdotes }) {
  const id = useParams().id;

  const anecdote = anecdotes.find((n) => n.id == Number(id));

  if (!anecdote) {
    return <h1>404: Note does not exists!</h1>;
  }

  return (
    <div>
      <h2>
        {anecdote.content} by {anecdote.author}
      </h2>
      <div>
        <p>has {anecdote.votes} votes</p>
        <p>
          for more info see{" "}
          <a href={anecdote.info} target="_blank" rel="noreferrer">
            {anecdote.info}
          </a>
        </p>
      </div>
      <div></div>
    </div>
  );
}
