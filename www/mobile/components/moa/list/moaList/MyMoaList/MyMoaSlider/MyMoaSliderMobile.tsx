import * as React from 'react';
import {useRouter} from 'next/router';
import {staticUrl} from '../../../../../../src/constants/env';
import {MyMoaSliderUl, BannerInfoLi, MoaBanner, MoaSliderDiv, Shortcuts} from './styleCompMobile';

interface IMyMoa {
  avatar: string;
  name: string;
  slug: string;
  story_count: number;
  new_story_count: number;
  member_count: number;
}

interface Props {
  myMoaList: IMyMoa[];
}

const MyMoaSliderMobile = React.memo<Props>(({myMoaList}) => {
  const isSlide = React.useRef(false);
  const router = useRouter();

  return (
    <MyMoaSliderUl>
      {myMoaList.map(({
        avatar,
        name,
        slug,
        story_count,
        new_story_count,
        member_count,
      }) => (
        <li
          key={slug}
          onClick={() => {
            if (!isSlide.current) {
              router.push('/band/[slug]', `/band/${slug}`);
            }
          }}
        >
          <MoaBanner bandAvatar={avatar || staticUrl('/static/images/icon/icon-moa-content-default.png')}>
            <span className="moa-shortcuts">
              바로가기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
                alt={`${name} 바로가기`}
              />
            </span>
          </MoaBanner>
          <h2>{name}</h2>
          <ul>
            <BannerInfoLi>
              총 게시글 <span>{story_count}</span>
            </BannerInfoLi>
            <BannerInfoLi newCount={true}>
              새글 <span>{new_story_count}</span>
            </BannerInfoLi>
            <BannerInfoLi>
              회원수 <span>{member_count}</span>
            </BannerInfoLi>
          </ul>
        </li>
      ))}
    </MyMoaSliderUl>
  );
});

export default MyMoaSliderMobile;
