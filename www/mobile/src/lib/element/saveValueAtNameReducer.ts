const saveValueAtNameReducer = (state, action) => ({
  ...state,
  [action.name]: action.value
});

export default saveValueAtNameReducer;
