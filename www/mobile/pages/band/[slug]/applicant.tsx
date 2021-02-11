import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {
  $BORDER_COLOR,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $THIN_GRAY,
  $WHITE,
} from '../../../styles/variables.types';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {appendOrRemoveMemberList, fetchMemberThunk, readMemberThunk} from '../../../src/reducers/orm/member/thunks';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import Loading from '../../../components/common/Loading';
import {nameByExposeType} from '../../../src/constants/band';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import {toDateFormat} from '../../../src/lib/date';
import {memberListSelector} from '../../../src/reducers/orm/member/selector';
import {useRouter} from 'next/router';
import cn from 'classnames';
import loginRequired from '../../../hocs/loginRequired';
import {avatarExposeType} from '../../../src/lib/avatar';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

const Section = styled.section`
  background-color: #f6f7f9;
  padding-bottom: 152px;

  @media screen and (max-width: 680px) {
    padding: 0;
  }
`;

const MsgUl = styled.ul`
  max-width: 580px;
  margin: auto;
  padding: 17px 15px;
  box-sizing: border-box;

  li {
    ${fontStyleMixin({
      size: 12,
      color: $GRAY,
    })}
  }
`;

const TitleDiv = styled.div<{avatar?: string;}>`
  max-width: 580px;
  margin: auto;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};
  position: relative;
  background-color: ${$WHITE};
  padding: 22px 25px 25px;

  .avatar {
    position: absolute;
    right: 55px;
    top: 21px;
    ${({avatar}) => backgroundImgMixin({
      img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
    })};
    width: 40px;
    height: 40px;
    border-radius: 50%;

    img {
      position: absolute;
      right: -32px;
      bottom: 0px;
      width: 40px;
    }
  }

  h2 a {
    ${fontStyleMixin({
      size: 24,
      weight: '300',
    })}

    span {
      display: block;
      padding-bottom: 3px;
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY,
        weight: 'bold',
      })}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 20px 82px 27px 16px;

    .avatar {
      right: 45px;
      top: 17px;
    }
  }
`;

const MemberListDiv = styled.div`
  max-width: 580px;
  margin: auto;
  position: relative;
  background-color: ${$WHITE};

  h2 {
    padding: 13px 24px;
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
    })}

    span {
      ${fontStyleMixin({
        color: $POINT_BLUE,
        family: 'Montserrat',
      })}
      padding-left: 3px;
    }
  }

  @media screen and (max-width: 680px) {
    padding-bottom: 157px;
    
    h2 {
      padding: 13px 16px;
    }
  }
`;

const SelectUl = styled.ul`
  position: absolute;
  right: 10px;
  top: 14px;

  li {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding-left: 14px;
    letter-spacing: 1px;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
      family: 'Montserrat',
    })}

    &.new {
      color: ${$POINT_BLUE};
    }

    &:first-child::after {
      content: '/';
      position: absolute;
      right: -11px;
      top: 50%;
      margin-top: -10px;
    }
    
    img {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 3px 0 0;
      width: 16px;
    }
  }

  @media screen and (max-width: 680px) {
    right: 16px;
    top: 11px;
  }
`;

const MemberListUl = styled.ul`
  & > li {
    position: relative;
    width: 100%;
    border-bottom: 1px solid ${$BORDER_COLOR};

    & > div {
      position: relative;
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: 12px 10px 12px 72px;

      & > img {
        position: absolute;
        left: 25px;
        top: 12px;
        width: 40px;
        height: 40px;
        border-radius: 50%;

        @media screen and (max-width: 680px) {
          left: 16px;
          top: 11px;
        }
      }

      h3 {
        padding-top: 2px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
        })}
      }

      p {
        padding-top: 3px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY,
        })}
      }

      .arrow {
        position: absolute;
        width: 5px;
        right: 18px;
        top: 32px;

        img {
          width: 100%;
          transform: rotate(90deg);

          &.open {
            transform: rotate(-90deg);
          }
        }
      }
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  @media screen and (max-width: 680px) {
    & > li {
      &:last-child {
        border-bottom: 1px solid ${$BORDER_COLOR};
      }

      a {
        padding: 11px 10px 10px 63px;
      }
    } 
  }
`;

