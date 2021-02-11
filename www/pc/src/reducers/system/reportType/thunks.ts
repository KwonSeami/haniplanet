import isEmpty from 'lodash/isEmpty';
import {Dispatch} from 'redux';
import {axiosInstance} from '@hanii/planet-apis';
import {fetchReportType} from './reportTypeReducer';
import {BASE_URL} from '../../../constants/env';

export const fetchReportTypeThunk = () => (dispatch: Dispatch, getState) => {
  const {system: {session: {access}, reportType}} = getState();

  if (access && isEmpty(reportType)) {
    axiosInstance({token: access, baseURL: BASE_URL})
      .get('/report-type/')
      .then(({data: {result}}) => !!result && dispatch(fetchReportType(result)));
  }
};
