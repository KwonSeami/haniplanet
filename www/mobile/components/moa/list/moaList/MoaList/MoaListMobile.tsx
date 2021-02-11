import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {shallowEqual, useSelector} from 'react-redux';
import BandCard from '../../../../UI/Card/BandCard/BandCard';
import MoaListItemMobile from './MoaListItem/MoaListItemMobile';
import BandApi from '../../../../../src/apis/BandApi';
import FeedApi from '../../../../../src/apis/FeedApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../../../../src/hooks/useSaveApiResult';
import {RootState} from '../../../../../src/reducers';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';

interface Props {
  className?: string;
  showMoaLength?: boolean;
  title: string;
  bandType: 'moa' | 'consultant' | 'onclass';
}

const MoaListUl = styled.ul`
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  white-space:nowrap;

  & > li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 148px;
    height: 240px;
    margin-right: 9px;
    white-space: initial;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};

    @media screen and (max-width: 500px) {
      height: 221px;
    }
  }
`;

const MoaListMobile = React.memo<Props>(
  ({className, title, bandType, showMoaLength}) => {
    // Redux
    const user_type = useSelector(
      ({system, orm}: RootState) => (
        (pickUserSelector(system.session.id)(orm) || {} as any).user_type
      ),
      shallowEqual,
    );

    // API
    const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
    const feedApi: FeedApi = useCallAccessFunc(access => access && new FeedApi(access));
    const {resData} = useSaveApiResult(() => {
      if (user_type === 'consultant') {
        return bandApi && bandApi.myBandList();
      } else {
        return feedApi && feedApi.band(bandType);
      }
    });

    if (!resData) { return null; }

    const cardTitle = showMoaLength ? `${resData.length}개의 ${title}` : title;

    return (
      <BandCard
        className={cn(className, 'moa-list-mobile')}
        title={cardTitle}
      >
        <MoaListUl>
          {resData.map(rest => (
            <li key={name}>
              <MoaListItemMobile
                bandType={bandType}
                {...rest}
              />
            </li>
          ))}
        </MoaListUl>
      </BandCard>
    );
  }
);

MoaListMobile.displayName = 'MoaListMobile';
export default MoaListMobile;
