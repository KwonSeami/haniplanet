import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {ShowDetailContentByBodyType} from '../components/story/common2';
import {useSelector, shallowEqual} from 'react-redux';
import {axiosInstance} from '@hanii/planet-apis';
import {BASE_URL, staticUrl} from '../src/constants/env';
import {timeSince} from '../src/lib/date';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $TEXT_GRAY} from '../styles/variables.types';
import {IStory} from '../src/@types/story';
import {RootState} from '../src/reducers';
import HashReload from '../components/HashReload';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import Button from '../components/inputs/Button';
import SearchInput from '../components/UI/SearchInput';
import {DAY} from '../src/constants/times';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import Loading from '../components/common/Loading';
import moment from 'moment';
import {LocalCache} from 'browser-cache-storage';
import SearchNoContentText from '../components/search/SearchNoContent';
import Page401 from '../components/errors/Page401';

const Section = styled.section`
  .guide-banner {
    width: 100%;
    height: 198px;
    padding-top: 63px;
    box-sizing: border-box;
    ${backgroundImgMixin({
      img: staticUrl("/static/images/banner/banner-notice-guide.jpg")
    })};
  
    h2 {
      max-width: 900px;
      margin: auto;
      ${fontStyleMixin({
        size: 32,
        weight: 'bold',
      })};
  
      p {
        margin-top: 8px;
        letter-spacing: -0.7px;
        ${fontStyleMixin({
          size: 16,
          color: '#a4a8b0',
        })};
      }
    }
  }

  .guide-top {
    position: relative;
    width: 900px;
    margin: 40px auto 13px;
  
    p {
      display: inline-block;
      padding-top: 5px;
      ${fontStyleMixin({
        size: 15,
        color: $TEXT_GRAY
      })};
  
      span {
        color: ${$FONT_COLOR};
      }
    }
  
    .button {
      position: absolute;
      z-index: 1;
      top: -120px;
      right: 0;
      box-shadow: 0 2px 8px 0 rgba(177, 177, 177, 0.5);
  
      img {
        width: 27px;
        display: block;
        margin: 0 auto 3px;
      }
    }
  }

  .guide-list {
    position: relative;
    width: 900px;
    margin: 0 auto 100px;
    border-top: 1px solid ${$FONT_COLOR};
  
    > li {
      > h2 {
        position: relative;
        width: 100%;
        ${heightMixin(68)}
        padding: 0 160px 0 15px;
        box-sizing: border-box;
        font-size: 16px;
        letter-spacing: -1.5px;
        cursor: pointer;
        border-bottom: 1px solid ${$BORDER_COLOR};
    
        > p {
          display: inline-block;
          margin-right: 4px;
          ${fontStyleMixin({
            size: 15,
            color: $TEXT_GRAY
          })};
        }
    
        > img {
          width: 19px;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 0 0 4px;
        }
    
        span {
          display: block;
          position: absolute;
          right: 15px;
          top: 1px;
          ${fontStyleMixin({
            size: 12,
            color: $TEXT_GRAY
          })};
    
          img {
            width: 15px;
            display: inline-block;
            vertical-align: middle;
            margin: -2px 0 0 16px;
          }
        }
    
        &.toggle {
          font-weight: 600;
    
          span img {
            transform: rotate(180deg);
          }
        }
      }

      > div {
        padding: 22px 50px 0;
        border-bottom: 1px solid ${$BORDER_COLOR};

        p {
          font-size: 15px;
        }
  
        .ak-renderer-document img {
          width: 100%;
          padding-bottom: 20px;
        }
      }
    }
  }

  .no-content {
    width: 900px;
    margin: auto;
    border-bottom: 1px solid ${$BORDER_COLOR};
    margin-bottom: 300px;

    .button {
      margin-top: 35px;

      img {
        width: 13px;
        margin-top: -3px;
        vertical-align: middle;
        transform: rotate(180deg);
      }
    }
  }

  .guide-feed {
    padding-top: 0;
  }
`;

const GuideSearchInput = styled(SearchInput)`
  display: inline-block;
  width: 284px;
  height: 40px;
  padding-left: 15px;
  background-color: #f8f8f8;
  border-radius: 20px;
  border-bottom: 0;
  box-sizing: border-box;
  float: right;

  input::placeholder {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $TEXT_GRAY,
    })};
  }

  > img {
    right: 10px;
    opacity: 0.3;
  }
`;

interface IGuideItemProps extends IStory {
  isFocused: boolean;
}

