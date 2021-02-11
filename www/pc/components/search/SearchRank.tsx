import * as React from 'react';
import styled from 'styled-components';
import {$POINT_BLUE, $BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {AxiosPromise} from 'axios';
import Link from 'next/link';

const RankListWrapper = styled.div`
  margin: 0 0 40px;
  border-top: 2px solid ${$FONT_COLOR};

  h3 {
    padding: 11px 0;
    line-height: 25px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 15,
      weight: '600',
    })};
  }

  li {
    margin-top: -1px;
    box-sizing: border-box;

    a {
      display: block;
      width: 100%;
      ${heightMixin(39)};
      padding: 0 10px;
      border: 1px solid transparent;
      border-bottom: 1px solid ${$BORDER_COLOR};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      ${fontStyleMixin({
        size: 13,
        weight: '600'
      })}
      transition: border 0.1s, color 0.1s;
      box-sizing: border-box;

      span {
        display: inline-block;
        vertical-align: middle;
        width: 15px;
        margin: -3px 10px 0 0;
        text-align: center;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $TEXT_GRAY,
          family: 'Montserrat'
        })}
      }
    }

    &:hover {
      a {
        padding: 0 20px 0 10px;
        color: ${$POINT_BLUE};
        border: 1px solid ${$POINT_BLUE};
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png'),
          size: '12px 13px',
          position: '96% 50%'
        })}

        span {
          color: ${$POINT_BLUE};
        }
      }
    }
  }
`;


interface Props {
  title: string;
  api: () => AxiosPromise;
}

const SearchRank: React.FC<Props> = ({title, api}) => {
  const [list, save] = React.useState([]);

  React.useEffect(() => {
    const res = api && api();

    res && res.then(({data}) => {
      const {result, results} = data || {} as any;
      if (result || results) {
        save(result || results);
      } else {
        save(data);
      }
    })
    .catch(error => console.log(error));
  }, [api]);

  return (
    <>
      {list && (
        <RankListWrapper>
          <h3>{title}</h3>
          <ul>
            {list.map(({keyword}, idx) => (
              <li>
                <Link
                  href={`/search?q=${keyword}`}
                >
                  <a>
                    <span>{idx + 1}</span>
                    {keyword}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </RankListWrapper>
      )}
    </>
  )
};


SearchRank.displayName = 'SearchRank';
export default React.memo(SearchRank);