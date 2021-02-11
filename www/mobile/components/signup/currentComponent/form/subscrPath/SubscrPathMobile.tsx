import * as React from 'react';
import styled from 'styled-components';
import Radio, {Span} from '../../../../../components/UI/Radio/Radio';
import VerticalTitleCardMobile from '../../../../../components/UI/Card/VerticalTitleCardMobile';
import {StyledInput, TSignupForm} from '../FormMobile';

const StyledVerticalTitleCardMobile = styled(VerticalTitleCardMobile)`
  @media screen and (max-width: 500px) {
    padding-bottom: 30px;
  }
`;

const RouteLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 15px 30px 0 0;
  
  &:last-child {
    padding-right: 0;

    ${Span} {
      top: 12px !important;
    }
  }

  input {
    width: 283px;
  }

  @media screen and (max-width: 680px) {
    ${Span} {
      top: 2px;
    }
  }

  @media screen and (max-width: 500px) {
    &:last-child {
      padding-top: 1px;
    }
  }
`;

const DIRECT_JOIN_PATH = '직접 입력';

const JOIN_PATH_ROUTES = [
  '검색포털 사이트',
  '지인추천',
  'SNS',
  '세미나, 모임',
  '한의학 커뮤니티'
];

interface Props {
  form: TSignupForm['subscrPath'];
  dispatchSignupForm: React.Dispatch<any>;
}

const SubscrPathMobile: React.FC<Props> = React.memo(
  ({form, dispatchSignupForm}) => {
    const {joinPath, directJoinPath, error: {joinPathErr}} = form;

    const handleOnChangeSubscrPathData = React.useCallback((name, value) => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'subscrPath', name, value});
    }, []);

    React.useEffect(() => {
      handleOnChangeSubscrPathData(
        'join_path_text',
        joinPath === DIRECT_JOIN_PATH ? directJoinPath : joinPath
      );
    }, [handleOnChangeSubscrPathData, joinPath, directJoinPath]);
  
    return (
      <StyledVerticalTitleCardMobile
        title="가입경로"
        errormsg={!!joinPathErr && joinPathErr}
      >
        <ul>
          {JOIN_PATH_ROUTES.map(item => (
            <RouteLi key={item}>
              <Radio
                name={item}
                checked={joinPath === item}
                onClick={() => handleOnChangeSubscrPathData('joinPath', item)}
              >
                {item}
              </Radio>
            </RouteLi>
          ))}
          <RouteLi>
            <Radio
              checked={joinPath === DIRECT_JOIN_PATH}
              onClick={() => handleOnChangeSubscrPathData('joinPath', DIRECT_JOIN_PATH)}
            >
              <StyledInput
                type="text"
                placeholder="직접입력"
                maxLength={30}
                name="directJoinPath"
                onBlur={({target: {name, value}}) => handleOnChangeSubscrPathData(name, value)}
              />
            </Radio>
          </RouteLi>
        </ul>
      </StyledVerticalTitleCardMobile>
    );
  }
);

SubscrPathMobile.displayName = 'SubscrPathMobile';
export default SubscrPathMobile;