const GuideItem = React.memo<IGuideItemProps>(({
  id,
  title,
  created_at,
  isFocused
}) => {
  const access = useSelector(
    ({system: {session: {access}}}: RootState) => access,
    shallowEqual
  );

  const now = new Date().getTime();
  const createdAt = new Date(created_at).getTime();
  const since = now - createdAt;

  const [toggle, setToggle] = React.useState(isFocused);
  const [bodyInfo, setBodyInfo] = React.useState({
    body: '',
    body_type: ''
  });

  const {
    body,
    body_type
  } = bodyInfo;

  const fetchData = React.useCallback((id: HashId) => {
    const uniqueId = moment(new Date()).format('hh:m');
    const key = `notice-${id}`;
    const cached = LocalCache.get(uniqueId, key);

    if (!cached) {
      axiosInstance({token: access, baseURL: BASE_URL})
        .get(`${BASE_URL}/notice/${id}/`)
        .then(({status, data: {body, body_type}}) => {
          if (status === 200) {
            const result = {
              body,
              body_type
            };

            setBodyInfo(result);
            LocalCache.set(uniqueId, key, result);
          }
        });
    } else {
      setBodyInfo(cached);
    }
  }, [access]);

  React.useEffect(() => {
    if (toggle) {
      fetchData(id);
    }
  }, [toggle, id]);

  return (
    <li id={id}>
      <h2
        onClick={() => setToggle(curr => !curr)}
        className={cn('ellipsis', {toggle})}
      >
        {/* <p>[말머리 들어갈 자리]</p> */}
        {title}
        {(since < 7 * DAY) && (
          <img
            src={staticUrl('/static/images/icon/icon-new.png')}
            alt="NEW"
          />
        )}
        <span>
          {timeSince(created_at)}
          <img
            src={staticUrl('/static/images/icon/arrow/icon-arrow-down.png')}
            alt="더보기"
          />
        </span>
      </h2>
      {(toggle && body && body_type) && (
        <div>
          <ShowDetailContentByBodyType
            data={body}
            bodyType={body_type}
          />
        </div>
      )}
    </li>
  );
});

const GuideList = () => {
  const router = useRouter();

  const {asPath, query, pathname} = router;
  const {q = ''} = query;
  const [, hashId] = asPath.split('#');

  const [keyword, setKeyword] = React.useState((q as string) || '');
  const [pending, setPending] = React.useState(true);
  const [noticeData, setNoticeData] = React.useState({
    data: [],
    count: 0,
    next: null
  });

  const {
    data,
    count,
    next
  } = noticeData;

  const access = useSelector(
    ({system: {session: {access}}}: RootState) => access,
    shallowEqual
  );

  if (!access) {
    return <Page401/>;
  }

  const onChangeKeyword = React.useCallback(({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(value);
  }, []);

  const onSearchKeyword = React.useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return router.push('/guide');
    }

    router.push({pathname, query: {q: trimmedKeyword}});
  }, []);

  const fetchData = React.useCallback((next?: string) => {
    axiosInstance({token: access, baseURL: BASE_URL})
      .get(next || `${BASE_URL}/notice/`, q ? {params: {q}} : {})
      .then(({status, data: {results, next: _next, count}}) => {
        if (status === 200 && !!results) {
          setNoticeData(curr => ({
            data: [...(next ? curr.data : []), ...results],
            next: _next,
            count,
          }));
          setPending(false);
        }
      });
  }, [access, q]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Section>
      <div className="guide-banner">
        <h2>
          공지사항
          <p>한의플래닛 공지사항, 이용가이드 내용입니다.</p>
        </h2>
      </div>
      <div className="clearfix guide-top">
        {/* (!!access && me.is_admin) && (
          <Button
            size={{
              width: '102px',
              height: '102px'
            }}
            border={{
              radius: '50%'
            }}
            font={{
              size: '15px',
              weight: 'bold',
              color: $GRAY
            }}
            backgroundColor={$WHITE}
            onClick={() => alert('에디터 작업 진행해야 함')}
          >
            <img
              src={staticUrl('/static/images/icon/icon-write.png')}
              alt="글쓰기"
            />
            글쓰기
          </Button>
        )*/}
        <p>
          <span>전체 {count}건의 글</span>이 있습니다.
        </p>
        <GuideSearchInput
          placeholder="키워드 검색"
          value={keyword}
          onChange={onChangeKeyword}
          onSearch={onSearchKeyword}
        />
      </div>
      {pending ? (
        <Loading/>
      ) : (
        isEmpty(data) ? (
          <SearchNoContentText>
            <Button
              size={{
                width: '150px',
                height: '40px'
              }}
              border={{
                radius: '0',
                width: '1px',
                color: $BORDER_COLOR
              }}
              font={{
                size: '14px',
                weight: '600',
                color: $GRAY
              }}
              backgroundColor="#f3f4f7"
              onClick={() => router.push('/guide')}
            >
              <img
                src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts2.png')}
                alt="화살표"
              />
              목록으로 가기
            </Button>
          </SearchNoContentText>
        ) : (
          <>
            <InfiniteScroll
              className="guide-feed"
              loader={<Loading/>}
              hasMore={next}
              loadMore={() => fetchData(next)}
              threshold="-200px"
            >
              <ul className="guide-list">
                {data.map(story => (
                  <GuideItem
                    key={story.id}
                    isFocused={story.id === hashId}
                    {...story}
                  />
                ))}
              </ul>
            </InfiniteScroll>
            <HashReload/>
          </>
        )
      )}
    </Section>
  );
};

GuideList.displayName = 'GuideList';
export default React.memo(GuideList);
