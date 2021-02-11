import * as React from 'react';
import WaypointHeader from '../../../components/layout/header/WaypointHeader';
import OGMetaHead from '../../../components/OGMetaHead';
import Avatar from '../../../components/AvatarDynamic';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR} from '../../../styles/variables.types';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../../src/constants/env';
import AdditionalContent from '../../../components/layout/AdditionalContent';
import SearchRank from '../../../components/layout/AdditionalContent/SearchRank';
import SelectBox from '../../../components/inputs/SelectBox/SelectBoxDynamic';
import SortOrderMenu from "../../../components/UI/SortOrderMenu";
import Pagination from '../../../components/UI/Pagination';
import {useRouter} from 'next/router';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import Loading from '../../../components/common/Loading';
import Page500 from '../../../components/errors/Page500';
import {DOCTALK_SUBJECTS as _DOCTALK_SUBJECTS} from '../../../src/constants/hospital';
import UserFaqItem from '../../../components/user/faq/UserFaqItem';
import useProfile from '../../../src/hooks/user/useProfile';
import NoContent from '../../../components/NoContent/NoContent';
import UserApi from '../../../src/apis/UserApi';
import Page401 from '../../../components/errors/Page401';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import ManagementBtn from '../../../components/faq/Button/ManagementBtn';

const FaqBannerDiv = styled.div<{BannerImg: string}>`
  width: 100%;
  padding: 195px 0 74px;
  text-align: center;
  line-height: 82px;

  background-blend-mode: multiply;
  ${({BannerImg}) => backgroundImgMixin({
    img: BannerImg,
    color: 'rgba(0, 0, 0, 0.7)'
  })};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 435px;
      background-color: #000;
      opacity: 0.7;
    }
  }

  p {
    display: inline-block;
    margin-left: 21px;
    ${fontStyleMixin({
      size: 30,
      color: $WHITE
    })}
  }

  .avatar, p {
    position: relative;
    z-index: 10;
  }
`;

const FaqWrapperDiv = styled.div`
  width: 1035px;
  margin:30px auto 100px;

  &::before,
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  nav {
    margin-bottom: 10px;
    &::after,
    &::before {
      display: table;
      clear: both;
      content: '';
    }

    article {
      float: left;

      & ~ article {
        float: right;
      }

      .select-box {
        padding-right: 15px;
        border-bottom: 0;
        p {
          height: 40px;
          line-height: 38px;
        }

        ul {
          width: 180px;
          border-top: 1px solid ${$BORDER_COLOR};
        }
      }

      .sort-order-menu {
        line-height: 40px;
      }
    }
  }

  .content {
    & > ul {
      margin-bottom: 50px;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
  }
`;

const StyleNoContent = styled(NoContent)`
  border-top: 1px solid ${$BORDER_COLOR};
`;

const LeftFeed = styled.div`
  float: left;
  width: 680px;
`;

const StyledManagementBtn = styled(ManagementBtn)`
  margin-bottom: 30px;
`;

const DOCTALK_SUBJECTS = [
  {label: '전체보기', value: ''},
  ..._DOCTALK_SUBJECTS
];

const SORT_OPTIONS = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
];

const UserFaq = () => {
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  const userApi = new UserApi();
  const [sort, setSort] = React.useState(SORT_OPTIONS[0].value);
  const router = useRouter();
  const {query} = router;
  const {
    id: userId, 
    page, 
    category,
  } = query;

  const myId = useSelector(
    ({system: {session: {id}}}: RootState) => id,
    shallowEqual 
  );

  const {user} = useProfile(userId);

  const [{
    pending, 
    errorCode, 
    count, 
    faqList,
    bannerImg
  }, setState] = React.useState({
    pending: true,
    errorCode: 0,
    count: 0,
    faqList: [],
    bannerImg: staticUrl('/static/images/banner/img-hospital-default.png'),
  });

  const setUrl = React.useCallback((query) => {
    const url = {
      pathname: `/user/${userId}/faq`,
      query
    };

    router.push(url, url, {shallow: true});
  }, [userId])

  React.useEffect(() => {
    if (userId) {
      doctalkApi.faqList({
        params: {
          page,
          category,
          user_id: userId,
          order_by: sort
        }
      }).then(({data: {results, count}, status}) => {
          if(Math.floor(status / 100) === 4) {
            setState(curr => ({
              ...curr,
              pending: false,
              errorCode: status
            }))
          } else {
            setState(curr => ({
              ...curr,
              pending: false,
              faqList: results,
              count
            }))
          }
        })
        .catch(() => {
          setState(curr => ({
            ...curr,
            pending: false,
            error: true
          }));
        })
  
      userApi.hospitalBanner(userId)
        .then(({data: {result: {image}}}) => {
          setState(curr => ({
            ...curr,
            bannerImg: image
          }))
        })
    }
  }, [page, category, userId, sort]);

  if(errorCode) {
    return errorCode === 401 ? <Page401/> : <Page500/>;
  }

  return (
    <>
      <WaypointHeader
        themetype="white"
        headerComp={
          <>
            <OGMetaHead
              title={user.name}
              image={bannerImg}
            />
            <FaqBannerDiv BannerImg={bannerImg}>
              {!isEmpty(user) && (
                <>
                  <Avatar
                    id={user.id}
                    userExposeType="real"
                    src={user.avatar}
                    size={82}
                  />
                  <p>
                    {user.name} 한의사의 FAQ
                  </p>
                </>
              )}
            </FaqBannerDiv>
          </>
        }
      >
        <FaqWrapperDiv>
          <LeftFeed>
            <nav>
              <article>
                <SelectBox
                  value={(DOCTALK_SUBJECTS.filter(({value}) => value === category)[0] || DOCTALK_SUBJECTS[0]).value}
                  option={DOCTALK_SUBJECTS}
                  onChange={category => {
                    setUrl({
                      ...query,
                      category
                    })
                  }}
                />
              </article>
              <article>
                <SortOrderMenu
                  orders={SORT_OPTIONS}
                  sort={sort}
                  setSort={sort => setSort(sort)}
                />
              </article>
            </nav>
            <div className="content">
              {pending ? (
                <Loading/>
              ) : isEmpty(faqList) 
                ? (
                  <StyleNoContent>작성된 FAQ가 없습니다.</StyleNoContent>
                  )
                : (
                  <>
                    <ul>
                      {faqList.map(({id, ...props}) => (
                        <UserFaqItem
                          key={id} 
                          id={id}
                          writerName={user.name}
                          {...props}
                        />
                      ))}
                    </ul>
                    <Pagination
                      currentPage={Number(page) || 1}
                      pageSize={10}                
                      totalCount={count}
                      onClick={page => {
                        setUrl({
                          ...query,
                          page
                        });
                      }}
                    />
                  </>
                )
              }
            </div>
          </LeftFeed>
          <AdditionalContent>
            {userId === myId && (
              <StyledManagementBtn/>
            )}
            <SearchRank/>
          </AdditionalContent>
        </FaqWrapperDiv>
      </WaypointHeader>
    </>
  );
}

UserFaq.displayName = 'UserFaq';
export default React.memo(UserFaq);