import * as React from 'react';
import styled from 'styled-components';
import {$FONT_COLOR, $WHITE, $BORDER_COLOR} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import ProfileHospitalItem from './ProfileHospitalItem';
import Link from 'next/link';
import cn from 'classnames';

const HospitalLi = styled.li`
  margin-top: 15px;

  a .job-info-btn {
    display: inline-block;
    text-align: center;
    width: calc(100% + 30px);
    height: 31px;
    padding-top: 9px;
    margin: -1px 0 0 -15px;
    background-color: #edf5ff;
    border-top: 1px solid #ecedef;
    border-bottom: 1px solid #ecedef;
    ${fontStyleMixin({
      size: 13,
      weight: 'bold',
      color: $FONT_COLOR
    })};

    &.has-hospital {
      background-color: ${$WHITE};
      border-bottom: 1px solid ${$BORDER_COLOR};
      border-top: 1px solid ${$BORDER_COLOR};
    }

    img {
      margin: 0 0 -2px 4px ;
      width: 15px;
      height: 15px;
    }
  }
`;

interface Props {
  bandData: any; // 타입 수정 필요
  hasHospital: boolean;
  showAdditionalBtn?: boolean;
}

const ProfileHospitalItem2: React.FC<Props> = React.memo(({
  bandData,
  hasHospital,
  showAdditionalBtn
}) => {
  const linkText = `재직정보 ${hasHospital ? '관리' : '추가'}`;

  return (
    <HospitalLi>
      <ProfileHospitalItem {...bandData}/>
      {showAdditionalBtn && (
        <Link
          href="/band/[slug]"
          as={`/band/${bandData.slug}?medicalTeam=${hasHospital ? 'edit' : 'new'}`}
        >
          <a>
            <span
              className={cn('job-info-btn', {
                'has-hospital': hasHospital
              })}
            >
              {linkText}
              <img
                src={staticUrl(hasHospital
                  ? '/static/images/icon/arrow/icon-circle-arrow.png'
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

ProfileHospitalItem2.displayName = 'ProfileHospitalItem2';

export default ProfileHospitalItem2;
