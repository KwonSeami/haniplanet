import * as React from 'react';
import styled from 'styled-components';
import AnnouncementCard from './AnnouncementCard';

const AnnouncementCardMobile = styled(AnnouncementCard)`
  max-width: 680px;
  margin: auto;

  @media screen and (max-width: 680px) {
    border-top: 8px solid #f2f3f7;
    padding-top: 8px;
    margin: 0;

    & > h2 {
      padding: 12px 15px 7px;
    }
  }
`;

export default AnnouncementCardMobile;