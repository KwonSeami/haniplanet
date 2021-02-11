import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Link from 'next/link';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$GRAY, $THIN_GRAY, $FONT_COLOR, $TEXT_GRAY, $POINT_BLUE, $BORDER_COLOR} from '../../../styles/variables.types';
import {numberWithCommas} from '../../../src/lib/numbers';

const TabContentLi = styled.li`
  width: 50%;
  box-sizing: border-box;
  float: left;
  border-left: 1px solid ${$BORDER_COLOR};
`;

const AvatarDiv = styled.div<Pick<Props, 'avatar'>>`
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/icon/icon-moa-default.png')
  })};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: absolute;
  left: 21px;
  top: 50%;
  margin-top: -29px;
`;

const MoaGatheringDiv = styled.div`
  position: relative;
  padding: 15px 20px 15px 96px;
  width: 100%;
  min-height: 91px;
  box-sizing: border-box;

  h2 {
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })};
    padding-bottom: 2px;
  }

  .shortcuts {
    display: none;
    position: absolute;
    right: 26px;
    top: 15px;
    ${fontStyleMixin({
      size: 12,
      color: $POINT_BLUE
    })}

    img {
      width: 12px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -4px;
    }
  }

  .gather-info li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-right: 4px;
    margin-right: 8px;
      
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })}

    span {
      color: ${$FONT_COLOR};
    }

    &::after {
      content: '';
      width: 2px;
      height: 2px;
      border-radius: 50%;
      background-color: ${$THIN_GRAY};
      position: absolute;
      right: -4px;
      top: 50%;
      margin-top: 4px;
    }

    &:last-child::after {
      display: none;
    }
  }

  p {
    padding-top: 4px;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })}
  }

  &:hover {
    background-color: #f9f9f9;
    mix-blend-mode: multiply;

    .shortcuts {
      display: block;
    }
  }
`;

interface Props {
  name: string;
  slug: string;
  created_at: string;
  story_count: number;
  member_count: number;
  body: string;
  avatar?: string;
}

const MoaGathering: React.FC<Props> = React.memo(({
  name, slug, created_at, story_count, member_count, body, avatar
}) => {
  return (
    <TabContentLi>
      <Link href={`/band/${slug}`}>
        <a>
          <MoaGatheringDiv>
            <AvatarDiv avatar={avatar} />
            <h2>{name}</h2>
            <span className="shortcuts">
            바로가기
            <img
              src={staticUrl('/static/images/icon/arrow/icon-blue-shortcuts.png')}
              alt="바로가기"
            />
          </span>
            <ul className="gather-info">
              <li>가입신청 {moment(created_at).format('YY. MM. DD')}</li>
              <li>총 게시글 <span>{numberWithCommas(story_count)}</span></li>
              <li>회원수 <span>{numberWithCommas(member_count)}</span></li>
            </ul>
            <p className="ellipsis">
              {body}
            </p>
          </MoaGatheringDiv>
        </a>
      </Link>
    </TabContentLi>
  );
});

export default MoaGathering;
