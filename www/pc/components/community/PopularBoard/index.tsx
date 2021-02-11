import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import Item from './Item';
import {MainBoardWrapper, MainBoardHeader} from '../common';

const Div = styled(MainBoardWrapper)`

  header {
    span {
      display: inline-block;
      vertical-align: middle;
      width: 45px;
      height: 18px;
      margin-left: 2px;
      text-align: center;
      line-height: 15px;
      ${fontStyleMixin({
        size: 11,
        weight: '600',
      })};
      border-radius: 9px;
      border: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      i {
        font-style: normal;
        font-family: 'Montserrat';
      }
    }
  }

  header + div {
    width: 323px;
    height: 172px;

    ul {
      padding: 10px 0;
    }
  }
`;

const PopularBoard = () => { 
  const best_categories = useSelector(
    ({community: {best_categories}}: RootState) => best_categories,
    shallowEqual
  );

  return (
    <Div>
      <MainBoardHeader>
        <h2>인기 게시판</h2>
        <span>
          Best
          <i> 5</i>
        </span>
      </MainBoardHeader>
      <div>
        <ul>
          {best_categories.map((props, idx) => (
            <Item
              key={props.id}
              idx={idx}
              {...props}
            />
          ))}
        </ul>
      </div>
    </Div>
  )
};

PopularBoard.displayName = 'PopularBoard';

export default React.memo(PopularBoard);
