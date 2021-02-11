import styled from 'styled-components';
import SelectBox from '../inputs/SelectBox';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR} from '../../styles/variables.types';

export const CountSelectWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 15px 0;

  .list-count {
    line-height: 17px;
    ${fontStyleMixin({
      size: 13,
      weight: 'bold',
    })};

    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: $POINT_BLUE,
      })};
    }
  }

  .select-wrapper {
    padding-top: 5px;
  }

  &.meetup-main {
    padding-top: 22px;

    .list-count {
      display: inline-block;
    }

    .select-wrapper {
      padding-top: 0;
      margin-top: 23px;
    }
  }

  @media screen and (max-width: 680px) {
    padding: 14px 15px 15px;

    &.meetup-main {
      padding: 22px 0 15px;

      .list-count {
        padding-left: 15px;
      }
    }
  }
`;

export const ListWrapper = styled.div`
  background-color: #f6f7f9;
  overflow: hidden;

  .pagination-feed {
    max-width: 680px;
    margin: 0 auto;
    overflow: hidden;
  }
`;

export const StyledSelectBox = styled(SelectBox)`
  display: inline-block;
  vertical-align: middle;
  width: 100px;
  text-align: left;

  & ~ div {
    margin-left: 15px;
  }
  
  > p {
    line-height: 42px;
  }

  ul {
    margin-top: 1px;
  }
`;

export const MeetupMainSelectBox = styled(SelectBox)`
  display: inline-block;
  vertical-align: middle;
  width: 50%;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &:last-of-type {
    border-left: 0;
  }

  p {
    text-align: center;

    img {
      position: static;
      margin-left: 10px;
      vertical-align: sub;
    }
  }

  ul {
    left: -1px;
    width: calc(100% + 2px);
    margin-top: 1px;
  }

  @media screen and (max-width: 680px) {
    border-left: 0;
    border-right: 0;

    &:first-of-type {
      border-right: 1px solid ${$BORDER_COLOR};
    }
  }
`;