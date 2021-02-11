import styled from 'styled-components';
import SearchInput from './SearchInput';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE, $POINT_BLUE} from '../../../styles/variables.types';
import { heightMixin } from '../../../styles/mixins.styles';

interface ITagListProps {
  tagDeleteImg: string;
}

interface IButtonProps {
  isReset?: boolean;
}

interface IInputProps {
  bigWidth?: boolean;
}
  
export const TagListUl = styled.ul<ITagListProps>`
  li {
    text-align: left;
    padding: 1px 25px 4px 11px;
    border-radius: 14px;
    border: 1px solid ${$BORDER_COLOR};
    background-color: #f3f4f7;
    font-size: 13px;
    color: #666;
    background-size: 8px 9px;
    background-position: right 8px center;
    margin: 10px 10px 0 0;
    
    display: inline-block;
    vertical-align: middle;
    line-height: 1.5;
    ${({tagDeleteImg}) => backgroundImgMixin({
      img: tagDeleteImg,
      size: '10px',
      position: 'right 9px center'
    })};
  }
`;

export const AutoCompleteUl = styled.ul`
  position: absolute;
  top: 41px;
  left: -2px;
  z-index: 10;
  width: 100%;
  background-color: ${$WHITE};

  li {
    height: 40px;
    padding: 11px 10px 10px;
    box-sizing: border-box;

    h3 {
      color: ${$POINT_BLUE};
    }
    
    &.active,
    &:hover {
      background-color: #f9f9f9;
    }
  }

  &.open {
    border: 2px solid ${$POINT_BLUE};
    border-top: 0;
  }
`;

export const BtnGroupUl = styled.ul`
  padding: 17px 0 26px !important;
  text-align: center;
  
  li {
    display: inline-block;
    vertical-align: middle;
    padding: 0 5px;
  }
`;

export const BtnUl = styled.ul`
  li {
    display: inline-block;
    margin-right: 5px;
    vertical-align: middle;

    button {
      display: inline-block;
      ${heightMixin(25)};
      padding: 0 8px 0 9px;
      background-color: ${$WHITE};
      border-radius: 2px;
      border: 1px solid #b3c4ce;
      
      ${fontStyleMixin({
        size: 11, 
        color: '#b3c4ce'
      })};

      &.on {
        background-color: #195da3;
        border-color: #195da3 !important;
        color: ${$WHITE};
      }
    }
  }
`;


export const Button = styled.button<IButtonProps>`
  width: 150px;
  height: 35px;
  line-height: 35px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  
  background-color: ${({isReset}) => isReset ? '#b3c4ce' : $POINT_BLUE};
`;

export const DetailSearchInput = styled(SearchInput)`
  padding-right: 30px;
  height: 30px;
  line-height: 28px;
  border-radius: 2px;
  border: 1px solid ${$BORDER_COLOR};

  div {
    padding-right: 0 !important;
  }

  input {
    height: 28px !important;
    min-height: auto !important;
    border-radius: 0;
  }
  
  .input-clear {
    top: 0 !important;
    right: 0 !important;
  }
`;



export const Input = styled.input<IInputProps>`
  width: ${({bigWidth}) => bigWidth ? '80px' : '40px'};
  height: 30px;
  display: inline-block !important;
  vertical-align: middle;
  line-height: 30px;
  border: 1px solid ${$BORDER_COLOR} !important;
  border-radius: 2px;
  padding: 0 0 0 7px;
`;

export const RangeLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  
  padding-right: 5px;

  & > div {
    width: 250px;
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 5px;
    border-radius: 3px;
    background-color: #ddd;
    
    &.bar-0 {
      right: 230px;
    }

    &.bar-1 {
      background-color: #67aef6;
    }

    &.bar-2 {
      left: 230px;
    }
  }

  .handle {
    position: absolute;
    z-index: 1;
    left: 0;
    top: -7.5px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #67aef6;

    &.thumb-1 {
      z-index: 2;
      left: 230px;
    }
  }
`;

export const SearchDetailDiv = styled.div`
  margin-top: 20px;
  background-color: ${$WHITE};

  &.on {
    margin-top: 1px;
    max-height: 1000px;
    overflow: visible;
  }

  .detail-search-area {
    padding: 13px 20px 0;

    & > li {
      display: table;
      table-layout: fixed;
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      & > h3, 
      & > div {
        display: table-cell;
        line-height: 30px;
        vertical-align: middle;
      }

      h3 {
        width: 120px;
        padding:0 10px;
      }
    }
  }
`;


