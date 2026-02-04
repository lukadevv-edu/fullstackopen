import { useMemo } from "react";
import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState([]);
  const totalVotes = useMemo(
    () =>
      votes.reduce((counter, each) => counter + (each === selected ? 1 : 0), 0),
    [selected, votes],
  );
  const topAnecdote = useMemo(() => {
    let topIndex = -1;
    let higherValue = -1;

    for (let i = 0; i < anecdotes.length; i++) {
      let counter = 0;

      for (const vote of votes) {
        if (vote === i) {
          counter++;
        }
      }

      if (counter > higherValue) {
        topIndex = i;
        higherValue = counter;
      }
    }

    return topIndex;
  }, [anecdotes.length, votes]);

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <p>{anecdotes[selected]}</p>
      <p>Has {totalVotes} votes</p>
      <div>
        <button onClick={() => setVotes((old) => old.concat(selected))}>
          Vote
        </button>
        <button
          onClick={() =>
            setSelected(Math.floor(Math.random() * anecdotes.length))
          }
        >
          Next Anecdote
        </button>
      </div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[topAnecdote]}</p>
    </div>
  );
};

export default App;
