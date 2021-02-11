import * as React from 'react';
import MoaHeaderArea from './styles/MoaHeaderArea';
import Link, {LinkProps} from 'next/link';
import {staticUrl} from '../../src/constants/env';

interface MoaHeader {
  className?: string;
  avatar?: string;
  title: string;
  linkProps: LinkProps;
  children: React.ReactNode;
}

const MoaHeader = React.memo<MoaHeader>(
  ({className, avatar, title, linkProps, children}) => (
    <MoaHeaderArea
      className={className}
      avatar={avatar}
    >
      <h2>{title}</h2>
      <Link {...linkProps}>
        <a>
          <img
            src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
            alt="MOA"
          />
          {children}
        </a>
      </Link>
    </MoaHeaderArea>
  )
);

export default MoaHeader;
