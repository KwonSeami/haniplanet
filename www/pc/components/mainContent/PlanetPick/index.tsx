import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {TPlanetPick} from '../../../src/reducers/main';
import PlanetPickItem from './Item';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fetchCategoriesThunk, ICategoriesById} from '../../../src/reducers/categories';
import {RootState} from '../../../src/reducers';
import isEmpty from 'lodash/isEmpty';

const PickBestWrapper = styled.div`
  width: 1090px;
  margin: 19px auto 0;

  .pick-title-wrapper {
    position: relative;
    margin-bottom: 17px;

    h2 {
      ${fontStyleMixin({
        size: 22,
        weight: '600',
      })};
  
      span {
        margin: -3px 0 0 1px;
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 16,
          weight: '700',
          color: '#499aff',
        })};
      }
  
      p {
        margin: -5px 0 0 11px;
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 14,
          color: '#999',
        })};
      }
    }
  
    a {
      position: absolute;
      top: 6px;
      right: -4px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 14,
      })};
  
      img {
        width: 13px;
        margin-top: -2px;
        transform: rotate(270deg);
      }
    }
  }

  ul {
    font-size: 0;
  }
`;

const MAX_PLANET_PICK_LENGTH = 5;

interface Props {
  data: TPlanetPick[];
  isUserLogined: boolean;
}

const PlanetPick: React.FC<Props> = ({
  data,
  isUserLogined
}) => {
  const dispatch = useDispatch();

  const categoriesById = useSelector(
    ({categories: {categoriesById}}: RootState) => categoriesById,
    shallowEqual 
  );

  const filterPickLink = (data: ICategoriesById) => {
    if (isEmpty(data)) {
      return null;
    }

    const categories = Object.entries(data);
    const [[pickLink]] = categories.filter(c => c[1].name === '플래닛 PICK');
    
    return pickLink;
  };

  React.useEffect(() => {
    if (isUserLogined) {
      dispatch(fetchCategoriesThunk());
    }
  }, [isUserLogined]);

  const picks = data.slice(0, MAX_PLANET_PICK_LENGTH);
  const pickLink = filterPickLink(categoriesById);

  return (
    <PickBestWrapper>
      <div className="pick-title-wrapper">
        <h2>
          플래닛<span>PICK</span>
          <p>한의플래닛이 선정하고, 다듬은 글입니다.</p>
        </h2>
        {(isUserLogined && pickLink) && (
          <Link href={`/community?category=${pickLink}`}>
            <a>
              더 많은 Pick 보기
              <img
                src={staticUrl('/static/images/icon/arrow/icon-btn-down.png')}
                alt="플래닛픽 메뉴로 이동"
              />
            </a>
          </Link>
        )}
      </div>
      <ul>
        {picks.map((props, index) => {
          const key = props?.story?.id || index;

          return (
            <PlanetPickItem
              key={key}
              {...props}
            />
          );
        })}
      </ul>
    </PickBestWrapper>
  );
};

export default React.memo(PlanetPick);
