import React from 'react';
import styled from 'styled-components';
import {IPlanetNotice} from '../../../src/reducers/main';
import {radiusMixin, fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import Link from 'next/link';
import {staticUrl} from '../../../src/constants/env';
import NoticeItem from './NoticeItem';

const PlanetNoticeWrapper = styled.article`
  width: 320px;
  height: 196px;
  margin-left: 14px;
  ${radiusMixin('7px', '#eee')};
  display: inline-block;
  vertical-align: middle;

  header {
    ${heightMixin(38)};
    padding: 0 10px 0 16px;
    background-color: #fbfbfb;
    border-bottom: 1px solid #999;
    border-radius: 7px 7px 0 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    h2 {
      line-height: 36px;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
      })};
    }

    a {
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        color: '#999'
      })};

      img {
        width: 12px;
        vertical-align: middle;
      }
    }
  }

  section {
    padding: 10px 15px;
  }
`;

const MAX_NOTICES_LENGTH = 5;

interface Props {
  data: IPlanetNotice[];
  isUserLogined: boolean;
}

const PlanetNotice: React.FC<Props> = ({
  data,
  isUserLogined
}) => {
  const notices = data.slice(0, MAX_NOTICES_LENGTH);

  return (
    <PlanetNoticeWrapper>
      <header>
        <h2>공지사항</h2>
        <Link href="/guide">
          <a>
            바로가기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-gray-shortcuts.png')}
              alt="공지사항 바로가기"
            />
          </a>
        </Link>
      </header>
      <section>
        <ul>
          {notices.map(({
            id,
            title,
            // menu_tag
          }) => (
            <NoticeItem
              key={id}
              id={id}
              title={title}
              isUserLogined={isUserLogined}
            />
          ))}
        </ul>
      </section>
    </PlanetNoticeWrapper>
  );
};

export default React.memo(PlanetNotice);
