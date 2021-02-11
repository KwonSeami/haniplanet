import * as React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GOODS_CATEGORY} from '../../src/gqls/shopping';
import {MenuLi, MenuUl, ACTIVE_AFTER_STYLE} from "../common/Menu";
import Loading from '../common/Loading';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR} from '../../styles/variables.types';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';

interface IProps {
  tagName?: string;
  onClick: (name?: string) => void;
}

const GoodsMenuSection = styled.section`  
  margin-bottom: 10px;

  h2, h3 {
    position: relative;
    padding: 15px 10px;
    line-height: 1;
    border-style: solid;
    ${fontStyleMixin({
      size: 14,
      color: $FONT_COLOR,
      weight: 'bold'
    })}

    small {
      float: right;
      ${fontStyleMixin({
        color: '#999',
        size: 13
      })};
    }

    span {
      position: relative;
      color: inherit;
      font-weight: inherit;

      &:hover::after {
        ${ACTIVE_AFTER_STYLE}
      }
    }

    &.on {
      span::after {
        ${ACTIVE_AFTER_STYLE}
      }
      small {
        ${fontStyleMixin({
          color: '#000',
          weight: 'bold'
        })};
      }
    }
  }

  h2 {
    border: 1px solid ${$FONT_COLOR};
    border-left-width: 0;
    border-right-width: 0;
  }

  h3 {
    border-width: 0;
    border-color: #999;
    border-bottom-width: 1px;
  }

  article ~ article h3 {
    border-top-width: 1px;
  }
`;

const GoodsMenuUl = styled(MenuUl)`
  margin: 0;
  padding: 6px 0;
  border: 0;
  ${MenuLi} {
    & > div {
      height: 30px;
      padding: 0 10px;
      border: 0;
      line-height: 30px;
      &:hover {
        span::after {
          ${ACTIVE_AFTER_STYLE}
        }
      }
    }
    small {
      float: right;
      ${fontStyleMixin({
        size: 13,
        color: '#999'
      })}
    }

    &.on {
      span {
        &::after {
          ${ACTIVE_AFTER_STYLE}
        }
      }
      span, small {
        ${fontStyleMixin({
          weight: 'bold',
          color: $FONT_COLOR
        })};
      }
    }
  }
`;

const GoodsCategory: React.FC<IProps> = ({
  tagName,
  onClick
}) => {
  const {
    data: {goods_categories, sobs_count} = {goods_categories, sobs_count}
  } = useQuery(GOODS_CATEGORY);
  const [pending, setPending] = React.useState(true);
  const [{category, count}, setCategory] = React.useState({
    category: [],
    count: 0,
  });

  React.useEffect(() => {
    if(!isEmpty(goods_categories)) {
      setCategory({
        category: goods_categories,
        count: sobs_count
      });
      setPending(false);
    }
  }, [goods_categories]);

  if(pending) return <Loading/>;

  return (
    <GoodsMenuSection>
      <h2
        className={cn('pointer', {
          on: !tagName
        })}
        onClick={() => onClick && onClick('')}
      >
        <span>전체보기</span>
        <small>{count}</small>
      </h2>
      {category.map(({
        id,
        tag: {name},
        children
      }) => {
        const groupCount = children.reduce((prevValue, {goods_count}) => prevValue + goods_count, 0);

        return (
          <article key={id}>
            <h3
              className={cn('pointer', {
                on: tagName === name
              })}
              onClick={() => onClick && onClick(name)}
            >
              <span>{name}</span>
              <small>{groupCount}</small>
            </h3>
            {!isEmpty(children) && (
              <GoodsMenuUl>
                {children.map(({
                  id: childId,
                  goods_count,
                  tag: {name: childName}
                }) => (
                  <MenuLi
                    key={childId}
                    on={tagName === childName}
                    className={cn({
                      on: tagName === childName
                    })}
                    onClick={() => onClick && onClick(childName)}
                  >
                    <div>
                      <span>{childName}</span>
                      <small>{goods_count}</small>
                    </div>
                  </MenuLi>
                ))}
              </GoodsMenuUl>
            )}
          </article>
        )
      })}
    </GoodsMenuSection>
  );
};

GoodsCategory.displayName = 'GoodsCategory';
export default React.memo(GoodsCategory);