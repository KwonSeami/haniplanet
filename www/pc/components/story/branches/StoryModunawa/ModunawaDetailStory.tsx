import * as React from 'react';
import WaterMark from '../../../watermark';
import Tag from '../../../UI/tag/Tag';
import classNames from 'classnames';
import {staticUrl} from '../../../../src/constants/env';
import {TabUl} from '../../../UI/tab/TabUl';
import {numberWithCommas, under} from '../../../../src/lib/numbers';
import ModunawaMall from '../../../modunawa/subTab/ModunawaMall';
import ModunawaEvaluation from '../../../modunawa/subTab/ModunawaEvaluation';
import Tabs from '../../../UI/tab/Tabs';
import DefaultComment from '../../../comment/DefaultCommentArea';
import A from '../../../UI/A';

enum ModunawaTab {
  mall,
  evaluation,
  comment,
}

type TabState = 'mall' | 'evaluation' | 'comment';

const ModunawaDetailStory = React.memo<any>(({
  id,
  title,
  extension,
  totalAvg,
  tags,
  comment_count,
  evaluation_count,
  can_comment,
  url_card,
  // injected
  setToggle,
  waterMarkProps,
  isMall,
}) => {
  // Props
  const {
    rating_count,
    price_comparisons,
  } = extension || {};

  // State
  const [tab, setTab] = React.useState<TabState>(
    isMall 
      ? 'mall'
      : 'evaluation'
    );

  const currentTab = (can_comment && tab === 'comment')
    ? 'comment'
    : tab;

  return (
    <WaterMark {...waterMarkProps}>
      <article>
        <div className="story-top">
          <ul className="clearfix">
            <li>
              <p>{title}</p>
              <ul className="tag">
                {tags && tags.map(({id, name, is_follow}) => (
                  <li key={id}>
                    <Tag
                      id={id}
                      name={name}
                      highlighted={is_follow}
                      is_follow
                    />
                  </li>
                ))}
              </ul>
              <ul className={classNames('count', {off: rating_count === 0})}>
                <li>
                  <p>
                    참여
                    <span>{rating_count}명</span>
                  </p>
                </li>
                <li>
                  <p>총점
                    <span>{totalAvg}</span>
                  </p>
                </li>
              </ul>
            </li>
            {isMall && (
              <li>
                <div>
                  <A
                    to={price_comparisons[0].mall_url && (
                      typeof window !== 'undefined'
                        && window.encodeURI(price_comparisons[0].mall_url.url)
                    )}
                    newTab
                  >
                    <a>
                      <img
                        src={staticUrl('/static/images/icon/icon-story-homepage.png')}
                      />
                      <h3 className="ellipsis">{price_comparisons[0].mall_name}</h3>
                    </a>
                  </A>
                  <p>
                    <small>최저가</small><br/>
                    <span>{numberWithCommas(price_comparisons[0].price)}</span>원
                  </p>
                </div>
              </li>
            )}
          </ul>
          <button
            type="button"
            className="arrow-fold pointer"
            onClick={() => setToggle(false)}
          >
            <img
              src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
              alt="접기"
            />
          </button>
        </div>
        <div className="story-tab-wrapper">
          <TabUl className="pointer">
            {isMall && (
              <li
                className={classNames({on: tab === 'mall'})}
                onClick={() => setTab('mall')}
              >
                <img
                  src={staticUrl('/static/images/icon/icon-story-shop.png')}
                  alt="쇼핑몰"
                />
                <p>관련 쇼핑몰</p>
                <span>{price_comparisons.length}</span>
              </li>
            )}
            <li
              className={classNames({on: tab === 'evaluation',})}
              onClick={() => setTab('evaluation')}
            >
              <img
                src={staticUrl('/static/images/icon/icon-evaluation.png')}
                alt="평가하기"
              />
              <p>평가하기</p>
              <span>{under(evaluation_count)}</span>
            </li>
            <li
              className={classNames({
                on: tab === 'comment',
              })}
              onClick={() => setTab('comment')}
            >
              <img
                src={staticUrl('/static/images/icon/icon-story-reply.png')}
                alt="댓글"
              />
              <p>댓글</p>
              <span>{under(comment_count)}</span>
            </li>
          </TabUl>
          <div>
            <Tabs currentTab={ModunawaTab[currentTab] + 1}>
              <ModunawaMall
                id={id}
                price_comparisons={price_comparisons}
              />
              <ModunawaEvaluation
                id={id}
                url_card={url_card}
                extension={extension}
                totalAvg={totalAvg}
              />
              <DefaultComment
                targetPk={id}
                targetName="story"
                maxDepth={1}
                targetUserExposeType="anon"
              />
            </Tabs>
          </div>
        </div>
      </article>
    </WaterMark>
  );
});

export default React.memo(ModunawaDetailStory);