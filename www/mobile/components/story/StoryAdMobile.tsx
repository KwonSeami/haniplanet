import * as React from 'react';
import styled from 'styled-components';
import {PreviewDiv} from './embeds2';
import StoryAd from './branches/StoryAd';
import {FeedTitle, MoreBtn} from './common2';

const StoryAdMobile = styled(StoryAd)`
  @media screen and (max-width: 680px) {
    max-width: 680px;
    margin: auto;
    padding-bottom: 0;
    border-top: 8px solid #f2f3f7;

    ${PreviewDiv} span {
      bottom: 15px;
    }

    .preview {
      padding: 0 0 7px;
      min-height: auto;

      p {
        padding: 0 15px;
      }

      .more {
        padding: 6px 0;
      }
    }

    ${MoreBtn} {
      right: 15px;
      top: 13px;
    }

    ${FeedTitle} {
      padding: 19px 15px 21px;

      & > h2 {
        padding-right: 50px;
      }

      ul {
        padding-top: 3px;

        &.user-label {
          position: static;
          padding-top: 9px;

          li {
            padding: 0 4px 0 0;
          }
        }
      }
    }

    .tag {
      padding: 0 15px;
    }
  }
`;

export default StoryAdMobile;
