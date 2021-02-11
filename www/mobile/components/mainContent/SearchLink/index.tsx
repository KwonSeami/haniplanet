import React from 'react';
import Link from 'next/link';
import Button from '../../inputs/Button';
import {$TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';

const SearchLink = () => (
  <div>
    <Link href="/search/m">
      <a>
        <Button
          className="main-search-btn"
          size={{
            width: '100%',
            height: '44px'
          }}
          border={{
            radius: '7px',
          }}
          font={{
            size: '15px',
            color: $TEXT_GRAY,
          }}
          backgroundColor={$WHITE}
        >
          어떤 정보가 필요하신가요?
          <img
            src={staticUrl('/static/images/icon/arrow/arrow-blue-blue_bg.png')}
            alt="검색하러 가기"
          />
        </Button>
      </a>
    </Link>
  </div>
);

export default SearchLink;
