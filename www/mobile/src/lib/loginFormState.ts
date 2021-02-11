import saveValueAtNameReducer from './element/saveValueAtNameReducer';

export const LOGIN_FORM_STATE = {
  auth_id: '',
  password: '',
  authIdErr: '',
  passwordErr: '',
} as const;

type TLoginFormState = typeof LOGIN_FORM_STATE;

export const loginFormReducer = (
  state: TLoginFormState,
  action,
): TLoginFormState => {
  switch (action.type) {
    case 'FIELD':
      return saveValueAtNameReducer(state, action);
    case 'ERROR':
      return {
        ...state,
        ...action.error,
      };
    default:
      return state;
  }
};