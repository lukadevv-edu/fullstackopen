import { AnecdoteList } from "./components/AnecdoteList";
import { AnecdotesForm } from "./components/AnecdotesForm";
import { Notification } from "./components/Notification";
import Filter from "./components/Filter";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import anecdotesService from "./services/anecdotes.service";
import { setAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    anecdotesService.getAll().then((result) => {
      dispatch(setAnecdotes(result));
    });
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
