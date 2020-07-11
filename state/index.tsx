import { createContext, useContext, useReducer, ReactNode } from "react";
import { Lang } from "i18n/langs";

type State = {
  lang: Lang;
  username?: string;
};

type Action = {
  type: ACTIONS;
  payload: Lang | string;
};

export enum ACTIONS {
  CHANGE_LANGUAGE,
  CHANGE_USERNAME,
}

function reducer(state: State, action: Action): any {
  switch (action.type) {
    case ACTIONS.CHANGE_LANGUAGE:
      return {
        ...state,
        lang: action.payload,
      };
    case ACTIONS.CHANGE_USERNAME:
      return {
        ...state,
        username: action.payload,
      };

    default:
      return state;
  }
}

const StateContext = createContext(
  {} as {
    state: State;
    dispatch: (action: Action) => void;
  }
) as any;

export function StateProvider({
  initialState,
  children,
}: {
  initialState: State;
  children: ReactNode | ReactNode[];
}) {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
}

export function useGlobalState() {
  const [state, dispatch] = useContext<any>(StateContext);
  return { state, dispatch };
}
