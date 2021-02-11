import * as React from 'react';
import styled from 'styled-components';
import Story from './Story2';
import {NoticeProps} from '../UI/Card/StoryLabelCard';

const StoryMobile = styled(Story)<Pick<NoticeProps, 'is_notice'>>`
  @media screen and (max-width: 680px) {
    padding-bottom: 0;
    border-top: 8px solid #f2f3f7;

    .story-body {
        padding: 0 15px;
    }
    
    .preview {
      padding: 0 0 7px;
      min-height: auto;

      & > p {
        white-space: normal !important;
      }

      .more {
        padding: 6px 0;
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
