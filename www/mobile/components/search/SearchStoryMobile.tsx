import * as React from 'react';
import Feed from '../Feed';
import {useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import StoryMobile from '../story/StoryMobile2';
import styled from 'styled-components';
import {InfiniteScrollDiv} from '../InfiniteScroll/InfiniteScroll';
import {BASE_URL} from '../../src/constants/env';

/* const DateSettingDiv = styled.div`
  ul {
    padding-top: 15px;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      font-size: 15px;
      letter-spacing: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      img {
        display: inline-block;
        vertical-align: middle;
        margin: -3px 3px 0 0;
        width: 14px;
      }

      &:first-child {
        margin-right: 18px;

        &::after {
          content: '';
          width: 10px;
          height: 1px;
          background-color: ${$BORDER_COLOR};
          position: absolute;
          right: -13px;
          top: 50%;
          margin-top: 1px;
        }
      }

      &:last-child {
        border: 0;
        margin: -1px 0 0 8px;
      }
    }
  }
`; */

const StyledFeed = styled(Feed)`
  max-width: 680px;
  margin: auto;
  margin-top: -1px;
  
  ${InfiniteScrollDiv} {
    padding: 0;

    article {
      padding-bottom: 35px;
    }
  }

  @media screen and (max-width: 680px) {
    margin: 0;

    ${InfiniteScrollDiv} {
      article {
        padding-bottom: 0;
      }
    }
  }
`;

interface Props {
  query: string;
}

const SearchStoryMobile: React.FC<Props> = React.memo(({query}) => {
  const {session: {access}} = useSelector(({system}: RootState) => system);

  return (
    <div>
      {/*
        TODO: 전체 글 : 기존 사용하던 캘린더 라이브러리가 추가되어야합니다
        <SearchSettingUl>
          <li>
            <h2>
              결과내 검색
            </h2>
            <ul>
              <li>
                <Link
                  className="on"
                  to=""
                >
                  전체 최신순
                  <span>{`30`}</span>
                </Link>
              </li>
              <li>
                <Link to="">
                  세미나/모임
                <span>{`20`}</span>
                </Link>
              </li>
              <li>
                <Link to="">
                  온라인 상담<span>{`1`}</span>
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <h2>
              기간 검색
            </h2>
            <ul>
              <li>
                <Link
                  className="on"
                  to=""
                >
                  일주일 이내
                </Link>
              </li>
              <li>
                <Link to="">
                  한 달 이내
                </Link>
              </li>
              <li>
                <Link to="">
                  기간설정
                </Link>
              </li>
            </ul>
            <DateSettingDiv>
              <ul>
                <li>
                  <img
                    src={staticUrl("/static/images/icon/icon-calendar.png")}
                    alt="날짜선택"
                  />
                  2019.07.08
                </li>
                <li>
                  <img
                    src={staticUrl("/static/images/icon/icon-calendar.png")}
                    alt="날짜선택"
                  />
                  2019.07.08
                </li>
                <li>
                  <Button
                    size={{
                      width: '65px',
                      height: '25px'
                    }}
                    font={{
                      size: '11px',
                      weight: 'bold'
                    }}
                    border={{
                      width: '1px',
                      color: $FONT_COLOR,
                      radius: '0'
                    }}
                  >
                    확인
                  </Button>
                </li>
              </ul>
            </DateSettingDiv>
          </li> 
        </SearchSettingUl>
      */}
      <StyledFeed
        fetchURI={`${BASE_URL}/search/story/?q=${query}`}
        access={access}
        component={StoryMobile}
        highlightKeyword={query}
      />
    </div>
  );
});

SearchStoryMobile.displayName = 'SearchStoryMobile';

export default SearchStoryMobile;
