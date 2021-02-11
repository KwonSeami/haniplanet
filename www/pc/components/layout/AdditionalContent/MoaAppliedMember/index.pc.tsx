import * as React from 'react';
import AdditionalContentItemPC from '../AdditionalContentItem/AdditionalContentItemPC';
import styled from 'styled-components';
import {fontStyleMixin, backgroundImgMixin} from '../../../../styles/mixins.styles';
import {$GRAY, $POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import Button from '../../../inputs/Button/ButtonDynamic';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {pushPopup} from '../../../../src/reducers/popup';
import isEmpty from 'lodash/isEmpty';
import {fetchMemberThunk, appendOrRemoveMemberList, readMemberThunk} from '../../../../src/reducers/orm/member/thunks';
import isEqual from 'lodash/isEqual';
import {memberListSelector} from '../../../../src/reducers/orm/member/selector';
import {pickBandSelector} from '../../../../src/reducers/orm/band/selector';
import MoaMemberPopup from '../../../moa/MoaMemberPopup';
import {avatarExposeType} from '../../../../src/lib/avatar';

const StyledAdditionalContentItemPC = styled(AdditionalContentItemPC)`
  padding: 11px 0 35px;

  .title-right-btn {
    top: -3px;
    ${fontStyleMixin({
      size: 18,
      family: 'Montserrat',
      weight: '300'
    })}

    img {
      width: 16px;
      display: inline-block;
      vertical-align: middle;
      margin: -3px 5px 0 0;
    }

    strong {
      ${fontStyleMixin({
        family: 'Montserrat',
        weight: '300',
        color: $POINT_BLUE
      })}
    }
  }

  & > p {
    padding: 4px 0 9px;
    line-height: 1.5;
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })}
  }
`;

const UserListLi = styled.li`
  position: relative;
  padding: 13px 8px 13px 56px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  cursor: pointer;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/icon/arrow/icon-more-arrow.png'),
    size: '5px',
    position: '97% 50%'
  })}

  &:last-child {
    border-bottom: 0;
  }

  h2 {
    ${fontStyleMixin({
      size: 13,
      weight: '600'
    })}
  }

  p {
    padding-top: 3px;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}
  }

  .icon-notice {
    position: absolute;
    left: 4px;
    top: 14px;
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${$POINT_BLUE};
  }
`;

const UserListImg = styled.img`
  position: absolute;
  left: 8px;
  top: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const MoreImg = styled.img`
  transform: rotate(90deg);
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 2px 9px;
  width: 5px;
`;

const NoContentLi = styled.li`
  margin-top: -10px;
  padding: 13px 0 14px;
  text-align: center;
  background-color: #f9f9f9;
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })}
`;

interface Props {
  slug: string;
}

interface IMoaApplyMember {
  user: IUser;
  read_at: string;
  user_expose_type: string;
}

interface IUser {
  name: string;
  nick_name: string;
  avatar: string;
  created_at: string;
  auth_id: string;
}

const AppliedUser: React.FC<IMoaApplyMember> = React.memo(({
  user: {
    name,
    nick_name,
    avatar,
    created_at,
    auth_id
  },
  read_at,
  user_expose_type,
}) => (
  <>
    {read_at === null && (
      <span className="icon-notice" />
    )}
    <UserListImg
      src={avatarExposeType(user_expose_type, avatar)}
      alt="프로필 이미지"
    />
    <h2>
      {auth_id}
      {(name || nick_name)
        ? `(${name || nick_name})`
        : ''
      }
    </h2>
    <p>가입신청일 {moment(created_at).format('YYYY.MM.DD')}</p>
  </>
));

const MoaAppliedMemberPC: React.FC<Props> = React.memo(({slug}) => {
  const dispatch = useDispatch();

  const {band, member: [members, rest]} = useSelector(
    ({orm}) => ({
      band: pickBandSelector(slug)(orm),
      member: memberListSelector(`${slug}_applied`)(orm)
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  React.useEffect(() => {
    dispatch(fetchMemberThunk({
      slug,
      sort: 'applied',
      status: 'ongoing',
      option: {limit: 10, offset: 0},
    }));
  }, [slug]);

  const {user_expose_type} = band;

  return (
    <StyledAdditionalContentItemPC
      title="가입 신청 회원"
      titleRightComp={(
        <>
          {!!rest.unread_count && (
            <img
              src={staticUrl("/static/images/icon/icon-new2.png")}
              alt="New"
            />
          )}
          <strong className="new-count">{rest.unread_count}</strong> / {rest.count}
        </>
      )}
      to="/"
    >
      <p>
        ※ 가입 승인은 3일이내 해주세요.<br />
        ※ 회원리스트를 별도로 등록 하려는 경우, 버키 고객센터에 문의 해주세요.
      </p>

      <ul>
        {!isEmpty(members) ? (
          members.map(data => (
            <UserListLi
              key={data.id}
              onClick={() => {
                dispatch(readMemberThunk({
                  slug,
                  readAt: data.read_at,
                  memberPk: data.id
                }));

                dispatch(pushPopup(
                  MoaMemberPopup,
                  {
                    data,
                    user_expose_type,
                    withdrawMember: (memberPk: HashId) => {
                      dispatch(appendOrRemoveMemberList({
                        slug,
                        listKey: `${slug}_applied`,
                        memberPk,
                        type: 'remove'
                      }));
                    },
                    allowMember: (memberPk: HashId) => {
                      dispatch(appendOrRemoveMemberList({
                        slug,
                        listKey: `${slug}_applied`,
                        anotherListKey: `${slug}_joined`,
                        memberPk,
                        type: 'append'
                      }));
                    }
                  }
                ));
              }}
            >
              <AppliedUser 
                {...data}
                user_expose_type={user_expose_type}
              />
            </UserListLi>
          ))
        ) : (
          <NoContentLi>
            가입신청 회원이 없습니다.
          </NoContentLi>
        )}
        {rest.next && (
          <Button
            font={{
              size: '14px',
              color: '#999'
            }}
            size={{
              width: '100%',
              height: '45px'
            }}
            border={{
              radius: '0',
              width: '1px',
              color: $BORDER_COLOR
            }}
            onClick={() => {
              dispatch(fetchMemberThunk({
                slug,
                sort: 'applied',
                status: 'ongoing',
                option: {
                  limit: 10,
                  offset: 0
                },
                next: rest.next
              }));
            }}
          >
            더보기
            <MoreImg
              src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
              alt="더보기"
            />
          </Button>
        )}
      </ul>
    </StyledAdditionalContentItemPC>
  );
});

export default MoaAppliedMemberPC;
