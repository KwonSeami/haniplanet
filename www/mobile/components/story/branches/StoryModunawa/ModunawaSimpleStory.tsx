import * as React from 'react';
import Tag from '../../../UI/tag/Tag';
import {staticUrl} from '../../../../src/constants/env';
import {under} from '../../../../src/lib/numbers';

const ModunawaSimpleStory = ({
  title,
  tags,
  totalAvg,
  comment_count,
  extension,
  isMall,
}) => {
  const {my_rate, rating_count, price_comparisons} = extension || {};

  return (
    <div className="story-list">
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
      <ul className="count">
        {isMall ? (
          <li>
            <img
              src={staticUrl('/static/images/icon/icon-story-shop.png')}
              alt="쇼핑몰"
            />
            <p>쇼핑몰</p>
            <span>{price_comparisons.length}</span>
          </li>
        ) : (
          <li>
            <img
              src={staticUrl('/static/images/icon/icon-story-reply2.png')}
              alt="댓글"
            />
            <p>댓글</p>
            <span>{under(comment_count, 99)}</span>
          </li>
        )}
        <li>
          <img
            src={staticUrl('/static/images/icon/icon-story-face.png')}
            alt="참여"
          />
          <p>참여</p>
          <span>{under(rating_count, 99)}</span>
        </li>
      </ul>
      <div>
        <p>총점</p>
        <span>{totalAvg}</span>
      </div>
      {my_rate && (
        <span className="completed">평가완료</span>
      )}
    </div>
  )
};

export default React.memo(ModunawaSimpleStory);