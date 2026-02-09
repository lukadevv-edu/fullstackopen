import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { sendNotification } from "../reducers/notificationReducer";

export function AnecdoteList() {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter((each) => each.content.includes(filter)),
  );

  const dispatch = useDispatch();

  const handleVote = (id, anecdote) => {
    dispatch(vote(id));

    dispatch(
      sendNotification({
        type: "success",
        message: `you voted '${anecdote}'`,
      }),
    );
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote.id, anecdote.content)}>
          vote
        </button>
      </div>
    </div>
  ));
}
