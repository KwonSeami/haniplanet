import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import moment from 'moment';
import {LocalCache} from 'browser-cache-storage';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY} from '../styles/variables.types';
import {fontStyleMixin} from '../styles/mixins.styles';
import {BASE_URL, staticUrl} from '../src/constants/env';
import {timeSince} from '../src/lib/date';
import {ShowDetailContentByBodyType} from '../components/story/common2';
import {axiosInstance} from '@hanii/planet-apis';
import {IStory} from "../src/@types/story";
import SearchInput from '../components/UI/SearchInput';
import {useRouter} from 'next/router';
import {RootState} from '../src/reducers';
import Loading from '../components/common/Loading';
import isEmpty from 'lodash/isEmpty';
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll';
import {DAY} from '../src/constants/times';
import {clearLayout, setLayout} from '../src/reducers/system/style/styleReducer';
import SearchNoContentText from '../components/search/SearchNoContent';
import Button from '../components/inputs/Button';
import Page401 from '../components/errors/Page401';

const Section = styled.section`
  width: 100%;

  .guide-top {
    padding: 10px 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    p {
      margin-top: 12px;
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY
      })};

      span {
        ${fontStyleMixin({
          size: 13,
        })};
      }
    }
  }
  
  .no-content {
    padding-bottom: 100px;

    .button {
      margin-top: 20px;

      img {
        width: 13px;
        margin-top: -3px;
        vertical-align: middle;
        transform: rotate(180deg);
      }
    }
  }

  .guide-feed ul {
    padding-bottom: 100px;

    .guide-item {
      width: 100%;
      padding: 13px 15px;
      box-sizing: border-box;
      border-bottom: 1px solid ${$BORDER_COLOR};
      cursor: pointer;
  
      > h2 {
        font-size: 15px;
        letter-spacing: -1.5px;
  
        & > img {
          width: 18px;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 0 0 4px;
        }
      }
  
      > p {
        position: relative;
        padding-top: 5px;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })}
  
        img {
          position: absolute;
          right: 1px;
          top: 6px;
          width: 12px;
          transform: rotate(90deg);
        }
      }
  
      &.toggle {
        > h2 {
          font-weight: 600;
          text-decoration: underline;
        }
  
        > p img {
          transform: rotate(-90deg);
        }
      }
    }
  
    .guide-content {
      background-color: #f9f9f9;
      border-bottom: 1px solid ${$BORDER_COLOR};
  
      h1, h2, h3, h4 {
        padding: 0 15px;
      }
  
      p {
        padding: 10px 15px;
        line-height: 1.8;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY
        })};
      }
  
      .ak-renderer-document img {
        width: 100%;
        padding-bottom: 10px;
      }
    }
  }
`;

const GuideSearchInput = styled(SearchInput)`
  top: 0;
  display: inline-block;
  width: 100%;
  height: 40px;
  padding: 0 0 0 15px;
  background-color: #f8f8f8;
  border-radius: 20px;
  box-sizing: border-box;

  input[type="text"] {
    height: 100%;
    padding: 0;
    border-bottom: 0;
  }

  input::placeholder {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $TEXT_GRAY,
    })};
  }

  > img {
    top: 6px;
    right: 8px;
    padding-bottom: 0;
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
            const result = {body, body_type};

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
  }, [toggle, id, fetchData]);

  return (
    <li id={id}>
      <div
        className={cn('guide-item', {toggle})}
        onClick={() => setToggle(curr => !curr)}
      >
        <h2>
          {title}
          {(since < 7 * DAY) && (
            <img
              src={staticUrl("/static/images/icon/icon-new.png")}
              alt="NEW"
            />
          )}
        </h2>
        <p>
          {timeSince(created_at)}
          <img
            className={cn({toggle})}
            src={staticUrl('/static/images/icon/arrow/icon-shortcut.png')}
            alt="더보기"
          />
        </p>
      </div>
      {(toggle && body && body_type) && (
        <div className="guide-content">
          <ShowDetailContentByBodyType
            data={body}
            bodyType={body_type}
          />
        </div>
      )}
    </li>
  );
});

const GuideMobileList = React.memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {query, pathname, asPath} = router;
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

    const params = {q: trimmedKeyword};
    router.push({pathname, query: params});
  }, [pathname]);

  const fetchData = React.useCallback((next?: string) => {
    const params = q ? {params: {q}} : {};

    axiosInstance({token: access, baseURL: BASE_URL})
      .get(next || `${BASE_URL}/notice/`, params)
      .then(({status, data: {results, next: _next, count}}) => {
        if (status === 200 && !!results) {
          setNoticeData(curr => ({
            data: [...(next ? curr.data : []), ...results],
            next: _next,
            count
          }));
          setPending(false);
        }
      });
  }, [q, access]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    dispatch(setLayout({
      headerDetail: '공지사항',
      isHeaderTitle: true,
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  return (
    <Section>
      <div className="guide-top">
        <GuideSearchInput
          placeholder="키워드 검색"
          value={keyword}
          onChange={onChangeKeyword}
          onSearch={onSearchKeyword}
        />
        <p>
          <span>전체 {count}건의 글</span>이 있습니다.
        </p>
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
          <InfiniteScroll
            className="guide-feed"
            loader={<Loading/>}
            hasMore={next}
            loadMore={() => fetchData(next)}
            threshold="-150px"
          >
            <ul>
              {data.map(story => (
                <GuideItem
                  key={story.id}
                  isFocused={story.id === hashId}
                  {...story}
                />
              ))}
            </ul>
          </InfiniteScroll>
        )
      )}
    </Section>
  );
});

GuideMobileList.displayName = 'GuideMobileList';
export default GuideMobileList;
