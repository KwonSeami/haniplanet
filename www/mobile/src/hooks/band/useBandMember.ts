import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {appendOrRemoveMemberList, fetchMemberThunk} from '../../reducers/orm/member/thunks';
import {pickBandSelector} from '../../reducers/orm/band/selector';
import {memberListSelector} from '../../reducers/orm/member/selector';
import {fetchBandThunk} from '../../reducers/orm/band/thunks';
import {useRouter} from 'next/router';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';

const ORDER_BY = [
  {
    label: '최근가입순',
    value: '-created_at'
  },
  {
    label: '가나다순',
    value: 'identifier'
  }
];

const useBandMember = (slug: string) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {query: {order_by}} = router;

  const [orderBy, setOrderBy] = React.useState(
    order_by || ORDER_BY[0].value
  );

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {band, member: [members, rest]} = useSelector(
    ({orm}) => ({
      band: pickBandSelector(slug)(orm),
      member: memberListSelector(`${slug}_joined`)(orm)
    }),
    (prev, curr) => isEqual(prev, curr)
  ); 

  const withdrawMember = React.useCallback((id: HashId) => {
    confirm('탈퇴 처리하시겠습니까?') && (
      dispatch(appendOrRemoveMemberList({
        slug,
        listKey: `${slug}_joined`,
        memberPk: id,
        type: 'remove'
      }))
    );
  }, [slug]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));

    if (isEmpty(members) && isEmpty(rest)) {
      dispatch(fetchMemberThunk({
        slug,
        sort: 'joined',
        status: 'active',
        option: {order_by: orderBy}
      }));
    }

    if (!isEmpty(members) && orderBy !== rest.orderBy) {
      dispatch(fetchMemberThunk({
        slug,
        sort: 'joined',
        status: 'active',
        option: {order_by: orderBy}
      }));
    }
  }, [slug, orderBy]);

  return {
    ORDER_BY,
    members,
    rest,
    orderBy,
    setOrderBy,
    withdrawMember,
    band
  };
};

export default useBandMember;
