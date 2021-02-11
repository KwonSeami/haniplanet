import * as React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import styled from 'styled-components';
import BestPostItem from './item';
import {MaxWidthWrapper, TitleHeader} from '../common';
import classNames from 'classnames';
import {periodRange, TPeriodPick} from '../../../src/lib/date';
import isEmpty from 'lodash/isEmpty';
import {communityUserTypeColor} from '../../../src/lib/community';
import NoContentText from '../../NoContent/NoContentText';
interface Props {
  userType?: string;
}

const Section = styled.section`
  overflow: hidden;

  header > div {
    nav {
      right: 0;
    }

    @media screen and (max-width: 680px) {
      position: initial;

      nav {
        right: 15px;
      }
    }
  }

  & > div {
    padding: 12px 0;
    background-color: #f2f3f7;

    &.no-content {
      padding: 87px 0;

      p {
        font-size: 13px;
      }
    }

    ul {
      overflow-x: auto;
      padding: 0 5px 0 10px;
      white-space: nowrap;
      text-align: center;

      @media screen and (max-width: 680px) {
        text-align: left;
      }
    }
  }
`;

const BestPost: React.FC<Props> = ({
  userType,
}) => {
  const [bestStandard, setBestStandard] = React.useState<TPeriodPick>('daily');
  
  // Redux
  const {me, community: {isMyUserType, ...community}} = useSelector(
    ({
      orm,
      system: {session: {id}},
      community
    }: RootState) => ({
      me: pickUserSelector(id)(orm),
      community
    }),
    shallowEqual
  );
  const {user_type} = me || {};

  return (
    <Section className="best-story-wrapper">
      <TitleHeader>
        <MaxWidthWrapper>
          <h2>
            인기 글
            <span>{periodRange(bestStandard)} 기준</span>
          </h2>
          <nav>
            <ul>
              <li 
                onClick={() => {
                  setBestStandard('daily')
                }}
                className={classNames({
                  active: bestStandard === 'daily',
                  [userType]: bestStandard === 'daily'})}
              >
                일간
              </li>
              <li
                onClick={() => {
                  setBestStandard('weekly')
                }}
                className={classNames({
                  active: bestStandard === 'weekly',
                  [userType]: bestStandard === 'weekly'})}
              >
                주간
              </li>
              <li
                onClick={() => {
                  setBestStandard('monthly')
                }}
                className={classNames({
                  active: bestStandard === 'monthly',
                  [userType]: bestStandard === 'monthly'})}
              >
                월간
              </li>
            </ul>
          </nav>
        </MaxWidthWrapper>
      </TitleHeader>
      {!isEmpty(community[`${bestStandard}_stories`]) ? (
        <div>
          <ul>
            {community[`${bestStandard}_stories`].map(({
              id, 
              menu_tag,
              ...props
            }, index) => {
              const {
                name: tagName
              } = menu_tag || {id: '', name: ''};

              return (
                <BestPostItem
                  key={id}
                  id={id}
                  ranking={index+1}
                  tagName={tagName}
                  color={communityUserTypeColor(user_type)}
                  userType={userType || ''}
                  {...props}
                />
              )
            })}
          </ul>
        </div>
      ) : (
        <NoContentText disabledImg>
          <p>등록 된 글이 없습니다.</p>
        </NoContentText>
      )}
    </Section>
  )
};

BestPost.displayName = 'BestPost';

export default React.memo(BestPost);