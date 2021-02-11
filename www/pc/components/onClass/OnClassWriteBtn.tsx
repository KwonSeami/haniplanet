import * as React from 'react';
import Link from 'next/link';
import {WriteButton} from '../../pages/onclass/[slug]';
import {$WHITE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import { HashId } from '../../../../packages/types';

interface Props {
  slug: string;
  timelineId: HashId;
}
const writeBtn: React.FC<Props> = (({slug, timelineId}) => {
  return (
    <Link
      href={`/onclass/[slug]/new?timeline=${timelineId}`}
      as={`/onclass/${slug}/new?timeline=${timelineId}`}
    >
      <a>
        <WriteButton
          className="write-btn"
          size={{
            width: '106px',
            height: '42px'
          }}
          border={{
            width: '1px',
            radius: '21px',
            color: '#a0a0a0',
          }}
          font={{
            size: '14px',
            weight: 'bold',
          }}
          backgroundColor={$WHITE}
        >
          <img
            src={staticUrl('/static/images/icon/icon-write.png')}
            alt=""
          />
          글쓰기
        </WriteButton>
      </a>
    </Link>
  )
});

export default React.memo(writeBtn);