import styled from 'styled-components';
import classNames from 'classnames';

type GaugeProps = {
  max: number;
  curr: number;
  height: number;
  width: number;
}

const Gauge = styled.div.attrs(({className, ...rest}) => ({
  className: classNames('gauge', [className]),
  ...rest,
}))<GaugeProps>`
  position: relative;

  &::before, 
  &::after {
    content: '';
    height: ${({height}) => height}px;
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    border-radius: 7px;
  }
  &::before {
    width: ${({width}) => width}%;
    background-color: #eaedf4;
  }

  &::after {
    width: ${({max, curr, width}) => (curr / max * 100) * (width / 100)}%;
    background-color: #499aff;
  }
`;


export default Gauge;
