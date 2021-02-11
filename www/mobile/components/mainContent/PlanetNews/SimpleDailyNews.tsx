import React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import A from '../../UI/A';

const SimpleNewsDiv = styled.div`
  margin-bottom: 8px;
  padding-left: 13px;
  border-left: 1px solid ${$BORDER_COLOR};

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
    padding-left: 6px;
    vertical-align: super;
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

const SimpleDailyNews: React.FC<Props> = ({
  title,
  url,
  newspaper
}) => (
  <SimpleNewsDiv>
    <A
      to={url}
      newTab
    >
      <h3 className="ellipsis">{title}</h3>
      <span>{newspaper}</span>
    </A>
  </SimpleNewsDiv>
);

export default React.memo(SimpleDailyNews);
