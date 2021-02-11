import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR, $GRAY, $BORDER_COLOR} from '../../styles/variables.types';
import SearchInput from '../UI/SearchInput';
import {FeedContentDiv} from '../search/styleCompPC';
import Pagination from '../UI/Pagination';

export const USER_TYPE_COLOR = {
  doctor: '#3db871',
  student: '#7965c4'
}

export const USER_TYPE_COLOR2 = {
  doctor: '#b3e1c3',
  student: '#d7d2ed'
}

export const TYPE_GRADIENT = {
  default: 'linear-gradient(107deg, #69cdf6, #7aabf8)',
  doctor: 'linear-gradient(287deg, #55daba, #78d899)',
  student: 'linear-gradient(102deg, #c5b7ff -18%, #9e98e8 100%)'
}

export const CommunityWrapperDiv = styled.div`
  position: relative;

  .board-box {
    margin-left: -35px;
    overflow: hidden;

    > div {
      display: inline-block;
      vertical-align: top;
      margin-left: 35px;
    }
  }

  .
`;

export const MaxWidthWrapper = styled.div`
  position: relative;
  max-width: 1035px;
  margin: 0 auto;
  overflow: hidden;
`;

export const StyledFeedContentDiv = styled(FeedContentDiv)`
  > div {
    min-height: 600px;
  }
  
  .top-wrapper {
    position: relative;

    h2 {
      display: inline-block;
      height: 17px;
      margin: 14px 0 12px;
      ${fontStyleMixin({
        size: 13,
        color:  $TEXT_GRAY
      })}

      span {
        color: ${$FONT_COLOR};
      }
    }

    .select-box {
      position: absolute;
      right: 77px;
      top: 0;
      width: 90px;
      border-bottom: 0;

      &.right {
        right: 0;
      }

      p {
        padding-left: 14px;
        line-height: 42px;
      }
      
      ul {
        margin-top: 1px;
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  .styled-feed-wrapper {
    position: relative;

    .feed-theme {
      position: absolute;
      top: -36px;
      right: 0;
      margin: 0;

    }

    .feed {
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
  }

  .hash-target {
    position: relative;
    top: -184px;
    width: 0;
    height: 0;
  }
`;

export const StyledPagination = styled(Pagination)`
  margin-top: 40px;
`;

export const StyledSearchInput = styled(SearchInput)`
  &.input-margin {
    margin-bottom: 20px;

  }

  input::placeholder {
    color: ${$TEXT_GRAY};
  }  
`;

export const TagLink = styled.a`
  display: block;
  width: 100%;
  ${heightMixin(44)};
  margin-bottom: 20px;
  text-align: center;
  ${fontStyleMixin({
    size: 15,
    color: $GRAY
  })};
  border-radius: 3px;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &:hover {
    border-color: #999;
  }

  img {
    vertical-align: middle;
    width: 18px;
    margin: -2px 0 0 4px;
  }
`;

export const NoContent = styled.div`
  text-align: center;
  padding: 75px 0 85px;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })};
  border-top: 1px solid ${$GRAY};
  border-bottom: 1px solid ${$BORDER_COLOR};

  img {
    display: block;
    margin: 0 auto 8px;
    width: 25px;
    height: 21px;
  }
`;

export const MainBoardWrapper = styled.div`
  header + div {
    border: 1px solid #eee;
    border-top: 1px solid ${$GRAY};
    box-sizing: border-box;
  }
`;

export const MainBoardHeader = styled.header`
  position: relative;
  padding: 34px 0 10px;

  h2 {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    ${fontStyleMixin({
      size: 18,
      weight: '600',
      color: $GRAY
    })};
  }
`;