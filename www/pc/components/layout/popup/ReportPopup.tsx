import * as React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import Radio from '../../UI/Radio/Radio';
import Loading from "../../common/Loading";
import Alert, {StyledButton} from '../../common/popup/Alert';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import {fetchReportTypeThunk} from '../../../src/reducers/system/reportType/thunks';
import {$FONT_COLOR, $BORDER_COLOR} from '../../../styles/variables.types';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 390px;

    ${TitleDiv} {
      border: 0;

      h2 {
        font-size: 19px;
        padding: 4px 21px 0;
        letter-spacing: -1.7px;
      }
    }

    ${StyledButton} {
      margin: 16px auto 30px;
    }
  }
`;

const Ul = styled.ul`
  padding: 0 22px;

  li {
    padding-top: 14px;

    label {
      color: ${$FONT_COLOR};
    }
  }
`;

const TextArea = styled.textarea`
  margin-top: 14px;
  height: 80px;
  padding: 10px 12px;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
`;

const REASON_DIRECT_INPUT = '기타 입력';

const ReportPopup = React.memo<PopupProps & {onClick: (form: {reason: string;}) => void;}>(
  ({id, onClick, closePop, ...props}) => {
    // State
    const [isFetch, setIsFetch] = React.useState(true);
    const [report_type, setReportType] = React.useState(null);
    const [reason, setReason] = React.useState('');

    // Redux
    const dispatch = useDispatch();
    const reportTypes = useSelector(({system: {reportType}}) => reportType);

    // Fetch Data
    React.useEffect(() => {
      dispatch(fetchReportTypeThunk());
    }, []);

    React.useEffect(() => {
      if (reportTypes.length > 0 && !report_type) {
        setReportType(reportTypes[0]);
        setIsFetch(false);
      }
    }, [reportTypes, report_type]);

    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        title="신고 사유를 선택해주세요."
        buttonProps={{
          onClick: () => {
            if (!report_type) {
              alert('신고 사유를 선택해주세요');
            } else {
              onClick({reason: report_type === REASON_DIRECT_INPUT ? reason : report_type});
            }
          },
        }}
        {...props}
      >
        {isFetch ? (
          <Loading />
        ) : (
          <Ul>
            {reportTypes.map((item) => (
              <li key={id}>
                <Radio
                  checked={report_type === item}
                  onClick={() => setReportType(item)}
                >
                  {item}
                </Radio>
              </li>
            ))}
            <li>
              <Radio
                checked={report_type === REASON_DIRECT_INPUT}
                onClick={() => setReportType(REASON_DIRECT_INPUT)}
              >
                기타 입력
              </Radio>
              <TextArea
                value={reason}
                onClick={() => setReportType(REASON_DIRECT_INPUT)}
                onChange={e => setReason(e.target.value)}
                placeholder="50자 이내 입력"
              />
            </li>
          </Ul>
        )}
      </StyledAlert>
    );
  },
);

ReportPopup.displayName = 'ReportPopup';
export default ReportPopup;
