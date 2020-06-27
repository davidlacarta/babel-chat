import React, { createContext, useContext, useReducer } from "react";

const StateContext = createContext();

const ACTIONS = {
  CHANGE_LANGUAGE: "change_language",
  CHANGE_USERNAME: "change_username",
};

function StateProvider({ reducer, initialState, children }) {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
}

function useGlobalState() {
  const [state, dispatch] = useContext(StateContext);
  return { state, dispatch };
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_LANGUAGE:
      return {
        ...state,
        lang: action.lang,
      };
    case ACTIONS.CHANGE_USERNAME:
      return {
        ...state,
        username: action.username,
      };

    default:
      return state;
  }
}

export { StateProvider, useGlobalState, reducer, ACTIONS };
