import {DEFAULT_SESSION} from './session/sessionReducer';
import {DEFAULT_REPORT_TYPE} from './reportType/reportTypeReducer';
import {DEFAULT_STYLE_STATE} from './style/styleReducer';

export const DEFAULT_SYSTEM_STATE: ISystemState = {
  session: DEFAULT_SESSION,
  reportType: DEFAULT_REPORT_TYPE,
  style: DEFAULT_STYLE_STATE,
};