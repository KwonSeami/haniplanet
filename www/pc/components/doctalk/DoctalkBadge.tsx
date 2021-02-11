import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';

const Badge = styled.span<Props>`
  display: inline-block;
  width: ${({type}) => type === 'short'
    ? '62px'
    : '157px'
  };
  height: 20px;
  line-height: 21px;
  margin: 2px 0 0 6px;
  border-radius: 10px;
  background-color: #ddf1de;
  text-align: center;
  vertical-align: top;
  ${fontStyleMixin({
    size: 10,
    weight: '600',
    color: '#3faf44'
  })};

  img {
    width: ${({type}) => type === 'short'
      ? '10px'
      : '50px'
    };
    margin: -2px 2px 0 0;
    vertical-align: middle;
  }
`;

interface Props {
  type: 'short' | 'long';
  className?: string;
}

const DoctalkBadge = React.memo<Props>(({
  type,
  className
}) => {
  const showText = type === 'short'
    ? '닥톡의사'
    : '네이버 지식iN 한의사';

  const src = type === 'short'
    ? staticUrl('/static/images/icon/icon-doctalk-green.png')
    : staticUrl('/static/images/logo/img-doctalk-logo-green.png');

  return (
    <Badge
      className={className}
      type={type}
    >
      <img
        src={src}
        alt="닥톡 아이콘"
      />
      {showText}
    </Badge>
  );
});

DoctalkBadge.displayName = 'DoctalkBadge';

export default DoctalkBadge;
