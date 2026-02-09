import { useDispatch } from "react-redux";
import { createAnedcote } from "../reducers/anecdoteReducer";
import { sendNotification } from "../reducers/notificationReducer";

export function AnecdotesForm() {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.anecdote.value;

    e.target.anecdote.value = "";

    dispatch(createAnedcote(content));

    dispatch(
      sendNotification({
        type: "success",
        message: `you have created '${content}'`,
      }),
    );
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
