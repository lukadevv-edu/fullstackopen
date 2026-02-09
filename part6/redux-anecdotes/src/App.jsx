import { AnecdoteList } from "./components/AnecdoteList";
import { AnecdotesForm } from "./components/AnecdotesForm";
import { Notification } from "./components/Notification";
import Filter from "./components/Filter";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdotesForm />
    </div>
  );
};

export default App;
