import * as React from 'react';
import {FaqWrapperDiv, FaqHeader, FaqLayoutDiv} from '../../../components/faq/common';
import styled from 'styled-components';
import SelectBox from '../../../components/inputs/SelectBox/SelectBoxDynamic';
import Link from 'next/link';
import {heightMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import Pagination from '../../../components/UI/Pagination';
import DoctalkApi from '../../../src/apis/DoctalkApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import Page500 from '../../../components/errors/Page500';
import Loading from '../../../components/common/Loading';
import {useRouter} from 'next/router';
import FaqItem from '../../../components/user/faq/FaqItem';
import {DOCTALK_SUBJECTS as _DOCTALK_SUBJECTS} from '../../../src/constants/hospital';
import isEmpty from 'lodash/isEmpty';
import NoContent from '../../../components/NoContent/NoContent';
import {useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';

interface IFaqTableProps {
  widths: (number | string)[];
}

const FaqSection = styled.section`
  margin-top: 40px;

  nav {
    margin-bottom: 12px;
    article {
      float: left;

      & ~ article {
        float: right;
      }

      .select-box {
        min-width: 120px;
        padding-right: 30px;
        margin-top: -15px;
      }

      a {
        display: inline-block;
        min-width: 100px;
        padding: 0 15px;
        border: 1px solid ${$BORDER_COLOR};
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        ${heightMixin(35)};
        ${fontStyleMixin({
          size: 13,
          color: $FONT_COLOR
        })};

        & ~ a {
          margin-left: 10px;
        }
      }
    }
    &::after {
      display: table;
      clear: both;
      content: '';
    }
  }
`

const FaqTableDiv = styled.div<IFaqTableProps>`
  width: 100%;
  margin-bottom: 66px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  em {
    font-style: normal;
  }

  .table {
    display: table;
    table-layout: fixed;
    width: 100%;

    & > div {
      display: table-cell;
      text-align: left;
      vertical-align: middle;
      box-sizing: border-box;
    }
  }

  .head {
    display: table;
    table-layout: fixed;
    width: 100%;
    & > div {
      height: 40px;
      padding-left: 20px;
      line-height: 1.3;
      text-align: left;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 18,
        color: $GRAY,
        weight: '100'
      })}

      &.left {
        padding-left: 0;
      }
    }
  }
  .body {
    li {
      padding: 20px 0;
      border-top: 1px solid ${$BORDER_COLOR};

      .table > div {
        padding: 5px 20px;
        height: 65px;
        font-weight: '100';

        &.left {
          padding-left: 0;  
        }

        &.right {
          padding-right: 0;
          text-align: right;
        }

        & ~ div {
          border-left: 1px solid ${$BORDER_COLOR};
        }
      }
    }
  }

  .index {
    ${fontStyleMixin({
      size: 18,
      color: $GRAY,
      family: 'Montserrat'
    })}
  }

  .cate {
    ${fontStyleMixin({
      size: 15,
      color: $FONT_COLOR
    })}
  }

  .date {
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}
  }

  .title {
    ${fontStyleMixin({
      size: 16,
      color: $FONT_COLOR
    })}

    .kin-badge {
      margin-right: 6px;
    }

    em {
      font-weight: bold;
    }
  }

  .btns {
    font-size: 0;
  }

  .btn {
    display: inline-block;
    width: 66px;
    border: 1px solid ${$BORDER_COLOR};
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    ${heightMixin(40)};
    ${fontStyleMixin({
      size: 13,
      color: '#000'
    })};

    &--icon {
      width: 40px;
      background-color: #f9f9f9;

      img {
        vertical-align: middle;
      }
    }

    &--disabled {
      background-color: #f4f4f4;
      color: ${$TEXT_GRAY};
    }

    & ~ .btn {
      margin-left: 10px;
    }
  }

  ${({widths}) => {
    return widths && (
      widths.map((value, index) => {
        const width = typeof value === 'number' ? `${value}px` : value;
        return (
          `
          .head > div:nth-child(${index+1}) {
            width: ${width};
          }
          .body .table > div:nth-child(${index+1}) {
            width: ${width};
          }
          `
        )
      })
    )
  }}
`;

const StyleNoContent = styled(NoContent)`
  border-top: 1px solid ${$BORDER_COLOR};
`

const DOCTALK_SUBJECTS = [
  {label: '전체보기', value: ''},
  ..._DOCTALK_SUBJECTS
];

const PAGE_SIZE = 20;

const Faq = () => {
  const router = useRouter();
  const doctalkApi = useCallAccessFunc(access => new DoctalkApi(access));
  const [{
    pending, 
    error, 
    count, 
    faqList
  }, setState] = React.useState({
    pending: true,
    error: false,
    count: 0,
    faqList: []
  });
  const {query, pathname} = router;
  const {page: _page, category} = query;
  const page = Number(_page) || 1;
  const userId = useSelector(({
    system: {session: {id}}
  }: RootState) => id);

  const deleteFaq = (id: HashId) => {
    setState(curr => ({
      ...curr,
      count: count-1,
      faqList: faqList.filter(({id: _id}) => _id !== id)
    }))
  }

  React.useEffect(() => {
    if (userId) {
      doctalkApi.faqList({
        params: {
          page, 
          category,
          user_id: userId
        }
      })
        .then(({data: {results, count}}) => {
          setState(curr => ({
            ...curr,
            pending: false,
            faqList: results,
            count
          }));
        })
        .catch(() => {
          setState(curr => ({
            ...curr,
            pending: false,
            error: true
          }));
        })
    }
  }, [page, category, userId]);

  if (error) {
    return <Page500/>
  }

  return (
    <FaqWrapperDiv>
      <FaqHeader>
        <div>
          <h1>나의 FAQ 관리</h1>
          <p>*나의 FAQ관리는 PC에서만 가능합니다.</p>
          <p>*네이버 지식iN에서 연동된 글은 수정과 삭제가 불가능합니다.</p>
        </div>
      </FaqHeader>
      <FaqLayoutDiv>
        <FaqSection>
          <nav>
            <article>
              <SelectBox
                value={(DOCTALK_SUBJECTS.filter(({value}) => value === category)[0] || DOCTALK_SUBJECTS[0]).value}
                option={DOCTALK_SUBJECTS}
                onChange={value => {
                  router.push({
                    pathname,
                    query: {
                      ...query,
                      category: value
                    }
                  });
                }}
              />
            </article>
            <article>
              <Link
                href="/user/[id]/faq"
                as={`/user/${userId}/faq`}
              >
                FAQ 목록
              </Link>
              <Link
                href="/user/faq/new"
              >
                <a>
                  FAQ 등록
                </a>
              </Link>
            </article>
          </nav>
          {pending ? (
            <Loading/>
          ) : (
            <>
              <FaqTableDiv
                widths={[52, 176, 128, 'auto', 138]}
              >
                <div className="head table">
                  <div className="left">번호</div>
                  <div>분류</div>
                  <div>작성일</div>
                  <div>제목</div>
                </div>
                <div className="body">
                  {isEmpty(faqList) ? (
                    <StyleNoContent>
                      등록된 FAQ가 없습니다.
                    </StyleNoContent>
                  ) : (
                    <ul>
                      {faqList.map(({
                        id, 
                        ...rest
                      }, index) => (
                        <FaqItem
                          key={id}
                          id={id}
                          index={index+(page-1)*PAGE_SIZE}
                          onDelete={deleteFaq}
                          {...rest}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </FaqTableDiv>
              <Pagination
                currentPage={page}
                totalCount={count}
                pageSize={PAGE_SIZE}
                onClick={page => {
                  router.push({
                    pathname,
                    query: {
                      ...query,
                      page
                    }
                  })
                }}
              />
            </>
          )}
        </FaqSection>
      </FaqLayoutDiv>
    </FaqWrapperDiv>
  )
};

Faq.displayName = "UserFaq";
export default React.memo(Faq);