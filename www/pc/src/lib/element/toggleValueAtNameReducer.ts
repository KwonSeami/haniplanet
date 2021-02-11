const toggleValueAtNameReducer = (state, action) => ({
  ...state,
  [action.name]: !state[action.name]
});

export default toggleValueAtNameReducer;
