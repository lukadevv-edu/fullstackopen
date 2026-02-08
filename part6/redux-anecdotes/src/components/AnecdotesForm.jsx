import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

export function AnecdotesForm() {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const content = e.target.anecdote.value;

    e.target.anecdote.value = "";

    dispatch(createAnecdote(content));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
}
