import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setLayout} from '../../../src/reducers/system/style/styleReducer';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import Avatar from '../../../components/AvatarDynamic';
import SortOrderMenu from '../../../components/UI/SortOrderMenu';
import SelectBox from '../../../components/inputs/SelectBox/SelectBoxDynamic';
import {staticUrl} from '../../../src/constants/env';
import Pagination from '../../../components/UI/Pagination';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import { useRouter } from 'next/router';
import {DOCTALK_SUBJECTS as _DOCTALK_SUBJECTS} from '../../../src/constants/hospital';
import Loading from '../../../components/common/Loading';
import { toDateFormat } from '../../../src/lib/date';
import Link from 'next/link';
import moment from 'moment';
import useProfile from '../../../src/hooks/user/useProfile';
import UserApi from '../../../src/apis/UserApi';
import NoContent from '../../../components/NoContent/NoContent';
import isEmpty from 'lodash/isEmpty';

const WrapperDiv = styled.div`
  nav {
    padding:0 15px;
    border-bottom: 8px solid #f6f7f9;
    font-size: 0;

    article {
      display: inline-block;
      width: 50%;
      vertical-align: middle;
      & ~ article {
        text-align: right;
      }
    }

    .select-box {
      display: inline-block;
      width: auto;
      padding-right: 30px;
      border-bottom: 0;

      ul {
        margin-top: -3px;
        min-width: 180px;
        
        li:first-child {
          border-top: 1px solid ${$BORDER_COLOR};
        }
      }
    }
  }

  .content {
    li {
      padding: 20px 15px 20px 43px;
      border-bottom: 1px solid ${$BORDER_COLOR};

      p {
        position: relative;
        line-height: 24px;
        ${fontStyleMixin({
          size: 16,
          color: $FONT_COLOR
        })};

        em {
          font-weight: bold;
          font-style: normal;
        }

        &::before {
          position: absolute;
          top: 0;
          left: -28px;
          content: 'Q.';
          ${fontStyleMixin({
            size: 20,
            color: $FONT_COLOR,
            weight: 'bold',
            family: 'Montserrat'
          })};
        }
        &::after {
          display: inline-block;
          width: 6px;
          height: 13px;
          margin: -3px 0 0 4px;
          vertical-align: middle;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/arrow/icon-arrow-gray.png'),
            size: '100% auto'
          })};
          content: '';
        }
      }
      small {
        display: block;
        margin-top: 4px;
        line-height: 1.5;
        color: #90b0d7;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};

        .category {
          color: #90b0d7;
        }

        .kin-url {
          color: #6dc057;
        }

        .edited {
          display: inline-block;
          margin-left: 11px;
          padding: 0 7px;
          height: 18px;
          line-height: inherit;
          color: #bbb;
          background-color: #f9f9f9;
          border-radius: 9px;
        }
      }
    }
  }

  .pagination {
    margin: 4px 0;
  }
`

const BannerDiv = styled.div<{bannerImg?: string}>`
  position: relative;
  padding: 45px 0;
  background-blend-mode: multiply;
  text-align: center;
  ${({bannerImg}) => {
    return bannerImg 
      ? backgroundImgMixin({
          img: bannerImg,
          color: 'rgba(0, 0, 0, 0.7)'
        })
      : `background-color: rgba(0, 0, 0, 0.7)`;
  }};

  .avatar,
  h2 {
    display: inline-block;
    vertical-align: middle;
  }

  h2 {
    margin-left: 10px;
    ${fontStyleMixin({
      size: 22,
      color: $WHITE,
      weight: '100'
    })}
  }

  p {
    position: absolute; 
    right: 15px;
    top: 15px;
    line-height: 1.5;
    ${fontStyleMixin({
      size: 12,
      color: '#999'
    })};
  }
`;

const SORT_OPTIONS = [
  {value: '-created_at', label: '최신순'},
  {value: '-retrieve_count', label: '조회순'},
];

const DOCTALK_SUBJECTS = [
  {label: '전체보기', value: ''},
  ..._DOCTALK_SUBJECTS
];

const Faq = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  const userApi = new UserApi();
  const [sort, setSort] = React.useState(SORT_OPTIONS[0].value);
  const myId = useSelector(({
    system: {session: {id}}
  }) => id);

  const {query: {id: userId, ...query}} = router;
  const {
    page, 
    category,
  } = query;

  const {user} = useProfile(userId);
  const {name, avatar} = user;

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: 'FAQ'
    }))
  }, []);

  const [{
    pending, 
    error, 
    count, 
    faqList,
    bannerImg
  }, setState] = React.useState({
    pending: true,
    error: false,
    count: 0,
    faqList: [],
    bannerImg: ''
  });

  const setUrl = React.useCallback((query) => {
    const url = {
      pathname: `/user/${userId}/faq`,
      query,
    };

    router.push(url, url, {shallow: true});
  }, [userId])

  React.useEffect(() => {
    doctalkApi.faqList({
      params: {
        page,
        category,
        user_id: userId,
        order_by: sort
      }
    })
      .then(({data: {results, count}}) => {
        setState(curr => ({
          ...curr,
          pending: false,
          faqList: results,
          count
        }))
      })
      .catch(() => {
        setState(curr => ({
          ...curr,
          pending: false,
          error: true
        }));
      });

    userApi.hospitalBanner(userId)
      .then(({data: {result: {image}}}) => {
        setState(curr => ({
          ...curr,
          bannerImg: image
        }))
      })

  }, [page, category, userId, sort]);

  if(pending) {
    return <Loading/>
  }

  return (
    <WrapperDiv>
      {user && (
        <BannerDiv
          bannerImg={bannerImg}
        >
          {myId === userId && (
            <p>나의 FAQ관리는 PC에서만 가능합니다.</p>
          )}
          <Avatar
            id={userId}
            size={58}
            userExposeType="real"
            src={avatar}
          />
          <h2>{name} 한의사의 FAQ</h2>
        </BannerDiv>
      )}
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
        {isEmpty(faqList) ? (
          <NoContent>작성 된 FAQ가 없습니다.</NoContent>
        ) : (
          <ul>
            {faqList.map(({
              id,
              category,
              region,
              age_and_gender,
              disease,
              question_title, 
              created_at,
              updated_at,
              retrieve_count,
              kin_url
            }) => (
              <li key={id}>
                <p>
                  <Link
                    href="/faq/[id]"
                    as={`/faq/${id}`}
                  >
                    <a>
                      <em>{region} {age_and_gender} {disease}</em> - {question_title}
                    </a>
                  </Link>
                </p>
                <small>
                  {toDateFormat(created_at, 'YYYY.MM.DD')} · 
                  조회 {retrieve_count} ·&nbsp;
                  <span className="category">{category}</span>
                  {kin_url && (
                    <>
                      &nbsp;· <span className="kin-url">네이버 지식iN</span>
                    </>
                  )}
                  {moment(updated_at).diff(created_at, 'second') > 1 && (
                    <span className="edited">수정됨</span>
                  )}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      {!isEmpty(faqList) && (
        <Pagination
          currentPage={Number(page) || 1}
          totalCount={count}
          pageSize={10}
          onClick={page => {
            setUrl({
              ...query,
              page
            })
          }}
        />
      )}
    </WrapperDiv>
  );
};

Faq.displayName = 'Faq';
export default React.memo(Faq);