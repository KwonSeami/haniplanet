import * as React from 'react';
import cn from 'classnames';
import styled, {css} from 'styled-components';
import GuideLabel from '../story/branches/GuideLabel';
import {$WHITE, $GRAY, $FONT_COLOR} from '../../styles/variables.types';

const StickerSorting = styled.ul`
  margin-bottom: 10px;

  li {
    display: inline-block;
    margin-right: 6px;
    
    span.guide-label {
      &.on {
        color: ${$FONT_COLOR};
      }
      
      &:not(.on) {
        &:hover {
          color: ${$GRAY};
        }
      }
    }
  }
`;

const HANI_LABEL_MAP = {
  '전체':     `&.on{background-color: ${$WHITE}; border: 1px solid ${$GRAY};}`,
  '검토중':   `&.on{background-color: #fff9cd;}`,
  '기획중':   `&.on{background-color: #fff9cd;}`,
  '디자인중': `&.on{background-color: #fff9cd;}`,
  '개발예정': `&.on{background-color: #d7e9ff;}`,
  '개발중':   `&.on{background-color: #eaedf4;}`,
  '확인중':   `&.on{background-color: #eaedf4;}`,
  '반영완료': `&.on{background-color: #ffdfd4;}`,
} as const;

interface Props {
  onChange?: (name: string) => void;
}

const HaniGuideLabelList = React.memo<Props>(({onChange}) => {
  const [selectLabel, setSelectLabel] = React.useState('전체');
  const onClickGuideLabel = React.useCallback(name => setSelectLabel(name), []);

  React.useEffect(() => {
    onChange && onChange(selectLabel || '');
  }, [onChange, selectLabel]);

  return (
    <StickerSorting>
      {Object.keys(HANI_LABEL_MAP).map(value => (
        <li key={value}>
          <GuideLabel
            className={cn('pointer', {on: selectLabel === value})}
            name={value}
            onClick={onClickGuideLabel}
            cssText={HANI_LABEL_MAP[value]}
          />
        </li>
      ))}
    </StickerSorting>
  );
});

export default HaniGuideLabelList;
