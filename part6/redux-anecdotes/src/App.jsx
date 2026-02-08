import { AnecdoteList } from "./components/AnecdoteList";
import { AnecdotesForm } from "./components/AnecdotesForm";

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdotesForm />
    </div>
  );
};

export default App;
