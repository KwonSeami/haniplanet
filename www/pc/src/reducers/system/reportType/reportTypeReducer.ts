import {createActions, handleActions} from 'redux-actions';

export const FETCH_REPORT_TYPE = 'FETCH_REPORT_TYPE';

export const {fetchReportType} = createActions({
  [FETCH_REPORT_TYPE]: (payload) => payload,
});

export const DEFAULT_REPORT_TYPE: string[] = [];

const reportTypeReducer = handleActions({
    [fetchReportType.toString()]: (_, {payload}) => payload,
  },
  DEFAULT_REPORT_TYPE,
);

export default reportTypeReducer;