const NoContentLi = styled.li`
  text-align: center;
  padding: 34px 0 105px;
  ${fontStyleMixin({
    size: 16,
    color: $TEXT_GRAY,
  })}

  img {
    display: block;
    padding-bottom: 9px;
    margin: auto;
    width: 64px;
  }
`;

const MemberInfoUl = styled.ul`
  padding-bottom: 5px;
  border-top: 1px solid ${$BORDER_COLOR};

  & > li {
    padding-left: 24px;
    padding-right: 24px;
    
    h3 {
      padding-bottom: 5px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
        color: $TEXT_GRAY,
      })}
    }
  }
    
  .user-info {
    border-bottom: 1px solid ${$BORDER_COLOR};
    padding: 0;
    margin: 0 24px;

    li {
      display: inline-block;
      vertical-align: middle;
      padding: 12px 40px 12px 1px;
      margin-top: -3px;
      font-size: 15px;

      span {
        ${fontStyleMixin({
          size: 11,
          weight: 'bold',
          color: $TEXT_GRAY,
        })}
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        padding-right: 3px;
        margin-top: -3px;
      }
    }
  }

  .user-textbox {
    padding-top: 21px;
  }

  .question-list {
    padding-top: 17px;

    li {
      padding-bottom: 15px;

      h3 {
        ${fontStyleMixin({
          size: 15,
          color: $FONT_COLOR,
          weight: 'normal',
        })}
      }
    }    
  }

  .btn-list {
    padding: 0;
  }

  @media screen and (max-width: 680px) {
    border-bottom: 8px solid #f2f3f7;

    & > li {
      padding-left: 13px;
      padding-right: 13px;
    }

    .user-info {
      margin: 0 13px;

      li {
        padding: 15px 35px 11px 0;
      }
    } 
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
`;

