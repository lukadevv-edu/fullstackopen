import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <main>
      <h1>Give Feedback</h1>
      <div>
        <button onClick={() => setGood((old) => old + 1)}>good</button>
        <button onClick={() => setNeutral((old) => old + 1)}>neutral</button>
        <button onClick={() => setBad((old) => old + 1)}>bad</button>
      </div>
      <div>
        <h2>Statistics</h2>
        <p>Good: {good}</p>
        <p>Neutral: {neutral}</p>
        <p>Bad: {bad}</p>
      </div>
    </main>
  );
};

export default App;
