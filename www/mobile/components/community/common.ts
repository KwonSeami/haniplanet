import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';

export const USER_TYPE_COLOR = {
  doctor: '#3db871',
  student: '#7965c4',
  default: $POINT_BLUE
};

export const USER_TYPE_COLOR2 = {
  doctor: '#b3e1c3',
  student: '#d7d2ed'
}

export const DEFAULT_TYPE_GRADIENT = 'linear-gradient(107deg, #69cdf6, #7aabf8)';

export const USER_TYPE_GRADIENT = {
  doctor: 'linear-gradient(287deg, #55daba, #78d899)',
  student: 'linear-gradient(102deg, #c5b7ff -18%, #9e98e8 100%)'
};

export const MaxWidthWrapper = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
`;

export const TitleHeader = styled.header`
  position: relative;
  padding: 12px 15px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};

  h2, h3 {
    display: inline-block;
    ${fontStyleMixin({
      size: 16,
      weight: '600',
      color: $FONT_COLOR
    })};

    em {
      color: ${$POINT_BLUE};
      font-style: normal;
    }

    span {
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 4px;
      ${fontStyleMixin({
        size: 10,
        color: $TEXT_GRAY
      })}
    }
  }

  p {
    display: inline-block;
    ${fontStyleMixin({
      size: 16,
      weight: '600',
      color: $TEXT_GRAY
    })};
  }

  h2 ~ p, p ~ h2 {
    &::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 8px;
      margin: -3px 8px 0;
      border-left: 1px solid ${$BORDER_COLOR};
    }
  }

  nav {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $FONT_COLOR
      })}

      &.active {
        color: ${$POINT_BLUE};
      }

      & ~ li {
        margin-left: 17px;

        &::before {
          position: absolute;
          left: -8px;
          top: 50%;
          width: 1px;
          height: 8px;
          transform: translateY(-50%);
          background-color: ${$BORDER_COLOR};
          content: '';
        }
      }
    }

    small {
      vertical-align: middle;
      line-height: 17px;
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY
      })}
    }
  }

  .page {
    ${fontStyleMixin({
      size: 12,
      color: $FONT_COLOR
    })}

    & > span {
      float: left;

      & ~ span {
        margin-left: 10px;
      }
    }  

    img {
      max-height: 27px;
      cursor: pointer;

      & ~ img {
        margin-left: 4px;
      }
    }
  }
`;

export const CommunitySection = styled.section`
  margin: 24px auto 0;
  background-color: ${$WHITE};

  @media screen and (max-width: 680px) {
    margin: 0;
    border-top: 10px solid #f2f5f7;
  }
`;

export const WriteBtn = styled.button`
  position: fixed;
  bottom: 20px;
  right: 14px;
  width: 110px;
  height: 42px;
  padding: 0 5px 2px 0;
  ${fontStyleMixin({
    size: 16,
    weight: 'bold'
  })};
  border-radius: 21px;
  border: 1px solid ${$FONT_COLOR};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  background-color: ${$WHITE};
  box-sizing: border-box;
  z-index: 10;

  img {
    vertical-align: middle;
    width: 23px;
    margin-top: -3px;
  }
`;

export const CommunityGuideLink = styled.div`
  width: 100%;
  height: 34px;
  background-color: #eaedf4;

  > div {
    height: 100%;

    a {
      display: block;

      img {
        vertical-align: middle;
        width: 5px;
        margin: -2px 0 0 5px;
      }
    }
  }

  p {
    display: inline-block;
    padding-left: 15px;
    line-height: 32px;
    font-size: 11px;
  }

  button {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    font-size: 0;

    img {
      width: 17px;
    }
  }

  @media screen and (min-width: 680px) {
    p {
      padding: 0;
    }
    
    button {
      right: 0;
    }
  }
`;