import styled from 'styled-components';
import Input from '../inputs/Input';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import ResponsiveLi from '../UI/ResponsiveLi/ResponsiveLi';
import SelectBox from '../inputs/SelectBox';

export const Div = styled.div`
  width: 680px;
  margin: auto;
  padding: 38px 0 0;
  box-sizing: border-box;
  background-color: ${$WHITE};

  .DayPickerInput input {
    width: 130px;
    height: 44px;
    padding: 0 9px;
    font-size: 14px;
    vertical-align: middle;
    text-align: center;
    border-radius: 2px;
    border: 0;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;

export const Responsiveli = styled.li`
  position: relative;
  min-height: 55px;
  padding: 15px 0 30px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &:first-child {
    border-top: 1px solid ${$BORDER_COLOR};
  }

  > h3 {
    position: absolute;
    top: 17px;
    left: 0;
    ${fontStyleMixin({
      size: 19,
      weight: '300'
    })};
  }

  > div {
    width: 100%;
    padding-left: 150px;
    font-size: 14px;
    box-sizing: border-box;
    
    &.input-box {
      margin-top: -5px;
    }
  }

  .type-li {
    display: inline-block;
    vertical-align: middle;
    margin-top: 3px;
    padding-right: 34px;

    span {
      top: 2px;
    }
  }
`;

export const StyledInput = styled(Input)`
  box-sizing: border-box;
  display: inline-block !important;
  width: 130px;
  height: 44px;
  font-size: 14px;
  color: ${$FONT_COLOR};
  border-radius: 2px;
  
  &[type='text'], &[type='password'], &[type='email'], &[type='number'] {
    border: 0;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  &[type='number'] {
    text-align: center;
  }
`;

export const SeminarBanner = styled.div`
  height: 160px;
  text-align: center;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/banner/img-banner-bg.png'),
    size: 'cover'
  })};

  h2 {
    width: 680px;
    margin: 0 auto;
    padding-top: 60px;
    text-align: center;
    ${fontStyleMixin({
      size: 28,
      weight: '300'
    })};
  }
`;

export const StyledResponsiveLi = styled(ResponsiveLi)`
  ${Div} {
    padding-left: 0;
  }

  .certification li {
    margin-bottom: 0;
  }

  .phone {
    padding-bottom: 10px
  }
`;

export const StyledSelectBox = styled(SelectBox)`
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  text-align: left;

  & ~ div {
    margin-left: 25px;
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
  width: 83px;
  border-bottom: 0;
  text-align: left;

  & ~ div {
    margin-left: 10px;
  }

  ul {
    left: auto;
    right: 0;
    width: auto;
    white-space: nowrap;
    border-top: 1px solid ${$BORDER_COLOR};
  }
`;

export const StyeldListCount = styled.p`
  ${fontStyleMixin({
    size: 13,
    weight: 'bold',
    color: $FONT_COLOR
  })};

  span {
    ${fontStyleMixin({
      weight: 'bold',
      color: $POINT_BLUE
    })};
  }
`;

// @김유리: 수정 필요
export const NoContent = styled.p`
  text-align: center;
  padding: 68px 0 71px;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })}

  img {
    width: 25px;
    height: 21px;
    display: block;
    margin: 0 auto 8px;
  }
`;