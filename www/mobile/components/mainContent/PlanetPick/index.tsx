import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE, $GRAY} from '../../../styles/variables.types';
import {TPlanetPick} from '../../../src/reducers/main';
import MainPick from './MainPick';
import SimplePick from './SimplePick';
import isEmpty from 'lodash/isEmpty';
import {fetchCategoriesThunk, ICategoriesById} from '../../../src/reducers/categories';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';

const PlanetPickWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 3px;
  background-color: ${$WHITE};

  .title-pick {
    position: relative;
    padding: 12px 15px 14px;

    h2 {
      letter-spacing: -0.4px;
      ${fontStyleMixin({
        size: 17,
        weight: '600',
      })};

      span {
        margin: -3px 0 0 1px;
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 14,
          weight: '700',
          color: '#499aff',
          family: 'Montserrat',
        })};
      }

      p {
        margin-top: 5px;
        ${fontStyleMixin({
          size: 13,
          color: '#999'
        })};
      }
    }

    a {
      position: absolute;
      top: 12px;
      right: 11px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY,
      })};
  
      img {
        width: 8px;
        margin: -2px 0 0 1px;
        vertical-align: middle;
      }
    }
  }

  .pick-content-wrapper {
    > div:nth-of-type(2n) {
      padding-left: 15px;
    }

    > div:nth-of-type(2n+1) {
      padding: 0 15px 0 4px;
    }
  }
`;

const MAX_PLANET_PICK_LENGTH = 5;

interface Props {
  data: TPlanetPick[];
  isUserLogined: boolean;
}

const PlanetPick: React.FC<Props> = (({
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
      <PlanetPickWrapper>
        <div className="title-pick">
          <h2>
            플래닛<span>PICK</span>
            <p>한의플래닛이 선정하고, 다듬은 글입니다.</p>
          </h2>
          {(isUserLogined && pickLink) && (
            <Link href={`/community?category=${pickLink}`}>
              <a>
                더 많은 Pick 보기
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-arrow-next.png')}
                  alt="플래닛픽 메뉴로 이동"
                />
              </a>
            </Link>
          )}
        </div>
        <div className="pick-content-wrapper">
          {picks.map(({text, ...rest}, index) => {
            const isMainPick = index === 0;
            const key = rest?.story?.id || index;

            return isMainPick ? (
              <MainPick
                key={key}
                {...rest}
              />
            ) : (
              <SimplePick
                key={key}
                {...rest}
              />
            );
          })}
        </div>
      </PlanetPickWrapper>
    );
  }
);

export default React.memo(PlanetPick);
