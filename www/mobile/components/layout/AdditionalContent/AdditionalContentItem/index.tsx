import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import TitleCard, {TitleCardProps} from '../../../UI/Card/TitleCard';
import {inlineBlockMixin} from '../../../../styles/mixins.styles';
import {staticUrl} from '../../../../src/constants/env';

const StyledTitleCard = styled(TitleCard)`
  .title {
    position: relative;
  }

  .title .title-right-btn {
    position: absolute;
    right: 0;
    font-size: 12px;
    letter-spacing: 0;

    & > a > img {
      ${inlineBlockMixin(12)};
      margin-top: -4px;
    }
  }
`;

export interface IAdditionalContentItemProps extends TitleCardProps {
  className?: string;
  title: string;
  titleRightComp?: React.ReactNode;
  to?: string;
  isMobile?: boolean;
}

const AdditionalContentItem = React.memo<IAdditionalContentItemProps>(
  ({className, title, titleRightComp, to, children}) => (
    <StyledTitleCard
      className={className}
      title={
        <>
          <h2 className="title">
            {title}
            <span className="title-right-btn">
              {titleRightComp
                ? titleRightComp
                : to && (
                  <Link href={to}>
                    <a>
                      바로가기
                      <img
                        src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                        alt="바로가기"
                      />
                    </a>
                  </Link>
                )}
            </span>
          </h2>
        </>
      }
    >
      {children}
    </StyledTitleCard>
  )
);

export default AdditionalContentItem;
