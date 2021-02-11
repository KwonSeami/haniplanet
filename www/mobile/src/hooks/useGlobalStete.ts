import * as React from "react";

const EMPTY_OBJECT = {};

const isFunction = fn => typeof fn === "function";

const updateValue = (oldValue, newValue) => {
  // 두 번째 인자로 함수를 전달받아 return 값으로 업데이트 가능합니다.
  if (isFunction(newValue)) { return newValue(oldValue); }
  return newValue;
};

const createGlobalStateCommon = initialState => {
  const keys = Object.keys(initialState);
  let wholeGlobalState = initialState;
  let providerMangeState = null;

  const Context = React.createContext(EMPTY_OBJECT);

  const GlobalStateProvider = ({ children }) => {
    const [state, setState] = React.useState(initialState);

    React.useEffect(() => {
      if (!!providerMangeState) {
        console.warn('GlobalStateProvider가 두 개 이상 선언될 경우 의도치 않은 에러를 유발할 수 있습니다.');
      }
      providerMangeState = setState;

      if (state !== initialState) { wholeGlobalState = state; }
      else if (state !== wholeGlobalState) { setState(wholeGlobalState); }

      return () => {
        providerMangeState = null;
      };
    }, [initialState]);

    return React.createElement(Context.Provider, { value: state }, children);
  };

  const validateName = name => {
    if (!keys.includes(name)) {
      console.error(`'${name}'을 initalState에서 찾을 수 없습니다.`);
      return false;
    }

    return true;
  };

  const setGlobalState = (name, update) => {
    if (!validateName(name)) { return null; }

    wholeGlobalState = {
      ...wholeGlobalState,
      [name]: updateValue(wholeGlobalState[name], update)
    };

    if (providerMangeState) { providerMangeState(wholeGlobalState); }
  };

  const getGlobalState = name => {
    if (!validateName(name)) { return null; }
    return wholeGlobalState[name];
  };

  const useGlobalState = name => {
    const state = React.useContext(Context);
    const updater = React.useCallback(update => setGlobalState(name, update), [name]);

    // React의 Hooks는 조건식으로 진행 순서가 변경되면 안되어서 해당 조건을 Hooks 뒤로 분리
    if (!validateName(name)) {
      return null;
    } else if (state === EMPTY_OBJECT) {
      console.error("GlobalStateProvider를 선언해주세요");
      return null;
    }
    return [state[name], updater];
  };

  const getWholeGlobalState = () => wholeGlobalState;

  const setWholeGlobalState = state => {
    wholeGlobalState = state;
    if (providerMangeState) { providerMangeState(wholeGlobalState); }
  };

  return {
    GlobalStateProvider,
    setGlobalState,
    getGlobalState,
    useGlobalState,
    getWholeGlobalState,
    setWholeGlobalState
  };
};

// useState를 사용하는 방식
export const createGlobalState = initialState => {
  const {
    GlobalStateProvider,
    setGlobalState,
    getGlobalState,
    useGlobalState
  } = createGlobalStateCommon(initialState);
  return {
    GlobalStateProvider,
    useGlobalState,
    setGlobalState,
    getGlobalState
  };
};

// useReducer를 사용하는 방식
export const createStore = (reducer, initalState) => {
  if (!initalState) { initalState = reducer(undefined, { type: undefined }); }

  const {
    GlobalStateProvider,
    useGlobalState,
    getWholeGlobalState,
    setWholeGlobalState
  } = createGlobalStateCommon(initalState);

  const dispatch = action => {
    const oldState = getWholeGlobalState();
    const newState = reducer(oldState, action);
    setWholeGlobalState(newState);
    return action;
  };

  return {
    GlobalStateProvider,
    useGlobalState,
    getState: getWholeGlobalState,
    setState: setWholeGlobalState,
    dispatch,
  };
};
