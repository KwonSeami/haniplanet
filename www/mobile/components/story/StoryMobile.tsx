import * as React from 'react';
import styled from 'styled-components';
import Story from './Story';
import {NoticeProps} from '../UI/Card/StoryLabelCard';

const StoryMobile = styled(Story)<Pick<NoticeProps, 'is_notice'>>`
  .story-body {
    padding: 12px 0 8px;
  }

  .preview {
    padding: 0;

    .story-thumbnail-img {
      padding-top: 4px;
    }
  }

  @media screen and (max-width: 680px) {
    .story-body {
      padding: 12px 15px 8px;

      .hani-renderer > div {
        margin: 0 -15px;
      }
    }
    
    .preview {
      padding: 0;
      min-height: auto;

      & > p {
        white-space: normal !important;
      }

      .story-thumbnail-img {
        margin: 0 -15px;
      }
    }

    .ak-renderer-document {
      padding: 0 15px;
    }

    .tag {
      padding: 0 15px;
    }
    
    .default-commnet {
      border-width: 0;
    }

    .default-comment {
      border-width: 0;
    }
  }
`;

StoryMobile.displayName = 'StoryMobile';

export default StoryMobile;
