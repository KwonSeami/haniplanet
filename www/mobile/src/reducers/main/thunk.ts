import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import ExploreApi from '../../apis/ExploreApi';
import {saveMain, updateMain, ICuratingContent, TUpdateMainKey, clearMain} from './';
import CuratingApi from '../../apis/CuratingApi';
import {toDateFormat} from '../../lib/date';
import {LocalCache} from 'browser-cache-storage';

const filterNewsType = (data: Dig<ICuratingContent, 'children'>) => {
  const dailyNews = [];
  const weeklyNews = [];

  data.forEach(({text, og_link}) => {
    text === '오늘 뉴스' && dailyNews.push(og_link);
    text === '주간 뉴스' && weeklyNews.push(og_link);
  });

  return {
    dailyNews,
    weeklyNews
  };
};

const mapDataToStories = (data) => {
  const stories = data.map(({og_link, user, avatar}) => {
    const ogLink = og_link || {};
    const userInfo = user || {};

    return {
      ...ogLink,
      image: avatar || ogLink.image,
      user: userInfo
    };
  });

  return stories;
};

const curateHospitalStory = (contents) => {
  let children = [];
  let curatingPk = '';
  const tags = {};

  contents.forEach(({id, children: _children, tag: {
    id: tagId,
    ...rest
  }}) => {
    tags[id] = {
      id,
      tagId,
      ...rest
    };

    if (!isEmpty(_children)) {
      children = _children;
      curatingPk = id;
    }
  });

  const stories = mapDataToStories(children);

  return {
    curatingPk,
    tags,
    stories
  };
};

const curatePlanetNews = (contents) => {
  let curatingPk = '';
  let children = [];
  const newspaper = {};

  contents.forEach(({id, avatar, children: _children, og_domain: {
    id: ogDomainId,
    ...rest
  }}) => {
    newspaper[id] = {
      id,
      ogDomainId,
      ...rest,
      avatar
    };
    
    if (!isEmpty(_children)) {
      children = _children;
      curatingPk = id;
    }
  });

  const {
    dailyNews,
    weeklyNews
  } = filterNewsType(children);

  return {
    curatingPk,
    newspaper,
    dailyNews,
    weeklyNews
  };
};

const curatePlanetPick = (contents) => {
  const filteredContents = contents.map(({
    avatar,
    text,
    story
  }) => ({
    avatar,
    text,
    story
  }));

  return filteredContents;
};

export const fetchMainThunk = (userPk: HashId) =>
  (dispatch, getState) => {
    const {main, system: {session: {access}}} = getState();
    const exploreApi = new ExploreApi(access);

    const {
      currUserPk,
      ...rest
    } = main;

    const isMainEmpty = Object.values(rest).every(isEmpty);
    const isUserChanged = userPk !== currUserPk;

    if (isMainEmpty || isUserChanged) {
      if (isUserChanged) {
        dispatch(clearMain());
      }

      exploreApi.pageMain()
        .then(({status, data: {result}}) => {
          if (status === 200) {
            const {
              notices,
              curating,
              search_ranks,
              banners
            } = result;

            const curatingData = {
              hospitalStory: {},
              planetNews: {},
              planetPick: []
            };

            (curating || []).forEach(({name, contents}) => {
              switch(name) {
                case '한의원 Story': {
                  const hospitalStory = curateHospitalStory(contents);
                  curatingData.hospitalStory = hospitalStory;
                  break;
                }
                case '플래닛 뉴스': {
                  const planetNews = curatePlanetNews(contents);
                  curatingData.planetNews = planetNews;
                  break;
                }
                case '플래닛 PICK': {
                  const planetPick = curatePlanetPick(contents);
                  curatingData.planetPick = planetPick;
                  break;
                }
                default:
                  break;
              }
            });

            dispatch(saveMain({
              currUserPk: userPk,
              notices,
              searchRanks: search_ranks,
              banners,
              ...curatingData 
            }));
          }
        });
    }
  };

const filterCuratingData = (key: TUpdateMainKey, curatingPk: number, data: any) => {
  if (key === 'planetNews') {
    const {
      dailyNews,
      weeklyNews
    } = filterNewsType(data);

    return {
      curatingPk,
      dailyNews,
      weeklyNews
    };
  } else if (key === 'hospitalStory') {
    const stories = mapDataToStories(data);

    return {
      curatingPk,
      stories
    };
  }

  return {};
};

export const curatingCacheKey = (key: TUpdateMainKey, curatingPk: number) => `${key}-${curatingPk}`;

export const patchCuratingThunk = (key: TUpdateMainKey, curatingPk: number, callback?: () => void) =>
  (dispatch, getState) => {
    const {main, system: {session: {access}}} = getState();
    const currData = main[key];

    if (has(currData, 'curatingPk') && currData.curatingPk !== curatingPk) {
      const uniqueId = toDateFormat(new Date(), 'hh:mm');
      const cacheKey = curatingCacheKey(key, curatingPk);
      const cached = LocalCache.get(uniqueId, cacheKey);

      if (!cached) {  
        const curatingApi = new CuratingApi(access);

        curatingApi.children(curatingPk)
          .then(({status, data: {results}}) => {
            if (status === 200) {
              const data = filterCuratingData(key, curatingPk, results);

              dispatch(updateMain({
                key,
                data
              }));

              LocalCache.set(uniqueId, cacheKey, results);
              callback && callback();
            }
          });
      } else {
        const data = filterCuratingData(key, curatingPk, cached);

        dispatch(updateMain({
          key,
          data
        }));
        callback && callback();
      }
    }
  };
