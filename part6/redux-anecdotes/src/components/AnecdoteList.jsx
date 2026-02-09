import { useDispatch, useSelector } from "react-redux";
import { sendNotification } from "../reducers/notificationReducer";
import { voteAnecdote } from "../reducers/anecdoteReducer";

export function AnecdoteList() {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter((each) => each.content.includes(filter)),
  );

  const dispatch = useDispatch();

  const handleVote = (id, anecdote, votes) => {
    dispatch(
      voteAnecdote(id, {
        votes: votes + 1,
      }),
    );

    dispatch(sendNotification(`you voted '${anecdote}'`, 4000));
  };

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button
          onClick={() =>
            handleVote(anecdote.id, anecdote.content, anecdote.votes)
          }
        >
          vote
        </button>
      </div>
    </div>
  ));
}
