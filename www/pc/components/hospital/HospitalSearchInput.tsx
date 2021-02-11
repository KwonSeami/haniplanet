import React from 'react';
import SearchBaseInput, {IAcCompProps} from '../inputs/Input/SearchBaseInput';
import styled from 'styled-components';
import {radiusMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $WHITE, $TEXT_GRAY, $POINT_BLUE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import Button from '../inputs/Button/ButtonDynamic';
import debounce from 'lodash/debounce';
import {MILLI_SECOND} from '../../src/constants/times';
import SearchApi from '../../src/apis/SearchApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import HospitalAutoCompleteList from './AutoCompleteList';
import isEmpty from 'lodash/isEmpty';
import naverMapRequired from '../../hocs/naverMapRequired';

const StyledSearchBaseInput = styled(SearchBaseInput)`
  position: relative;
  width: 100%;
  height: 44px;
  padding: 0 37px;
  ${radiusMixin('7px', $BORDER_COLOR)}
  background-color: ${$WHITE};

  .input {
    ${fontStyleMixin({
      size: 16
    })};

    ::placeholder {
      ${fontStyleMixin({
        size: 16,
        color: $TEXT_GRAY
      })};
    }
  }

  .button {
    position: absolute;
    top: 0;
    right: 0;
  }

  img {
    position: absolute;
    top: calc(50% - 10px);
    left: 14px;
    width: 20px;
  }

  img.clear-button {
    display: none;
  }
`;

const ADDRESS_TYPE_MAX_LENGTH = 3;
const MAX_AUTO_COMPLETE_LENGTH = 10;

interface Props {
  onSearch: (value: Indexable) => void;
  onSelect: (value: Indexable) => void;
  className?: string;
  initialKeyword?: string;
}

const HospitalSearchInput = React.memo<Props>(({
  onSearch,
  onSelect,
  className,
  initialKeyword
}) => {
  const [keyword, setKeyword] = React.useState(initialKeyword || '');
  const [acList, setAcList] = React.useState([]);
  const [naverAddresses, setNaverAddresses] = React.useState([]);

  const searchApi: SearchApi = useCallAccessFunc(access => new SearchApi(access));

  const onChangeInput = React.useCallback(({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      setAcList([]);
      setNaverAddresses([]);
    }

    setKeyword(value);
    onDebouncedACFetch(value);
  }, []);

  const getReleatedSearch = (query: string) => {
    if (!query || query.length < 2) {
      return null;
    }

    callNaverGeocode(query)
      .then(({v2: {addresses}}) => { 
        searchApi.hospitalAutoComplete(query)
          .then(({data: {result}}) => {
            const naverAddresses = addresses.map(({
              roadAddress,
              jibunAddress,
              x,
              y
            }) => ({
              name: roadAddress || jibunAddress,
              x,
              y,
              type: 'location'
            }));

            const {
              band,
              category
            } = result;

            const hospitalAddresses = [
              ...band.map(({name, hospital__address, slug}) => ({
                name,
                additional: hospital__address,
                slug,
                type: 'address'
              })),
              ...category.map(({name, id}) => ({
                name,
                additional: query,
                id,
                type: 'category'
              }))
            ];

            const autoCompleteList = [
              ...naverAddresses.slice(0, ADDRESS_TYPE_MAX_LENGTH),
              ...hospitalAddresses
            ].slice(0, MAX_AUTO_COMPLETE_LENGTH);

            setNaverAddresses(naverAddresses);
            setAcList([...autoCompleteList, {
              name: `${query}(으)로 검색하기`,
              type: 'normal'
            }]);
          });
      });
  };

  const onSearchKeyword = React.useCallback((query: string) => {
    if (!query || query.length < 2) {
      alert('검색어는 2자 이상이어야 합니다.');
      return null;
    }

    let queryParams = {
      q: query
    } as any;

    if (!isEmpty(naverAddresses)) {
      const [{x, y}] = naverAddresses;
      queryParams = {
        ...queryParams,
        coordinate: [parseFloat(x), parseFloat(y)]
      };
    }

    onSearch(queryParams);
  }, [naverAddresses]);

  const onSelectKeyword = React.useCallback((data: string | Indexable, query: string) => {
    if (!query || query.length < 2) {
      alert('검색어는 2자 이상이어야 합니다.');
      return null;
    }

    let queryParams = {} as any;

    if (typeof data === 'object') {
      switch(data.type) {
        case 'location': {
          const {name, x, y} = data;
          queryParams = {
            ...queryParams,
            q: name,
            coordinate: [parseFloat(x), parseFloat(y)]
          };
          break;
        }
        case 'address': {
          const {slug, name} = data;
          queryParams = {
            ...queryParams,
            band_slug: slug,
            q: name
          };
          break;
        }
        case 'category': {
          const {id, name} = data;
          queryParams = {
            ...queryParams,
            category_id: JSON.stringify([{
              id,
              name
            }])
          };
          break;
        }
        case 'normal': {
          const [{x, y}] = !isEmpty(naverAddresses)
            ? naverAddresses
            : [{x: '', y: ''}];

          queryParams = {
            ...queryParams,
            q: query,
            ...((x && y)
              ? {
                coordinate: [parseFloat(x), parseFloat(y)]
              }
              : {}
            )
          };
          break;
        }
        default:
          break;
      }
    } else {
      const [{x, y}] = !isEmpty(naverAddresses)
        ? naverAddresses
        : [{x: '', y: ''}];

      queryParams = {
        ...queryParams,
        q: query,
        ...((x && y)
          ? {
            coordinate: [parseFloat(x), parseFloat(y)]
          }
          : {}
        )
      };
    }

    onSelect(queryParams);
  }, [naverAddresses]);

  const onDebouncedACFetch = React.useCallback(
    debounce(getReleatedSearch, 250 * MILLI_SECOND),
    []
  );

  const callNaverGeocode = React.useCallback((query: string) => {
    return new Promise((resolve, reject) => {
      try {
        window.naver.maps.Service.geocode({query}, (status, response) => {
          if (status === window.naver.maps.Service.Status.ERROR) {
            reject(status);
          }

          resolve(response);
        });
      } catch(e) {
        reject(e);
      }
    });
  }, []);

  return (
    <StyledSearchBaseInput
      placeholder="지역(ex)강남구 논현동) / 한의원명 / 진료 분야"
      autoList={{
        acList: acList as any as Pick<IAcCompProps, 'acList'>[],
        acComp: HospitalAutoCompleteList,
        onSelect: data => onSelectKeyword(data, keyword),
        queryKey: 'name'
      }}
      value={keyword}
      onChange={onChangeInput}
      onReset={() => {
        setKeyword('');
        setAcList([]);
        setNaverAddresses([]);
      }}
      className={className}
      searchBtn={
        <>
          <img
            src={staticUrl('/static/images/icon/icon-hospital-search.png')}
            alt="통합검색"
          />
          <Button
            size={{
              width: '80px',
              height: '100%'
            }}
            font={{
              size: '16px',
              weight: '600',
              color: $POINT_BLUE
            }}
            border={{
              radius: '7px'
            }}
            onClick={() => onSearchKeyword(keyword)}
          >
            검색
          </Button>
        </>
      }
    />
  );
});

export default naverMapRequired(HospitalSearchInput);
