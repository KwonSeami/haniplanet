// @진혜연: 구조 및 스타일 수정이 필요합니다.

import * as React from 'react';
import Confirm from '../common/popup/Confirm';
import {PopupProps} from '../common/popup/base/Popup';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import moment from 'moment';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 680px; 
  }
`;

const ConfirmTitle = React.memo(() => (
  <div>
    <div style={{
      display: 'inline-block',
      width: '12px',
      height: '8px',
      backgroundColor: '#000'
    }}/>
    <span>가입 신청 회원</span>
  </div>
));

const ConfirmComp: React.FC<IMoaApplyMember> = React.memo(({
  answer: {
    answers,
    questions
  },
  user,
  self_introduce,
  created_at,
  exposeType
}) => (
    <div>
      <div>
        <img
          src={user.avatar || staticUrl('/static/images/icon/icon-default-profile.png')}
          alt="사용자 이미지"
        />
        <ul>
          <li>
            <span>ID</span> {user.auth_id}
          </li>
          {exposeType !== 'anon' && (
            <li>
              <span>{(user.name || user.nick_name) || ''}</span>
            </li>
          )} 
          <li>
            <span>구분</span> {USER_TYPE_TO_KOR[user.user_type]}
          </li>
        </ul>
        <span>가입신청일</span> {moment(created_at).format('YYYY.MM.DD')}
      </div>
      <div>
        <ul>
          <li>
            <h4>자기소개</h4>
            <p>{self_introduce}</p>
          </li>
          <li>
            <h4>가입 질문</h4>
            <ul>
              {Object.keys(questions).map(key => (
                <li key={key}>
                  <span>{questions[key]}</span>
                  <span>{answers[key]}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
);

interface Props extends PopupProps {
  memberData: IMoaApplyMember;
  exposeType: TExposeType;
  leftClick: () => void;
  rightClick: () => void;
}

const MoaApprovePopup: React.FC<Props> = React.memo(
  ({
    id,
    closePop,
    memberData,
    leftClick,
    rightClick,
    exposeType
  }) => {
    return (
      <StyledConfirm
        id={id}
        closePop={closePop}
        title={<ConfirmTitle/>}
        buttonGroupProps={{
          leftButton: {
            children: (
              <span>가입 거절</span>
            ),
            onClick: () => {
              leftClick();
            }
          },
          rightButton: {
            children: (
              <span>가입 승인</span>
            ),
            onClick: () => {
              rightClick();
            }
          }
        }}
      >
        <ConfirmComp
          exposeType={exposeType}
          {...memberData}
        />
      </StyledConfirm>
    );
  }
);

export default MoaApprovePopup;
