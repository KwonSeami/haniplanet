import * as React from 'react';
import styled from 'styled-components';
import CheckBox from '../../../../../components/UI/Checkbox1/CheckBox';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../../../styles/variables.types';
import {TSignupForm} from '../FormPC';

const StyledVerticalTitleCard = styled(VerticalTitleCard)`
  padding: 15px 0 19px 152px;
`;

const CheckLi = styled.li`
  padding-top: 6px;

  &:first-child {
    padding-bottom: 16px;
  }

  span {
    padding-left: 5px;
    ${fontStyleMixin({
      size: 11,
      color: $TEXT_GRAY
    })};
  }
`;

const StyledCheckBox = styled(CheckBox)`
  label {
    padding-left: 23px;

    &::before {
      width: 15px;
      height: 15px;
      left: -1px;
      top: 1px;
    }
  }
`;

interface Props {
  form: TSignupForm['marketingAccept'];
  dispatchSignupForm: React.Dispatch<any>;
}

const MarketingAcceptPC = React.memo<Props>(({form, dispatchSignupForm}) => {
  const {is_email_receive, is_sms_receive} = form;
  const onChangeReceiveStatus = React.useCallback((value: string) => () => {
    dispatchSignupForm({type: 'KEY_TOGGLE_FIELD', key: 'marketingAccept', value});
  }, []);

  return (
    <StyledVerticalTitleCard
      title={<>마케팅<br />수신 동의</>}
      msg="(선택항목)"
    >
      <ul>
        <CheckLi>
          <StyledCheckBox
            checked={is_email_receive}
            onChange={onChangeReceiveStatus('is_email_receive')}
          >
            이메일 수신동의
            <span>사이트 이용, 이벤트, 프로모션 안내 이메일 수신을 동의합니다.</span>
          </StyledCheckBox>
        </CheckLi>
        <CheckLi>
          <StyledCheckBox
            checked={is_sms_receive}
            onChange={onChangeReceiveStatus('is_sms_receive')}
          >
            SMS 수신동의
            <span>사이트 이용, 이벤트, 프로모션 안내 이메일 수신을 동의합니다.</span>
          </StyledCheckBox>
        </CheckLi>
      </ul>
    </StyledVerticalTitleCard>
  );
});

export default MarketingAcceptPC;
