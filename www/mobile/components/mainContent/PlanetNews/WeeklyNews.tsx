import React from 'react';
import styled from 'styled-components';
import {$TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import A from '../../UI/A';

const Div = styled.div`
  padding: 10px 15px 11px;
  border-bottom: 1px solid #eee;

  a {
    display: inline-flex;
    width: 100%;
  }

  h3 {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
    })};
  }

  span {
    margin-left: 4px;
    white-space: nowrap;
    ${fontStyleMixin({
      size: 11,
      weight: '600',
      color: $TEXT_GRAY,
    })};
  }
`;

interface Props {
  title: string;
  url: string;
  newspaper: string;
}

const WeeklyNews: React.FC<Props> = ({
  title,
  url,
  newspaper
}) => (
  <Div>
    <A
      to={url}
      newTab
    >
      <h3 className="ellipsis">{title}</h3>
      <span>{newspaper}</span>
    </A>
  </Div>
);

export default WeeklyNews;
