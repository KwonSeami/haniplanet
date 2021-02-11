import * as React from 'react';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import Loading from '../../../components/common/Loading';
import SelectBox from '../../../components/inputs/SelectBox';
import MoaMemberPopup from '../../../components/moa/MoaMemberPopup';
import WaypointHeader from '../../../components/layout/header/WaypointHeader';
import InfiniteScroll from '../../../components/InfiniteScroll/InfiniteScroll';
import loginRequired from '../../../hocs/loginRequired';
import useBandMember from '../../../src/hooks/band/useBandMember';
import {staticUrl} from '../../../src/constants/env';
import {pushPopup} from '../../../src/reducers/popup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {ADMIN_PERMISSION_GRADE, nameByExposeType} from '../../../src/constants/band';
import {fetchMemberThunk} from '../../../src/reducers/orm/member/thunks';
import {$BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';
import MoaHeader from '../../../components/band/MoaHeader';
import Avatar from '../../../components/Avatar';
import Page403 from '../../../components/errors/Page403';
import cn from 'classnames';
import has from 'lodash/has';
import {fetchBandThunk} from '../../../src/reducers/orm/band/thunks';
import BandApi from '../../../src/apis/BandApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

const MemberWrapDiv = styled.div`
  width: 900px;
  margin: auto;
  padding: 45px 112.5px 0;
  /* padding: 45px 0 38px; */
  position: relative;
`;

const MemberTitle = styled.h2`
  padding-bottom: 40px;
  ${fontStyleMixin({
    size: 18,
    weight: '300'
  })}

  span {
    ${fontStyleMixin({
      color: $POINT_BLUE,
      family: 'Montserrat'
    })}
    padding-left: 3px;
    text-decoration: underline;
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  padding: 0;
  min-height: 500px;
`;

const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  right: -2px;
  top: 37px;
  width: 150px;
  height: 42px;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid ${$BORDER_COLOR};
  appearance: none;
  font-size: 14px;
  outline: none;

  &::-ms-expand {
    display: none;
  }
`;

const Li = styled.li`
  float: left;
  width: 215px;
  height: 135px;
  margin: 0 10px 9px 0;
  box-sizing: border-box;
  padding: 17px 13px 30px;
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};
  
  &.access {
    cursor: pointer;
    
    &.access:hover {
      background-color: #f9f9f9;
      mix-blend-mode: multiply;
    }
  }
  
  &:nth-child(4n) {
    margin-right: 0;
  }
`;

const NameH3 = styled.h3`
  padding-top: 6px;
  ${fontStyleMixin({
    size: 13,
    weight: '600'
  })}
`;

const ArrowSpan = styled.span`
  position: absolute;
  width: 5px;
  right: 10px;
  top: 18px;
  display: block;

  img {
    width: 100%;
  }
`;

const DateP = styled.p`
  padding-top: 4px;
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })}
`;

const NoContentLi = styled.li`
  border-top: 1px solid ${$BORDER_COLOR};
  text-align: center;
  padding: 90px 0 226px;
  ${fontStyleMixin({
    size: 16,
    color: $TEXT_GRAY
  })}

  img {
    display: block;
    padding-bottom: 9px;
    margin: auto;
    width: 64px;
  }
`;

interface Props extends RouteComponentProps {
}

const BandMemberItem = React.memo<any>(({
  user,
  created_at,
  user_expose_type,
  isVisible
}) => {
  const {
    avatar,
  } = user;
  const [, identifier] = nameByExposeType(user_expose_type, {user});
  return (
    <div>
      <Avatar
        hideUserName
        size={50}
        src={avatar}
        userExposeType={user_expose_type}
      />
      <NameH3>{identifier}</NameH3>
      <DateP>
        가입신청일 {moment(created_at).format('YYYY. MM. DD')}
      </DateP>
      {isVisible && (
        <ArrowSpan>
          <img
            src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
            alt={`${identifier} 바로가기`}
          />
        </ArrowSpan>
      )}
    </div>
  );
});

const MemberListPC: React.FC<Props> = React.memo(({}) => {
  // State
  const [myId, setMyId] = React.useState();
  
  // Router
  const router = useRouter();
  const {query: {slug}} = router;

  // Dispatch
  const dispatch = useDispatch();
  
  // API
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {
    orderBy,
    setOrderBy,
    ORDER_BY,
    members,
    withdrawMember,
    rest,
    band
  } = useBandMember(slug);
  
  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
    
    bandApi.me(slug).then(({data: {result}}) => !!has(result, 'id') && setMyId(result.id));
  }, [slug]);

  if (band === undefined) {
    return null;
  }

  const {
    avatar,
    user_expose_type,
    name,
    band_member_grade,
  } = band;

  return (
    user_expose_type === 'real' && !ADMIN_PERMISSION_GRADE.includes(band_member_grade) ? (
      <Page403/>
    ) : (
      <WaypointHeader
        headerComp={
          <MoaHeader
            title="회원 리스트"
            avatar={avatar}
            linkProps={{href: '/band/[slug]', as: `/band/${slug}`}}
          >
            {name} 커뮤니티
          </MoaHeader>
        }
      >
        <MemberWrapDiv>
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
                  next: rest.next
                }));
              }}
              threshold="-250px"
            >
              <MemberTitle>
                총 회원수&nbsp;
                <span>{rest.count}</span>
              </MemberTitle>
              <StyledSelectBox
                value={orderBy}
                option={ORDER_BY}
                onChange={value => {
                  if (value !== orderBy) {
                    setOrderBy(value);
                    router.replace(`/band/${slug}/member/?order_by=${value}`);
                  }
                }}
              />
              <ul className="clearfix">
                {members.map(data => {
                  const {answer, id, self_introduce} = data;

                  const isMine = id === myId;

                  // 유저의 질문 답변 값과 자기소개 값이 존재할 경우 또는 본인의 ID와 일치할 경우 팝업 TRUE
                  const visible = (!isEmpty((answer || {}).answers) && !!self_introduce) || isMine;

                  return (
                    <Li
                      className={cn(visible && 'access')}
                      key={data.id}
                      onClick={() => visible && dispatch(pushPopup(
                        MoaMemberPopup,
                        {
                          data,
                          user_expose_type,
                          isMemberList: true,
                          isMine,
                          withdrawMember: (memberId: HashId) => {
                            withdrawMember(memberId);
                          }
                        }
                      ))}
                    >
                      <BandMemberItem
                        isVisible={visible}
                        user_expose_type={user_expose_type}
                        {...data}
                      />
                    </Li>
                  )
                })}
              </ul>
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
        </MemberWrapDiv>
      </WaypointHeader>
    )
  );
});

export default loginRequired(MemberListPC);
