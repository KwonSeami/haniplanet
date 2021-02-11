import * as React from 'react';
import styled from 'styled-components';
import Alert from '../../common/popup/Alert';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $GRAY} from '../../../styles/variables.types';
import {PopupProps} from '../../common/popup/base/Popup';

const StyledAlert = styled(Alert)`
  .modal-body {
    min-width: 300px;
    width: 300px;

    .popup-title {
      padding: 58px 20px 10px;
      border-bottom: 0;

      h2 {
        text-align: center;
        ${fontStyleMixin({
          size: 18,
          weight: '600'
        })};
      }

      span {
        top: 13px;
        right: 19px;
      }
    }

    .popup-child {
      p {
        line-height: 24px;
        text-align: center;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY
        })};

        span {
          color: ${$POINT_BLUE};
        }
      }
    }

    .button {
      margin: 18px auto 30px;
    }
  }
`;

interface Props extends PopupProps {
  end_date: string;
  title: string;
  status: string;
}

const OnClassExtensionAlert: React.FC<Props> = ({
  id,
  closePop,
  status,
  end_date,
  title
}) => (
  <StyledAlert
    id={id}
    closePop={closePop}
    title={title}
  >
    <p>
      {status}신청이 정상 처리되었습니다.<br/>
      <span>{end_date}</span>까지 수강이 가능합니다.
    </p>
  </StyledAlert>
);

OnClassExtensionAlert.displayName = 'OnClassExtensionAlert';
export default React.memo(OnClassExtensionAlert);
