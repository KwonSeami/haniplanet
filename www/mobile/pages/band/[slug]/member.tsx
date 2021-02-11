import * as React from 'react';
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
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import useBandMember from '../../../src/hooks/band/useBandMember';
import {staticUrl} from '../../../src/constants/env';
import Loading from '../../../components/common/Loading';
import {toDateFormat} from '../../../src/lib/date';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {fetchMemberThunk} from '../../../src/reducers/orm/member/thunks';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import {useDispatch} from 'react-redux';
import Link from 'next/link';
import cn from 'classnames';
import {isEmpty} from 'lodash';
import {useRouter} from 'next/router';
import { nameByExposeType, ADMIN_PERMISSION_GRADE } from '../../../src/constants/band';
import loginRequired from '../../../hocs/loginRequired';
import Avatar from '../../../components/Avatar';
import has from 'lodash/has';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import Page403 from '../../../components/errors/Page403';

const Section = styled.section`
  background-color: #f6f7f9;
  padding-bottom: 152px;

  @media screen and (max-width: 680px) {
    padding: 0;
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

  & > .avatar {
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

    & > .avatar {
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

    &.member-count {
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

    &.select-list {
      padding-left: 11px;

      a {
        ${fontStyleMixin({
          size: 12,
          weight: '600',
        })}
      }

      &:first-child::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        width: 1px;
        height: 7px;
        background-color: ${$BORDER_COLOR};
        margin-top: -4px;
      }

      &.on a {
        text-decoration: underline;
        color: ${$POINT_BLUE};
      }
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
      
      .avatar {
        position: absolute;
        top: 12px;
        left: 25px;
        
        @media screen and (max-width: 680px) {
          top: 11px;
          left: 16px;
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

interface IBandMemberItem extends Pick<IMoaMember, 'user'
  | 'created_at'
  | 'approved_at'
  | 'self_introduce'
  | 'answer'
  | 'id'>, Pick<IBand, 'user_expose_type'> {
  withdrawMember: (memberId: HashId) => void;
}

const BandMemberItem: React.FC<IBandMemberItem> = React.memo((
  {
    user,
    user_expose_type,
    created_at,
    approved_at,
    self_introduce,
    answer,
    id,
    withdrawMember,
    myId
  },
) => {
  const [
    korName,
    engName,
  ] = nameByExposeType(user_expose_type, {user});

  const [isOpened, setIsOpened] = React.useState(false);
  
  const isMine = id === myId;
  const visible = (!isEmpty((answer || {}).answers) && !!self_introduce) || isMine;

  return (
    <li>
      <div onClick={() => visible && setIsOpened(curr => !curr)}>
        <Avatar
          hideUserName
          size={40}
          src={user.avatar}
          userExposeType={user_expose_type}
        />
        <h3>{engName}</h3>
        <p>{!!approved_at && `가입완료일 ${toDateFormat(approved_at, 'YYYY.MM.DD')} ·`}{`가입신청일 ${toDateFormat(created_at, 'YYYY.MM.DD')}`}</p>
        {visible && (
          <span className="arrow">
            <img
              className={cn({open: isOpened})}
              src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
              alt="자세히 보기"
            />
          </span>
        )}
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
          {!isMine && (
            <li className="btn-list">
              <StyledButtonGroup
                leftButton={{
                  children: '탈퇴시키기',
                  onClick: () => {
                    withdrawMember(id);
                  },
                }}
                rightButton={{
                  style: {display: 'none'},
                }}
              />
            </li>
          )}
        </MemberInfoUl>
      )}
    </li>
  );
});

BandMemberItem.displayName = 'BandMemberItem';

const MemberListMobile = React.memo<{}>(() => {
  // State
  const [myId, setMyId] = React.useState();
  
  // Router
  const {query: {slug}} = useRouter();
  
  // Dispatch
  const dispatch = useDispatch();

  // API
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {
    band,
    orderBy,
    withdrawMember,
    members,
    rest,
  } = useBandMember(slug);
  
  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));

    bandApi.me(slug).then(({data: {result}}) => !!has(result, 'id') && setMyId(result.id));
  }, [slug]);

  if (!band) {
    return <Loading />;
  }

  const {
    name,
    avatar,
    user_expose_type,
    band_member_grade,
  } = band;

  return (
    (user_expose_type === 'real' && !ADMIN_PERMISSION_GRADE.includes(band_member_grade)) ? (
      <Page403/>
    ) : (
      <Section>
        <TitleDiv avatar={avatar}>
          <div className="avatar">
            <img
              src={staticUrl('/static/images/icon/icon-expert.png')}
              alt="모아 대표이미지"
            />
          </div>
          <h2>
            <Link href="/band/[slug]" as={`/band/${slug}`}>
              <a>
                <span>MOA명</span>
                {name}
              </a>
            </Link>
          </h2>
        </TitleDiv>
        <MemberListDiv>
          <h2>
            총 회원수 <span>{rest.count}</span>
          </h2>

          <SelectUl>
            <li className={cn({
              'select-list': true,
              on: orderBy === '-created_at'
            })}>
              <Link href={`/band/${slug}/member/?order_by=-created_at`}>
                <a>
                  최근가입순
                </a>
              </Link>
            </li>
            <li className={cn({
              'select-list': true,
              on: orderBy === 'identifier'
            })}>
              <Link href={`/band/${slug}/member/?order_by=identifier`}>
                <a>오래된순</a>
              </Link>
            </li>
          </SelectUl>
          {!isEmpty(members) ? (
            <StyledInfiniteScroll
              loader={<Loading/>}
              hasMore={rest.next}
              loadMore={() => {
                dispatch(fetchMemberThunk({
                  slug,
                  sort: 'joined',
                  status: 'active',
                  option: {order_by: orderBy},
                  next: rest.next,
                }));
              }}
              threshold="-250px"
            >
              <MemberListUl>
                {members.map(data => (
                  <BandMemberItem
                    key={data.id}
                    myId={myId}
                    {...data}
                    user_expose_type={user_expose_type}
                    withdrawMember={(memberId: HashId) => {
                      withdrawMember(memberId);
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
    )
  );
});

export default loginRequired(MemberListMobile);
