import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $WHITE} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {HospitalItem} from './HospitalItem';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import cn from 'classnames';

const HospitalLi = styled.li`
  margin-top: -1px;
  text-align: left;

  > a:first-of-type {
    border-top: none;
    border-bottom: 1px solid ${$BORDER_COLOR};
    border-top: 1px solid ${$BORDER_COLOR};
  }

  > a:last-of-type {
    > span {
      display: inline-block;
      text-align: center;
      width: 100%;
      height: 31px;
      padding-top: 9px;
      margin-top: -1px;
      background-color: #edf5ff;
      border: 1px solid #ecedef;
      ${fontStyleMixin({
        size: 13,
        weight: 'bold',
        color: $FONT_COLOR
      })};

      &.white {
        background-color: ${$WHITE};
        border: 1px solid ${$BORDER_COLOR};

        &:hover {
          border: 1px solid ${$GRAY};
        }
      }
  
      img {
        margin: 0 0 -2px 4px;
        width: 15px;
        height: 15px;
      }
    }
  }
`;

interface Props {
  hospitalData?: any; // 타입 수정 필요
  bandData: any; // 타입 수정 필요
  hasHospital: boolean;
  showAdditionalBtn?: boolean;
}

const HospitalItem2: React.FC<Props> = React.memo(({
  bandData,
  hasHospital,
  showAdditionalBtn
}) => {
  const linkText = `재직정보 ${hasHospital ? '관리' : '추가'}`;

  return (
    <HospitalLi>
      <HospitalItem {...bandData}/>
      {showAdditionalBtn && (
        <Link
          href="/band/[slug]"
          as={`/band/${bandData.slug}?medicalTeam=edit`}
        >
          <a>
            <span className={cn({
              white: hasHospital
            })}>
              {linkText}
              <img
                src={staticUrl(hasHospital
                  ? '/static/images/icon/icon-circle-arrow.png'
                  : '/static/images/icon/icon-circle-plus.png'
                )}
                alt={linkText}
              />
            </span>
          </a>
        </Link>
      )}
    </HospitalLi>
  );
});

HospitalItem2.displayName = 'HospitalItem2';

export default HospitalItem2;
