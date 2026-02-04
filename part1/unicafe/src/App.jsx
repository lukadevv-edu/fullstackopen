import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <main>
      <h1>Give Feedback</h1>
      <div>
        <Button onClick={() => setGood((old) => old + 1)} text={"good"} />
        <Button onClick={() => setNeutral((old) => old + 1)} text={"neutral"} />
        <Button onClick={() => setBad((old) => old + 1)} text={"bad"} />
      </div>
      <Statistics bad={bad} good={good} neutral={neutral} />
    </main>
  );
};

function Statistics({ good, neutral, bad }) {
  return (
    <div>
      <h2>Statistics</h2>
      {good + neutral + bad > 0 ? (
        <table>
          <tbody>
            <StatisticLine text={"Good"} value={good} />
            <StatisticLine text={"Neutral"} value={neutral} />
            <StatisticLine text={"Bad"} value={bad} />
            <StatisticLine text={"All"} value={good + neutral + bad} />
            <StatisticLine
              text={"Average"}
              value={(good - bad) / (good + neutral + bad)}
            />
            <StatisticLine
              text={"Positive"}
              value={(good / (good + neutral + bad)) * 100}
            />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
}

function StatisticLine({ text, value }) {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
}

function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

export default App;
