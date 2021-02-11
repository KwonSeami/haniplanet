import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import Link from 'next/link';

const DictCardDiv = styled.div`
  position: relative;
  background-color: #f3f4f7;
  margin-bottom: 10px;
  padding: 8px 20px;
  border-radius: 4px;
  border: 1px solid #b3c4ce;

  .close {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    text-align: center;
    background-color: #b3c4ce;
    width: 30px;
    height: 30px;
    padding-top: 7px;
    border-radius: 0 4px 0 4px;
    box-sizing: border-box;

    img {
      width: 15px;
    }
  }

  li {
    display: block;
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    &:last-child {
      border-bottom: 0;
    }

    h3 {
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        color: $POINT_BLUE,
      })}
    }

    .tag li {
      display: inline-block;
      vertical-align: middle;
      padding: 0 11px;
      ${heightMixin(25)}
      border: 1px solid ${$POINT_BLUE};
      background-color: ${$WHITE};
      margin: 10px 10px 0 0;
      border-radius: 15px;

      a {
        ${fontStyleMixin({
          size: 13,
          color: $POINT_BLUE,
        })}
      }
    }
  }
`;

export interface IDictCard {
  id: HashId;
  type: 'herb' | 'medi';
  name: string;
  chn_name: string;
  other_name: string;
  character_song: string;
  herbs: Array<{id: number; name: string;}>;
  category: string;
  description: string;
}

interface Props {
  data: IDictCard;
  onDelete?: (dictId: HashId, data: any) => void;
  type?: 'herb' | 'medi';
}

const DictCard = React.memo<Props>(({data, type, onDelete}) => {
  const {
    code,
    name,
    chn_name,
    other_name,
    dependencies,
  } = data;

  return (
    <DictCardDiv>
      <Link
        href="/wiki/[code]"
        as={`/wiki/${code}`}
      >
        <a>
          {onDelete && (
            <span
              className="close pointer"
              onClick={(e) => {
                e.preventDefault();
                onDelete(code, {...data, type});
              }}
            >
            <img
              src={staticUrl('/static/images/icon/icon-editor-close.png')}
              alt="닫기"
            />
          </span>
          )}
          <ul>
            <li>
              {`${name} ${chn_name}`}
            </li>
            {other_name && (
              <li>
                <h3>다른 이름</h3>
                {other_name}
              </li>
            )}
            {dependencies && (
              <li>
                <ul className="tag">
                  {dependencies.map(({child: {name}}) => (
                    <li key={code}>
                      <Link
                        href="/wiki/[code]"
                        as={`/wiki/${code}`}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </a>
      </Link>
    </DictCardDiv>
  );
});

DictCard.displayName = 'DictCard';

export default DictCard;