const TextareaBox = styled.textarea`
  box-sizing: border-box;
  background-color: #f6f7f9;
  padding: 8px 12px;
  width: 100%;
  height: 80px;
  margin-top: 5px;

  ${fontStyleMixin({
    size: 14,
    color: $GRAY,
  })}

  &.large {
    height: 180px;
  }

  &::placeholder {
    color: ${$TEXT_GRAY};
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  border-top: 1px solid ${$BORDER_COLOR};
  padding: 20px 0 25px;

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    height: 33px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
      size: 15,
      color: '#999',
    })}
    border-radius: 17px;

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

interface IApplicantItem extends Pick<IMoaMember, 'user'
  | 'created_at'
  | 'self_introduce'
  | 'answer'
  | 'id'
  | 'read_at'
>, Pick<IBand, 'user_expose_type'> {
  denyMember: (memberId: HashId) => void;
  allowMember: (memberId: HashId) => void;
  readMember: (memberId: HashId, readAt: string) => void;
}

const ApplicantItem: React.FC<IApplicantItem> = React.memo(({
  user,
  user_expose_type,
  self_introduce,
  created_at,
  answer,
  denyMember,
  allowMember,
  readMember,
  read_at,
  id,
  ...props
}) => {
  const [
    korName,
    engName
  ] = nameByExposeType(user_expose_type, {user});

  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <li>
      <div onClick={() => {
        setIsOpened(curr => !curr);
        readMember(id, read_at);
      }}>
        <img
          src={avatarExposeType(user_expose_type, user.avatar)}
          alt="프로필 이미지"
        />
        <h3>{engName}</h3>
        <p>{`가입신청일 ${toDateFormat(created_at, 'YYYY.MM.DD')}`}</p>
        <span className="arrow">
          <img
            className={cn({open: isOpened})}
            src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
            alt="자세히 보기"
          />
        </span>
      </div>

      {isOpened && (
        <MemberInfoUl>
          <li className="user-info">
            <ul>
              <li>
                <span>{korName}</span> {engName}
              </li>
              <li>
                <span>구분</span> {USER_TYPE_TO_KOR[user.user_type]}
              </li>
            </ul>
          </li>
          <li className="user-textbox">
            <h3>자기소개</h3>
            <TextareaBox
              className="large"
              readOnly
              value={self_introduce}
            />
          </li>
          {answer && (
            <li className="question-list">
              <h3>가입 질문</h3>
              <ul>
                {Object.keys(answer.questions).map((key, index) => (
                  <li key={key}>
                    <h3>{index + 1}. {answer.questions[key]}</h3>
                    <TextareaBox
                      readOnly
                      value={answer.answers[key]}
                    />
                  </li>
                ))}
              </ul>
            </li>
          )}
          <li className="btn-list">
            <StyledButtonGroup
              leftButton={{
                children: '가입 거절',
                onClick: () => {
                  denyMember(id);
                }
              }}
              rightButton={{
                children: '가입 승인',
                onClick: () => {
                  allowMember(id);
                }
              }}
            />
          </li>
        </MemberInfoUl>
      )}
    </li>
  );
});

const BandApplicantMobile = React.memo<{}>(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {query: {slug}} = router;

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {band, member: [members, rest]} = useSelector(
    ({orm}) => ({
      band: pickBandSelector(slug)(orm),
      member: memberListSelector(`${slug}_applied`)(orm)
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
    dispatch(fetchMemberThunk({
      slug,
      sort: 'applied',
      status: 'ongoing',
      option: {
        limit: 10,
        offset: 0,
        order_by: '-created_at'
      },
    }));
  }, [slug]);

  if (!band) {
    return null;
  }
  
  return (
    <Section>
      <MsgUl>
        <li>※ 가입 승인은 3일이내 해주세요.</li>
        <li>※ 회원리스트를 별도로 등록 하려는 경우, 버키 고객센터에 문의 해주세요.</li>
      </MsgUl>
      <MemberListDiv>
        <h2>신청 회원</h2>

        <SelectUl>
          <li className="new">
            {!!rest.unread_count && (
              <img
                src={staticUrl('/static/images/icon/icon-new2.png')}
                alt="NEW"
              />
            )}
            {rest.unread_count}
          </li>
          <li>
            {rest.count}
          </li>
        </SelectUl>
        {!isEmpty(members) ? (
          <StyledInfiniteScroll
            loader={<Loading/>}
            hasMore={rest.next}
            loadMore={() => {
              dispatch(fetchMemberThunk({
                slug,
                sort: 'applied',
                status: 'ongoing',
                option: {
                  limit: 10,
                  offset: 0,
                  order_by: '-created_at'
                },
                next: rest.next
              }));
            }}
            threshold="-250px"
          >
            <MemberListUl>
              {members.map(data => (
                <ApplicantItem
                  key={data.id}
                  {...data}
                  user_expose_type={band.user_expose_type}
                  readMember={(memberPk: HashId, readAt: string) => {
                    dispatch(readMemberThunk({
                      slug,
                      readAt,
                      memberPk
                    }));
                  }}
                  denyMember={(memberPk: HashId) => {
                    confirm('가입을 거절하시겠습니까?') && (
                      dispatch(appendOrRemoveMemberList({
                        slug,
                        listKey: `${slug}_applied`,
                        memberPk,
                        type: 'remove'
                      }))
                    );
                  }}
                  allowMember={(memberPk: HashId) => {
                    confirm('갸입을 승인하시겠습니까?') && (
                      dispatch(appendOrRemoveMemberList({
                        slug,
                        listKey: `${slug}_applied`,
                        anotherListKey: `${slug}_joined`,
                        memberPk,
                        type: 'append'
                      }))
                    );
                  }}
                />
              ))}
            </MemberListUl>
          </StyledInfiniteScroll>
        ) : (
          <NoContentLi>
            <img
              src={staticUrl('/static/images/icon/icon-no-member.png')}
              alt="현재 회원이 없습니다."
            />
            현재 회원이 없습니다.
          </NoContentLi>
        )}
      </MemberListDiv>
    </Section>
  );
});

BandApplicantMobile.displayName = 'BandApplicantMobile';
export default loginRequired(BandApplicantMobile);
