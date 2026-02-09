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

export const { setAnecdotes, vote } = anecdoteSlice.actions;
const { create } = anecdoteSlice.actions;

// Thunks

export const createAnedcote = (content) => {
  return async (dispatch) => {
    const newAnecdote = {
      id: getId(),
      content,
      votes: 0,
    };

    await anecdotesService.createNew(newAnecdote);

    dispatch(create(newAnecdote));
  };
};

export default anecdoteSlice.reducer;
