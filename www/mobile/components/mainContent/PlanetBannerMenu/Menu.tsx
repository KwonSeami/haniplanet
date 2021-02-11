import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import Link from 'next/link';

const Li = styled.li`
  display: inline-block;
  width: 68px;
  height: 68px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 18px;
  background: linear-gradient(315deg, #151f5c 94%, #252b87 8%);

  &:first-child {
    margin-left: 10px;
  }

  & ~ li {
    margin-left: 6px;
  }

  &:nth-child(2n) {
    background: linear-gradient(315deg, #1353d6 94%, #1b61ef 8%);
  }

  a {
    display: block;
    width: 100%;
    height: 100%;
    padding-top: 8px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 10,
      weight: 'bold',
      color: 'rgba(255, 255, 255, 0.7)',
    })};
  }

  img {
    display: block;
    margin: auto;
    width: 34px;
  }

  @media screen and (min-width: 680px) {
    &:first-child {
      margin-left: 0;
    }
  }
`;

interface Props {
  img: string;
  name: string;
  url: string;
}

const Menu: React.FC<Props> = ({
  img,
  name,
  url
}) => (
  <Li>
    <Link href={url}>
      <a>
        <img
          src={img}
          alt={name}
        />
        {name}
      </a>
    </Link>
  </Li>
);

export default React.memo(Menu);
