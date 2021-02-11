import * as React from 'react';
import Router from 'next/router';
import {staticUrl} from '../../../../src/constants/env';
import {OnClassSliderUl, BannerInfoLi, OnClassBanner} from './style';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../../../src/reducers/popup';
import OnComingPopup from '../../../layout/popup/OnComingPopup';

interface IOnClassInfo {
  remaining_days: number;
}
interface IOnClass {
  avatar: string;
  name: string;
  slug: string;
  story_count: number;
  new_story_count: number;
  member_count: number;
  onclass_info: IOnClassInfo;
  oncoming_month: number;
}

interface Props {
  myOnClassList: IOnClass[];
  isManageOnClass: boolean;
}

const OnClassListSlider: React.FC<Props> = ({
  myOnClassList,
  isManageOnClass,
}) => {
  return (
    <OnClassSliderUl>
      {myOnClassList.map(({
        avatar,
        name,
        slug,
        story_count,
        new_story_count,
        member_count,
        onclass_info,
        oncoming_month
      }) => {
        const {remaining_days, receipt_remaining_days, onclass_status} = onclass_info || {} as any;
        const duration = isManageOnClass ? receipt_remaining_days : remaining_days;

        const dispatch = useDispatch();

        return (
          <li
            key={slug}
            onClick={() => {
              onclass_status == 'oncoming' ? (
                dispatch(pushPopup(OnComingPopup, {oncoming_month}))
              ) : (
                Router.push(
                  '/onclass/[slug]',
                  `/onclass/${slug}`,
              )
            )}}
          >
            <OnClassBanner bandAvatar={avatar || staticUrl('/static/images/icon/icon-moa-content-default.png')}>
              {onclass_info && (
                <span className="onclass-duration">
                  <img
                    src={duration
                      ? staticUrl('/static/images/icon/onclass-duration-on.png')
                      : staticUrl('/static/images/icon/onclass-duration-off.png')}
                    alt="수강 기간"
                  />
                  {isManageOnClass ? '신청' : '학습'}
                  {!!duration ? (
                    <> 기간 <b>{duration}일</b> 남음</>
                    ) : (
                      <>종료</>
                  )}
                </span>
              )}
              <span className="onclass-shortcuts">
                바로가기
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
                  alt={`${name} 바로가기`}
                />
              </span>
            </OnClassBanner>
            <h2 className="ellipsis">{name}</h2>
            <ul>
              <BannerInfoLi>
                총 게시글 <span>{story_count}</span>
              </BannerInfoLi>
              <BannerInfoLi newCount={true}>
                새글 <span>{new_story_count}</span>
              </BannerInfoLi>
              <BannerInfoLi>
                수강생 <span>{member_count}</span>
              </BannerInfoLi>
            </ul>
          </li>
        );
      })}
    </OnClassSliderUl>
  );
};

export default React.memo(OnClassListSlider);
