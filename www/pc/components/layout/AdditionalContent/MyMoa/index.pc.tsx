import * as React from 'react';
import styled from 'styled-components';
import AdditionalContentItemPC from '../AdditionalContentItem/AdditionalContentItemPC';
import MoaItem from './MoaItem/MoaItemPC';
import getMyMoaList from './getMyMoaList';
import NoContent from '../../../NoContent/NoContent';
import {staticUrl} from '../../../../src/constants/env';
import Loading from '../../../common/Loading';

const Div = styled.ul`
  padding-top: 15px;
`;

const MyMoaPC = React.memo(() => {
  const myMoaList = getMyMoaList('["moa", "consultant"]');

  if (!myMoaList) { return <Loading/>; }

  return (
    <AdditionalContentItemPC
      title="나의 MOA"
      to="/band"
    >
      <Div>
        {!!myMoaList.length ? (
          <ul>
            {myMoaList.map(({avatar, slug, name, new_story_count}, idx) => (
              idx < 3 && (
                <MoaItem
                  key={name}
                  slug={slug}
                  avatar={avatar}
                  name={name}
                  new_story_count={new_story_count}
                />
              )
            ))}
          </ul>
        ) : (
          <NoContent backgroundImg={staticUrl('/static/images/banner/img-nocontent-moa.png')}>
            <span>MOA</span>에 가입해보세요!
          </NoContent>
        )}
      </Div>
    </AdditionalContentItemPC>
  );
});

MyMoaPC.displayName = 'MyMoaPC';
export default MyMoaPC;
