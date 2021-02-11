import sessionReducer from './session/sessionReducer';
import reportTypeReducer from './reportType/reportTypeReducer';
import styleReducer from './style/styleReducer';

const systemReducer = (state, action) => ({
  session: sessionReducer(state && state.session, action),
  reportType: reportTypeReducer(state && state.reportType, action),
  style: styleReducer(state && state.style, action),
});

export default systemReducer;
