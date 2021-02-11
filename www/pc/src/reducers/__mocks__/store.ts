import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];

export const mockStore = configureMockStore(middlewares);

export const makeMockStore = (initialState = {}, state = {}) => {
  return mockStore({
    ...initialState,
    ...state
  });
};
