// 정윤재 작업 - 피드가 로딩중일 때 보이는 컴포넌트입니다.
import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';

const Img = styled.img`
  display: block;
  margin: auto;
  width: 32px;
  padding: 20px 0;
`;

type TInnerRef = React.RefObject<HTMLParagraphElement>;

interface Props {
  className?: string;
}

interface InnerLoadingProps extends Props {
  innerRef: TInnerRef;
}

const InnerLoading = React.memo<InnerLoadingProps>(({innerRef, className}) => (
  <p
    ref={innerRef}
    className={className}
  >
    <Img
      src={staticUrl('/static/images/icon/icon-loading.gif')}
      alt="피드를 불러오는 중입니다."
    />
  </p>
));

const Loading = React.memo<Props>(
  React.forwardRef((props, ref: TInnerRef) => (
    <InnerLoading
      innerRef={ref}
      {...props}
    />
  )
));

export default Loading;
