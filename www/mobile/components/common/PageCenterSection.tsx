import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {$WHITE} from '../../styles/variables.types';

interface IStyledProps {
  padding?: string;
}

interface ICompProps {
  className?: string;
  children: React.ReactNode;
}

const PageCenterSection = styled(
  React.memo<ICompProps>(({className, children}) => (
    <section className={cn('page-center-section', className)}>
      <div className="wrap-div">
        {children}
      </div>
    </section>
  ))
)<IStyledProps>`
  width: 100%;
  height: 100%;
  background-color: #f6f7f9;
  ${({padding}) => padding ? `padding : ${padding}` : ''};

  @media screen and (max-width: 680px) {
    padding: 0;
  }
  
  & > div.wrap-div {
    max-width: 580px;
    margin: auto;
    background-color: ${$WHITE};
  }
`;

export default PageCenterSection;

