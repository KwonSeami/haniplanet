import * as React from 'react';
import Confirm from '../common/popup/Confirm';
import {PopupProps} from '../common/popup/base/Popup';
import styled from 'styled-components';
import {TitleDiv} from '../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $TEXT_GRAY, $GRAY, $BORDER_COLOR} from '../../styles/variables.types';
import {toDateFormat} from '../../src/lib/date';
import {NAME_BY_EXPOSE_TYPE} from '../../src/constants/band';
import {USER_TYPE_TO_KOR} from '../../src/constants/users';
import Avatar from '../AvatarDynamic';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 680px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 8px 0 9px 41px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })}

      &::after {
        content: '';
        position: absolute;
        top: 16px;
        left: 25px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }
  }
`;

const MoaMemberPopupDiv = styled.div<Pick<Props, 'isMemberList'>>`
  padding: 20px 75px 23px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .user-profile {
    position: relative;
    padding-bottom: 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    img {
      width: 40px;
      position: absolute;
      left: 0;
      top: 0;
    }

    ul {
      padding-left: 54px;

      li {
        display: inline-block;
        vertical-align: middle;
        padding-right: 39px;
        ${fontStyleMixin({
          size: 15,
          color: $GRAY
        })}

        span {
          margin-top: -3px;
          padding-right: 3px;
          ${fontStyleMixin({
            size: 11,
            weight: 'bold',
            color: $TEXT_GRAY
          })}
        }
      }
    }

    .date li {
      padding: 6px 5px 0 0;
      letter-spacing: 0;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  }

  ${props => props.isMemberList && `
    .user-profile {
      padding-bottom: 5px;

      ul {
        padding-top: 7px;
      }

      .date {
        padding: 24px 0 0;
      }
    }
  `}
`;

const ApplicationFormUl = styled.ul`
  li {
    padding-top: 17px;

    h2 {
      ${fontStyleMixin({
        size: 11,
        weight: 'bold'
      })}
    }

    h3 {
      font-size: 14px;
    }

    ul {
      margin-top: -5px;
    }
  }
`;

const TextArea = styled.textarea`
  margin-top: 8px;
  height: 56px;
  box-sizing: border-box;
  padding: 8px 12px;
  ${fontStyleMixin({
    size: 14,
    color: $GRAY
  })}
  background-color: #f6f7f9;

  &.large {
    height: 180px;
  }
`;

interface Props extends PopupProps {
  isMemberList?: boolean;
  data: Indexable;
  user_expose_type: TUserExposeType;
  withdrawMember: (memberId: HashId) => void;
  allowMember?: (memberId: HashId) => void;
}

const MoaMemberPopup: React.FC<Props> = React.memo(
  ({id, closePop, isMemberList, data, user_expose_type, withdrawMember, allowMember}) => {
    const {
      user,
      created_at,
      approved_at,
      self_introduce,
      answer: {
        answers,
        questions
      },
      id: memberId 
    } = data;
    const {
      korName,
      engName
    } = NAME_BY_EXPOSE_TYPE[user_expose_type];
  
    return (
      <StyledConfirm
        id={id}
        closePop={closePop}
        title={isMemberList ? '회원리스트' : '가입 신청 회원'}
        buttonGroupProps={{
          leftButton: {
            children: isMemberList ? '탈퇴시키기' : '가입 거절',
            onClick: () => {
              withdrawMember(memberId);
            }
          },
          rightButton: {
            children: !isMemberList && '가입 승인',
            style: isMemberList && {
              display: 'none'
            },
            onClick: () => {
              allowMember(memberId);
            }
          }
        }}
      >
        <MoaMemberPopupDiv isMemberList={isMemberList}>
          <div className="user-profile">
            <Avatar
              id={user.id}
              src={user.avatar}
              userExposeType={user_expose_type}
            />
            <ul>
              <li>
                <span>ID</span> {user.auth_id}
              </li>
              <li>
                <span>{korName}</span> {user[engName]}
              </li>
              <li>
                <span>구분</span> {USER_TYPE_TO_KOR[user.user_type]}
              </li>
            </ul>
            <ul className="date">
              <li>가입신청일 {toDateFormat(created_at, 'YYYY.MM.DD')}</li>
              {(isMemberList && !!approved_at) && (
                <li>가입완료일 {toDateFormat(approved_at, 'YYYY.MM.DD')}</li>
              )}
            </ul>
          </div>
          <ApplicationFormUl>
            <li>
              <h2>자기소개</h2>
              <TextArea
                className="large"
                readOnly
                value={self_introduce}
              />
            </li>
            <li>
              <h2>가입 질문</h2>
              <ul>
                {Object.keys(questions).map((key, index) => (
                  <li key={key}>
                    <h3>{index + 1}. {questions[key]}</h3>
                    <TextArea
                      readOnly
                      value={answers[key]}
                    />
                  </li>
                ))}
              </ul>
            </li>
          </ApplicationFormUl>
        </MoaMemberPopupDiv>
      </StyledConfirm>
    );
  }
);

export default MoaMemberPopup;
