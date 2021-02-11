import React from 'react';
import styled from 'styled-components';
import {IPlanetNotice} from '../../../src/reducers/main';

interface Props {
  data: IPlanetNotice[];
}

const PlanetNotice: React.FC<Props> = ({data}) => {
  return (
    <div>Hello</div>
  );
};

export default React.memo(PlanetNotice);
