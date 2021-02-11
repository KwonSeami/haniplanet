import * as React from 'react';
import styled from 'styled-components';
import CheckBox from '../../../../../components/UI/Checkbox1/CheckBox';
import VerticalTitleCardMobile from '../../../../../components/UI/Card/VerticalTitleCardMobile';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../../../styles/variables.types';
import {TSignupForm} from '../FormMobile';

const StyledVerticalTitleCardMobile = styled(VerticalTitleCardMobile)`
  ul {
    padding-top: 10px;
  }

  @media screen and (max-width: 680px) {
    padding: 10px 15px 13px;
  }

  @media screen and (max-width: 500px) {
    padding-bottom: 0;
  }
`;

const CheckLi = styled.li`
  padding-top: 6px;

  &:first-child {
    padding-bottom: 16px;
  }

  span {
    ${fontStyleMixin({
      size: 11,
      color: $TEXT_GRAY
    })};
  }

  @media screen and (max-width: 500px) {
    padding-bottom: 0 !important;
    
    span {
      display: block;
      padding: 4px 0 0 25px;
    }
  }
`;

interface Props {
  form: TSignupForm['marketingAccept'];
  dispatchSignupForm: React.Dispatch<any>;
}

const MarketingAcceptMobile: React.FC<Props> = React.memo(
  ({form, dispatchSignupForm}) => {
    const {is_email_receive, is_sms_receive} = form;
    const onChangeReceiveStatus = React.useCallback((value: string) => () => {
      dispatchSignupForm({type: 'KEY_TOGGLE_FIELD', key: 'marketingAccept', value});
    }, []);

    return (
      <StyledVerticalTitleCardMobile
        title="마케팅 수신 동의"
        msg="(선택항목)"
      >
        <ul>
          <CheckLi>
            <CheckBox
              checked={is_email_receive}
              onChange={onChangeReceiveStatus('is_email_receive')}
            >
              이메일 수신동의
              <span>사이트 이용, 이벤트, 프로모션 안내 이메일 수신을 동의합니다.</span>
            </CheckBox>
          </CheckLi>
          <CheckLi>
            <CheckBox
              checked={is_sms_receive}
              onChange={onChangeReceiveStatus('is_sms_receive')}
            >
              SMS 수신동의
              <span>사이트 이용, 이벤트, 프로모션 안내 이메일 수신을 동의합니다.</span>
            </CheckBox>
          </CheckLi>
        </ul>
      </StyledVerticalTitleCardMobile>
    );
  }
);

export default MarketingAcceptMobile;
