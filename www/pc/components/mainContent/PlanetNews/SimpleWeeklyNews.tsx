import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../../styles/variables.types';
import A from '../../UI/A';

const SimpleWeeklyNewsDiv = styled.div`
  margin-bottom: 12px;

  a {
    display: inline-flex;
    width: 100%;
  }

  a:hover h3 {
    text-decoration: underline;
  }

  h3 {
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })};
  }

  span {
    padding-left: 8px;
    white-space: nowrap;
    ${fontStyleMixin({
      size: 12,
      weight: '600',
      color: $TEXT_GRAY
    })};
  }
`;

interface Props {
  title: string;
  url: string;
  newspaper: string;
}

const SimpleWeeklyNews: React.FC<Props> = ({
  title,
  url,
  newspaper
}) => (
  <SimpleWeeklyNewsDiv>
    <A
      to={url}
      newTab
    >
      <h3 className="ellipsis">{title}</h3>
      <span>{newspaper}</span>
    </A>
  </SimpleWeeklyNewsDiv>
);

export default React.memo(SimpleWeeklyNews);
