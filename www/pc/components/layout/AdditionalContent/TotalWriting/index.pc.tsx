import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {heightMixin, fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $LIGHT_BLUE, $POINT_BLUE, $WHITE, $TEXT_GRAY} from '../../../../styles/variables.types';
import BandApi from '../../../../src/apis/BandApi';
import WritingCategory from './WritingCategory';
import ButtonGroup from '../../../inputs/ButtonGroup/index';
import Input from '../../../inputs/Input';
import Button from '../../../inputs/Button';
import {staticUrl} from '../../../../src/constants/env';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';

const MoaCategoryUl = styled.ul`
  margin: 17px 0 40px;
  border-top: 2px solid ${$FONT_COLOR};

  .guide-text {
    margin-top: 6px;
    ${fontStyleMixin({size: 11, color: $TEXT_GRAY})};
  }
`;

const MoaCategoryLi = styled.li<{on?: boolean;}>`
  width: 100%;
  position: relative;

  & > a {
    display: block;
    width: 100%;
    height: 45px;
    padding: 13px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 14,
      color: '#999'
    })}

    span {
      position: relative;
      z-index: 1;
      color: '#999';
    }

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 0 0 2px;
    }
  }

  ${({on}) => on && `
    span {
      ${fontStyleMixin({
        weight: 'bold',
        color: `${$FONT_COLOR} !important`
      })}

      &::after {
        content:'';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
        width: 100%;
        height: 50%;
        background-color: ${$LIGHT_BLUE};
      }
    }

    li {
      background-color: #f9f9f9;
    }
  `}
`;

const AddCategoryLi = styled.li`
  position: relative;
  margin-top: -1px;
  height: 45px;
  padding: 0 100px 0 16px;
  border: 1px solid ${$BORDER_COLOR};
  background-color: #f9f9f9;
  box-sizing: border-box;
`;

const StyledInput = styled(Input)`
  background-color: transparent;
  width: 100%;
  height: 43px;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  position: absolute;
  right: 10px;
  top: 10px;

  li {
    margin-left: 4px;
  }
  
  button {
    width: 40px;
    height: 25px;
    border-radius: 0;
    box-sizing: border-box;
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};
    font-size: 12px;

    &.right-button {
      color: ${$POINT_BLUE};
    }
  }
`;

const StyledButton = styled(Button)`
  margin-top: -1px;

  img {
    width: 11px;
    display: inline-block;
    vertical-align: middle;
    margin: -2px 0 0 2px;
  }
`;

interface Props {
  hasAdminPermission: boolean;
  timelines: ITimeline[];
  isAddable?: boolean;
  slug: string;
  activeTimelinePk: string | null;
  new_story_count: number;
  mainPageName?: string;
}

const MAX_MENU_LENGTH = 10;
// @진혜연: 스타일 수정이 필요합니다.
// @정윤재: 추후 hooks를 활용한 구조로 변경하기
const TotalWritingPC: React.FC<Props> = ({
  hasAdminPermission,
  timelines,
  isAddable,
  slug,
  activeTimelinePk,
  new_story_count,
  mainPageName = '전체 글',
}) => {
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const [timelineState, setTimelineState] = React.useState({
    totalTimelines: timelines || [],
    isEdit: false,
    newTimeline: ''
  });

  return (
    // 업데이트 된 게시판에는 new아이콘이 노출되어야 합니다! 일단 퍼블리싱은 해놨습니다!
    <MoaCategoryUl>
      <MoaCategoryLi on={!activeTimelinePk}>
        <Link href={`/band/[slug]`} as={`/band/${slug}`}>
          <a>
            <span>{mainPageName}</span>
            {!!new_story_count && (
              <img
                src={staticUrl("/static/images/icon/icon-new.png")}
                alt="new"
              />
            )}
          </a>
        </Link>
      </MoaCategoryLi>
      {timelineState.totalTimelines.map((timeline) => {
        const {id, name} = timeline;

        return (
          <MoaCategoryLi
            key={id}
            on={activeTimelinePk === id}
          >
            <WritingCategory
              {...timeline}
              hasAdminPermission={hasAdminPermission}
              editTimeline={(id, timeline) => {
                const {totalTimelines} = timelineState;

                if (!!timeline.trim()) {
                  bandApi.editTimeline(slug, id, {name: timeline})
                    .then(({data: {result}}) => {
                      if(result) {
                        const {order, id, name} = result;
                        setTimelineState(curr => ({
                          ...curr,
                          totalTimelines: totalTimelines.reduce((prev, curr) => {
                            if (curr.id === id) {
                              curr.order = order;
                              curr.name = name;
                            }
                            return [...prev, curr];
                          }, [])
                        }));
                      }
                    })
                    .catch(() => {
                      alert('다시 시도해주세요.');
                    });
                }
              }}
              deleteTimeline={id => {
                const {totalTimelines} = timelineState;

                confirm('해당 메뉴의 글은 모두 삭제됩니다.\n삭제하시겠습니까?') && (
                  bandApi.deleteTimeline(slug, id)
                    .then(({status}) => {
                      if (Math.floor(status / 100) !== 4) {
                        setTimelineState(curr => ({
                          ...curr,
                          totalTimelines: totalTimelines.filter(({id: _id}) => id !== _id)
                        }));
                      }
                    })
                );
              }}
            />
          </MoaCategoryLi>
        );
      })}
      {timelineState.isEdit && (
        <AddCategoryLi>
          <StyledInput
            placeholder="메뉴명을 입력해주세요.(15자이내)"
            maxLength={15}
            value={timelineState.newTimeline}
            onChange={e => {
              const {value} = e.target;
              setTimelineState(curr => ({...curr, newTimeline: value}))
            }}
          />
          <StyledButtonGroup
            leftButton={{
              children: '확인',
              onClick: () => {
                const {newTimeline, totalTimelines} = timelineState;

                if (!!newTimeline.trim()) {
                  bandApi.addTimeline(slug, {
                    name: newTimeline,
                    order: totalTimelines.length
                  }).then(({data: {result}}) => {
                      !!result && setTimelineState({
                        totalTimelines: [...totalTimelines, result],
                        isEdit: false,
                        newTimeline: ''
                      });
                    });
                }
              }
            }}
            rightButton={{
              children: '취소',
              onClick: () => {
                setTimelineState(curr => ({
                  ...curr,
                  isEdit: false,
                  newTimeline: ''
                }));
              }
            }}
          />
        </AddCategoryLi>
      )}
      {(!timelineState.isEdit && hasAdminPermission && timelineState.totalTimelines.length < MAX_MENU_LENGTH) && (
        <StyledButton
          font={{size: '14px', color: '#999'}}
          size={{width: '100%', height: '45px'}}
          border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
          onClick={() => setTimelineState(curr => ({...curr, isEdit: true}))}
        >
          메뉴추가
          <img
            src={staticUrl("/static/images/icon/icon-more2.png")}
            alt="메뉴추가"
          />
        </StyledButton>
      )}
      {isAddable && <p className="guide-text">※ 메뉴 추가는 최대 10개까지만 가능합니다.</p>}
    </MoaCategoryUl>
  );
};

export default React.memo(TotalWritingPC)
