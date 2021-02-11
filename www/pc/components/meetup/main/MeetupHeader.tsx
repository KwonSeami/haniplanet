import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import {ParsedUrlQuery} from 'querystring';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {staticUrl} from '../../../src/constants/env';
import {createMeetupUrl} from '../../../src/lib/meetup';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {$FONT_COLOR, $POINT_BLUE, $WHITE} from '../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';

const MeetupBanner = styled.div`
  height: 369px;
  padding-top: 120px;
  box-sizing: border-box;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/banner/img-bg-meetup.jpg'),
  })};

  > div {
    width: 1091px;
    margin: 0 auto;
  }

  h2 {
    margin: 47px 0 49px;
    ${fontStyleMixin({
        size: 14,
        weight: '300',
        color: 'rgba(255, 255, 255, 0.7)'
      })};

    span {
      display: block;
      line-height: 50px;
      ${fontStyleMixin({
        size: 30,
        weight: '300',
        color: $WHITE
      })};
    }
  }
`;

const SearchInput = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 700px;
  height: 44px;
  border-radius: 7px;
  padding: 0 40px;
  background-color: ${$WHITE};
  box-sizing: border-box;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/icon/icon-input-search.png'),
    size: '20px 20px',
    position: '14px center'
  })};

  input {
    width: 100%;
    height: 100%;
    font-size: 15px;
    border: 0;
    box-sizing: border-box;
  }

  button {
    position: absolute;
    top: 10px;
    right: 25px;
    cursor: pointer;
    ${fontStyleMixin({
      size: 16,
      weight: '600',
      color: $POINT_BLUE
    })};
  }
`;

const BannerButton = styled.button`
  vertical-align: middle;
  width: 190px;
  height: 44px;
  border-radius: 7px;
  background-color: ${$FONT_COLOR};
  cursor: pointer;
  ${fontStyleMixin({
    size: 14,
    weight: 'bold',
    color: $WHITE
  })};

  img {
    vertical-align: -0px;
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }

  &.meetup-new-btn {
    margin: 0 5px;
    background-color: ${$POINT_BLUE};

    img {
      width: 11px;
      height: 11px;
      margin-right: 5px;
    }
  }
`;

interface Props {
  query: ParsedUrlQuery;
}

const MeetupHeader: React.FC<Props> = ({query = {}}) => {
  const [value, setValue] = React.useState(query.q || '');

  // REDUX
  const {id: myId} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm) || {} as any,
    shallowEqual,
  );

  const qMeetupUrl = React.useMemo(() => (
    createMeetupUrl(query, {page: 1, q: value})
  ), [query, value]);

  const onChangeSearchValue = ({target: {value}}) => setValue(value);
  const onSearchKeyPress = ({key}) => {
    key === 'Enter'
      && Router.push(qMeetupUrl, qMeetupUrl, {shallow: true});
  };

  return (
    <MeetupBanner>
      <div>
        <h2>
          <span>세미나/모임</span>
          나누면 나눌수록 깊어지는 지식의 숲
        </h2>
        <div>
          <SearchInput>
            <input
              placeholder="세미나/모임 내 상세검색"
              value={value}
              onChange={onChangeSearchValue}
              onKeyPress={onSearchKeyPress}
            />
            <Link
              href={qMeetupUrl}
              as={qMeetupUrl}
              shallow
            >
              <a>
                <button>검색</button>
              </a>
            </Link>
          </SearchInput>
          <Link href="/meetup/new">
            <a>
              <BannerButton className="meetup-new-btn">
                <img
                  src={staticUrl('/static/images/icon/icon-meetup-plus.png')}
                  alt="개설하기"
                />
                세미나/모임 개설하기
              </BannerButton>
            </a>
          </Link>
          <Link
            href={{pathname: '/user/[id]/meetup', query: {page_type: 'created'}}}
            as={{pathname: `/user/${myId}/meetup`, query: {page_type: 'created'}}}
          >
            <a>
              <BannerButton>
                <img
                  src={staticUrl('/static/images/icon/icon-meetup-me.png')}
                  alt="나의 세미나/모임"
                />
                나의 세미나/모임
              </BannerButton>
            </a>
          </Link>
        </div>
      </div>
    </MeetupBanner>
  );
};

export default React.memo(MeetupHeader);