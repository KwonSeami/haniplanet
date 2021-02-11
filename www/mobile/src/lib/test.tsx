import * as React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react';
import rootReducer from '../reducers';
import {INITIAL_STATE} from '../../store.config';

export const renderWithRedux = (ui, {
  initialState = INITIAL_STATE,
  store = createStore(rootReducer, initialState),
  ...renderOptions
}) => {
  const Wrapper = ({children}) => (
    <Provider store={store}>{children}</Provider>
  );

  return render(ui, {wrapper: Wrapper, ...renderOptions});
};