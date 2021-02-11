import * as React from 'react';
import styled from "styled-components";
import {$BORDER_COLOR} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';

const Div = styled.div`
  position: relative;
  display: inline-block;
  height: 40px;
  border: 1px solid ${$BORDER_COLOR || '#ddd'};
  box-sizing: border-box;
  font-size: 0;
  white-space: nowrap;
  
  button, 
  input[type=number] {
    display: inline-block;
    height: 100%;
    text-align: center;
    vertical-align: top;
  }

  button {
    position: relative;
    width: 40px;
    cursor: pointer;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 19px;
      transform: translate(-50%, -50%);
      
      &.up {
        padding-bottom: 1px;
        transform: translate(-50%, -50%) rotate(180deg);
      }
    }
  }
  input[type=number] {
    width: 55px;
    border: 1px solid ${$BORDER_COLOR || '#ddd'};
    border-top-width: 0;
    border-bottom-width: 0;
    ${fontStyleMixin({
      size: 14,
      family: 'Montserrat'
    })}
  }
`;

interface IProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const Counter = ({
  max = 100,
  min = 1,
  value,
  onChange
}:IProps) => {
  return (
    <Div className="counter">
      <button 
        type="button"
        onClick={() => {
          if(value > min) {
            onChange(value-1);
          }
        }}
      >
        <img 
          src={staticUrl('/static/images/icon/arrow/icon-select-more.png')}
          alt="감소"
        />
      </button>
      <input 
        type="number"
        max={max}
        min={min}
        value={value}
        onChange={({target: {value}}) => {
          const val = Number(value);
          if(val >= min && val <= max) {
            onChange(val);
          }
        }}
      />
      <button
        type="button"
        onClick={() => {
          if(value < max) {
            onChange(value+1);
          }
        }}
      >
        <img 
          src={staticUrl('/static/images/icon/arrow/icon-select-more.png')}
          className="up"
          alt="증가"
        />
      </button>
    </Div>
  );
};

export default Counter;
