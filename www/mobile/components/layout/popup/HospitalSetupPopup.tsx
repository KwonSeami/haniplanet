import React from 'react';
import styled, {keyframes} from 'styled-components';
import Popup, {PopupProps} from '../../common/popup/base/Popup';
import {heightMixin, fontStyleMixin, radiusMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $POINT_BLUE, $TEXT_GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import cn from 'classnames';
import HospitalRegionSelect from '../../hospital/HospitalRegionSelect';
import Button from '../../inputs/Button/ButtonDynamic';
import {useRouter} from 'next/router';
import HospitalMedicalFieldSelect from '../../hospital/HospitalMedicalFieldSelect';
import isEmpty from 'lodash/isEmpty';

const CategorySetupAni = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const CategorySetup = styled(Popup)`
  animation: ${CategorySetupAni} 0.3s forwards;

  .modal-body{
    height: 100vh;
    overflow-y: auto;

    > div {
      max-width: 680px;
      margin: 0 auto 30px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;

      > h2 {
        ${heightMixin(30)};
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $FONT_COLOR
        })};

        span {
          width: 30px;
          height: 30px;
          float: right;
          font-size: 0;

          img {
            width: 30px;
          }
        }
      }

      .hospital-region-select {
        margin-bottom: 10px;
      }
    }

    > .button {
      display: block;
      margin: 0 auto 120px;
    }
  }

  @media screen and (max-width: 680px) {
    .modal-body > div {
      > h2 {
        padding: 0 15px;
      }

      .select-box-wrapper {
        padding: 0 15px;
      }

      .medical-field-wrapper {
        padding: 0 15px;
      }
    }
  }
`;

const CategorySelectBox = styled.button`
  width: 100%;
  ${heightMixin(44)};
  padding-left: 11px;
  margin-top: 8px;
  ${radiusMixin('7px', $BORDER_COLOR)};
  text-align: left;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/icon/arrow/icon-story-select-arrow.png'),
    size: '11px',
    position: 'right 12px center'
  })};
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })};

  &.on {
    background-color: #f9f9f9;
  }

  img {
    width: 20px;
    margin-bottom: -4px;
    margin-right: 4px;
  }

  p {
    max-width: calc(100% - 70px);
    display: inline-block;
    vertical-align: top;
    ${fontStyleMixin({
      size: 14
    })};
  }
`;

interface Props extends PopupProps {
}

const HospitalSetupPopup = React.memo<Props>(({
  id,
  closePop
}) => {
  const router = useRouter();
  const {query, pathname} = router;

  const [isSelectingRegion, setIsSelectingRegion] = React.useState(false);
  const [isSelectingCategory, setIsSelectingCategory] = React.useState(false);

  const parsedData = React.useCallback((data: string, defaultValue = []) => {
    return data
      ? JSON.parse(data)
      : defaultValue
  }, []);

  const stringifiedData = React.useCallback(<T extends Indexable>(key: string, data: T) => {
    return !isEmpty(data)
      ? {
        [key]: JSON.stringify(data)
      }
      : {}
  }, []);

  const [regions, setRegions] = React.useState({
    major: (query.major as string) || '',
    sub: parsedData(query.sub as string),
    regionForm: {
      regions: parsedData(query.region as string),
      regionIds: parsedData(query.region_id as string)
    }
  });

  const [categories, setCategories] = React.useState(parsedData(query.category_id as string));

  const searchHospital = React.useCallback((query: Indexable) => {
    router.replace({pathname, query});
  }, [pathname]);

  const onFilteredSearch = React.useCallback(() => {
    const {
      major,
      sub,
      regionForm: {
        regions: formRegions,
        regionIds: formRegionIds
      },
    } = regions;

    const {
      category_id,
      major: majorQuery,
      sub: subQuery,
      region: regionsQuery,
      region_id: regionIdsQuery,
      ...rest
    } = query;

    searchHospital({
      ...rest,
      ...stringifiedData('category_id', categories),
      ...stringifiedData('region', formRegions),
      ...stringifiedData('region_id', formRegionIds),
      ...stringifiedData('sub', sub),
      ...((major && !isEmpty(sub))
        ? {major}
        : {}
      ),
      page: 1
    });
  }, [regions, query, categories]);

  const selectedRegionName = regions.sub.map(s => s.split('/')[1]).join(', ');
  const selectedCategoryName = categories.map(({name}) => name).join(', ');

  return (
    <CategorySetup
      isOpen
      id={id}
      full
    >
      <div>
        <h2 className="clearfix">
          조건 설정
          <span onClick={() => closePop(id)}>
            <img
              src={staticUrl('/static/images/icon/icon-close.png')}
              alt="닫기"
            />
          </span>
        </h2>
        <div className="select-box-wrapper">
          <CategorySelectBox
            type="button"
            className={cn('pointer', {
              on: isSelectingRegion
            })}
            onClick={() => setIsSelectingRegion(curr => !curr)}
          >
            <img
              src={staticUrl('/static/images/icon/icon-location-gray.png')}
              alt="지역 선택"
            />
            {selectedRegionName ? (
              // 검색 시 보여지는 지역 선텍 텍스트
              <p className="ellipsis">{selectedRegionName}</p>
            ) : '지역 선택'}
          </CategorySelectBox>
        </div>
        {isSelectingRegion && (
          <HospitalRegionSelect
            className="hospital-region-select"
            regions={regions}
            onApply={data => {
              setRegions(data);
              setIsSelectingRegion(false);
            }}
          />
        )}
        <div className="select-box-wrapper">
          <CategorySelectBox
            type="button"
            className={cn('pointer', {
              on: isSelectingCategory
            })}
            onClick={() => setIsSelectingCategory(curr => !curr)}
          >
            <img
              src={staticUrl('/static/images/icon/icon-star-gray.png')}
              alt="진료분야 선택"
            />
            {selectedCategoryName ? (
              // 검색 시 보여지는 진료 분야 텍스트
              <p className="ellipsis">{selectedCategoryName}</p>
            ) : '진료분야 선택'}
          </CategorySelectBox>
        </div>
        {isSelectingCategory && (
          <HospitalMedicalFieldSelect
            categories={categories}
            onApply={data => {
              setCategories(data);
              setIsSelectingCategory(false);
            }}
          />
        )}
      </div>
      <Button
        size={{
          width: '210px',
          height: '40px'
        }}
        border={{
          width: '1px',
          radius: '21.5px',
          color: $POINT_BLUE
        }}
        font={{
          size: '15px',
          color: $POINT_BLUE
        }}
        onClick={() => {
          closePop(id);
          onFilteredSearch();
        }}
      >
        검색
      </Button>
    </CategorySetup>
  );
});

export default HospitalSetupPopup;
