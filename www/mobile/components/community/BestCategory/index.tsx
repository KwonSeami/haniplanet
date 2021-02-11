import * as React from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import BestCategoryItem from './item';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {RootState} from '../../../src/reducers';
import isEmpty from 'lodash/isEmpty';
import {CommunitySection, TitleHeader} from '../common';
import NoContent from '../../NoContent/NoContent';

const Section = styled(CommunitySection)`
  i, em {
    font-style: normal;
  }

  header {
    padding-bottom: 8px;
    border-bottom: 0;

    i {
      display: inline-block;
      vertical-align: middle;
      height: 18px;
      margin: -3px 0 0 4px;
      padding: 0 6px;
      line-height: 15px;
      ${fontStyleMixin({
        size: 11,
        color: $FONT_COLOR
      })};
      border-radius: 9px;
      border: 1px solid ${$TEXT_GRAY};
      box-sizing: border-box;
    }
  }

  ul {
    padding: 0 15px 16px;

    @media screen and (max-width: 680px) {
      padding-bottom: 0;
    }
  }
`;

const BestCategory = () => {
  const {best_categories} = useSelector(
    ({community}: RootState) => community,
    shallowEqual
  );

  return (
    <Section>
      <TitleHeader>
        <h3>
          인기있는 카테고리
          <i>Best 5</i>
        </h3>
      </TitleHeader>
      <div>
        {isEmpty(best_categories) ? (
          <NoContent>카테고리가 없습니다.</NoContent>
        ) : (
          <ul>
            {best_categories.map(({
              id,
              name,
              story_count
            },index) => (
              <BestCategoryItem
                id={id}
                name={name}
                story_count={story_count}
                ranking={index+1}
              />
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

export default React.memo(BestCategory); 