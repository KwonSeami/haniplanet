import styled from 'styled-components';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {$GRAY, $BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $FONT_COLOR, $WHITE} from '../../styles/variables.types';
import {InfiniteScrollDiv} from '../InfiniteScroll/InfiniteScroll';
import {staticUrl} from '../../src/constants/env';
import SelectBox from '../inputs/SelectBox';
import {HospitalItem, IHospitalProps} from '../../components/hospital/HospitalItem';
import Meetup2, {IMeetup} from '../../components/meetup/Meetup2';
import {SearchDictItem, ISearchDictItemProps} from '../../components/search/SearchDictPC';
import {SearchUserItem, ISearchUserItem} from '../../components/search/SearchUser';
import Pagination from '../UI/Pagination';

export const BannerDiv = styled.div`
  position: relative;
  height: 280px;
  box-sizing: border-box;
  padding-top: 120px;

  h2 {
    padding: 50px 0 2px;
    text-align: center;
    line-height: normal;
    ${fontStyleMixin({
      size: 30,
      weight: '300'
    })}
  }

  p {
    text-align: center;
    ${fontStyleMixin({
      size: 14,
      weight: '300',
      color: $GRAY
    })}

    span {
      ${fontStyleMixin({
        weight: '500',
        color: $POINT_BLUE
      })}      
    }
  }

  a {
    display: block;
    position: absolute;
    left: 41px;
    top: 156px;
    ${fontStyleMixin({
      size: 15,
      color: $GRAY 
    })}
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
`;

export const TabUl = styled.ul`
  position: relative;
  z-index: 1;
  text-align: center;
  margin-top: -1px;
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 1px solid #eee;

  li {
    padding: 11px 0;
    width: 136px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    border-top: 1px solid transparent;

    a {
      ${fontStyleMixin({
        size: 15,
        weight: '300',
        color: $TEXT_GRAY
      })}
    }

    &.on {
      border-color: ${$POINT_BLUE};

      a {
        ${fontStyleMixin({
          color: $FONT_COLOR,
          weight: '600'
        })}
      }
    }
  } 
`;

interface ITabBanner {
  service: string;
}

export const TabBannerDiv = styled.div<ITabBanner>`
  min-height: 136px;
  padding: 20px 0;
  background-color: #f9f9f9;
  box-sizing: border-box;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/banner/img-banner-professor.png'),
  })};

  ${(props => (
    props.service 
      ? backgroundImgMixin({
          img: staticUrl(`/static/images/banner/img-banner-${props.service}.png`)
        })
      : ''
  ))}

  div {
    width: 1035px;
    margin: 0 auto;

    h4 {
      padding-bottom: 11px;
      ${fontStyleMixin({
        size: 17,
        color: $GRAY
      })};

      a {
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        ${heightMixin(24)}
        margin: -3px 0 0 6px;
        border-radius: 16.5px;
        border: 1px solid ${$POINT_BLUE};
        background-color: ${$WHITE};
        cursor: pointer;
        text-align: center;
        ${fontStyleMixin({
          size: 11,
          color: '#328dff'
        })};

        img {
          width: 9px;
          height: 9px;
          margin: 1px 0 0 2px;
        }
      }
    }

    p {
      line-height: 20px;
      ${fontStyleMixin({
        size: 12,
        weight: '300',
      })};
    }
  }
`;

export const FeedTitle = styled.h2`
  position: relative;
  padding-bottom: 23px;
  ${fontStyleMixin({
    size: 16,
    weight: 'bold'
  })};
`;

export const StyledSelectBox = styled(SelectBox)`
  position: absolute;
  width: 150px;
  right: 0;
  top: -9px;
  
  p {
    ${heightMixin(39)};
  }

  ul {
    margin-top: 1px;

    li {
      font-weight: normal;
      box-sizing: border-box;
    }
  }
`;

export const FeedContentDiv = styled.div`
  width: 1035px;
  margin: auto;
  padding: 30px 0 100px;

  .list-conut {
    display: inline-block;
    vertical-align: middle;
    margin: -4px 0 0 8px;
    ${fontStyleMixin({
      size: 12,
      weight: 'bold'
    })}

    span {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $POINT_BLUE
      })}
    }
  }

  .moa {
    border-bottom: 1px solid ${$BORDER_COLOR};

    > li {
      margin: 15px 5px 0;
      border: 0;
    }
  }

  .seminar {
    margin: 5px -5px 0;
  }
`;

