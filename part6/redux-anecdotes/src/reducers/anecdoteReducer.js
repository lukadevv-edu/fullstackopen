import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotes.service";

const anecdotesAtStart = [];

const getId = () => (1000000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    vote: (state, action) => {
      const id = action.payload;
      const objectToChange = state.find((each) => each.id === id);

      if (!objectToChange) {
        return state;
      }

      const changedNote = {
        ...objectToChange,
        votes: objectToChange.votes + 1,
      };

      const result = state.map((each) =>
        each.id === changedNote.id ? changedNote : each,
      );

      result.sort((a, b) => b.votes - a.votes);

      return result;
    },
    create: (state, action) => {
      return [...state, action.payload];
    },
    setAnecdotes: (_, action) => {
      return action.payload;
    },
  },
});

export const { create, setAnecdotes, vote } = anecdoteSlice.actions;

// Thunks

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const all = await anecdotesService.getAll();

    all.sort((a, b) => b.votes - a.votes);

    dispatch(setAnecdotes(all));
  };
};

export const createAnedcote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.createNew({
      id: getId(),
      content,
      votes: 0,
    });

    dispatch(create(newAnecdote));
  };
};

export const voteAnecdote = (id, content) => {
  return async (dispatch) => {
    await anecdotesService.updateAnecdote(id, content);

    dispatch(vote(id));
  };
};
export default anecdoteSlice.reducer;