export const LeftFeed = styled.div`
  float: left;
  width: 680px;
  box-sizing: border-box;

  ${InfiniteScrollDiv} {
    padding: 0
  }
`;

export const SearchMenuDiv = styled.div`
  padding: 12px 0 35px;
  border-top: 1px solid ${$BORDER_COLOR};

  h2 {
    padding-bottom: 15px;
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })}

    img {
      display: inline-block;
      vertical-align: middle;
      margin: -4px 3px 0 0;
      width: 22px;
    }
  }

  li {
    a {
      position: relative;
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding-left: 14px;
      ${heightMixin(44)}
      border: 1px solid transparent;
      border-bottom-color: ${$BORDER_COLOR};

      span {
        position: absolute;
        right: 16px;
        top: 0;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $TEXT_GRAY
        })}

        img {
          transform: rotate(90deg);
          width: 11px;
          padding-bottom: 3px;
        }
      }

      &:hover {
        color: ${$POINT_BLUE};
      }

      &.on {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};

        span {
          color: ${$FONT_COLOR};
        }
      }
    }

    ul {
      padding: 7px 0 10px 16px;
      border: 1px solid ${$BORDER_COLOR};
      border-top: 0;
      
      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        font-size: 15px;
        margin-right: 23px;
        letter-spacing: 0;
        border-bottom: 1px solid ${$BORDER_COLOR};

        img {
          display: inline-block;
          vertical-align: middle;
          margin: -3px 3px 0 0;
          width: 14px;
        }

        &:first-child::after {
          content: '';
          width: 10px;
          height: 1px;
          background-color: ${$BORDER_COLOR};
          position: absolute;
          right: -19px;
          top: 50%;
          margin-top: 1px;
        }

        &:last-child {
          border: 0;
          margin: 1px 0 0 3px;;
        }
      }
    }
  } 
`;

export const ShortcutBox = styled.div<{ImgBg: string}>`
  margin-bottom: 20px;

  > p {
    padding: 16px 15px 11px 15px;
    line-height: 16px;
    letter-spacing: -0.7px;
    background-color: #f9f9f9;
    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $GRAY
    })};
    box-sizing: border-box;

    span {
      ${fontStyleMixin({
        weight: '600',
        color: $POINT_BLUE
      })};
    }
  }

  a {
    display: block;
    width: 100%;
    height: 47px;
    padding: 13px 20px 15px;
    letter-spacing: -0.7px;
    border: 1px solid #eee;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 13,
      weight: '600',
    })};
    ${({ImgBg}) => backgroundImgMixin({
      img: ImgBg,
      position: 'right bottom',
      size: '85px'
    })}

    img {
      vertical-align: middle;
      width: 13px;
      margin-top: -3px;
    }
  }
`;

export const StyledPagination = styled(Pagination)`
  padding-top: 40px;
`;

export const StyledHospitalItem = styled(HospitalItem)<IHospitalProps>`
  border: 0;
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

export const StyledMeetup2 = styled(Meetup2)<IMeetup>`
  display: inline-block;
  vertical-align: top;
  width: 220px;
  margin: 10px 5px 0;

  .title {
    width: 100%;
    height: 146px;

    .title-text {
      padding: 0 10px;
    }

    .img {

      &::before {
        width: 100%;
      }
    }
  }

  .contents {
    .personnel {
      width: 64px;

      p {
        font-size: 11px;

        span {
          font-size: 11px;
        }
      }
    }
  }
`;

export const StyledSearchDictItem = styled(SearchDictItem)<ISearchDictItemProps>`
  display: block;
  width: 100%;
  padding: 7px 0 12px;
  border-bottom: 1px solid ${$BORDER_COLOR};


  p {
    line-height: 20px;
    color: #67aef6;
  }

  h3 {
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })};
  }

  > span {
    line-height: 21px;
    ${fontStyleMixin({
      size: 12,
      color: '#999'
    })};
  }
`;

export const StyledSearchUserItem = styled(SearchUserItem)<ISearchUserItem>`
  display: inline-block;
  float: none;
  width: 220px;
  margin: 0 10px 0 0;
  border: 0;
  border-bottom: 1px solid ${$BORDER_COLOR};
  vertical-align: top;

  button {
    right: 11px;
  }
`;