import * as React from 'react';
import styled from 'styled-components';
import AdditionalContentItemMobile from '../AdditionalContentItem/AdditionalContentItemMobile';
import MoaItemMobile from './MoaItem/MoaItemMobile';
import NoContent from '../../../NoContent/NoContent';
import getMyMoaList from './getMyMoaList';
import {$BORDER_COLOR} from '../../../../styles/variables.types';
import Link from 'next/link';
import {staticUrl} from '../../../../src/constants/env';

const Ul = styled.ul`
  margin-top: 13px;
  border-top: 1px solid ${$BORDER_COLOR};
`;

const StyledNoContent = styled(NoContent)`
  margin-top: 12px;
  height: 111px;
  text-align: center;
  background-position: 100% -14px;
  background-size: 177px;
  padding-left: 0;
`;

const MyMoaMobile = React.memo(() => {
  const myMoaList = getMyMoaList('["moa", "consultant"]');

  if (!myMoaList) {
    return null;
  }

  return (
    <AdditionalContentItemMobile
      title="나의 MOA"
      to="/band"
    >
      <>
        {!!myMoaList.length ? (
          <Ul>
            {myMoaList.map(({avatar, slug, name, new_story_count}, idx) => (
              idx < 3 && (
                <MoaItemMobile
                  key={name}
                  slug={slug}
                  avatar={avatar}
                  name={name}
                  new_story_count={new_story_count}
                />
              )
            ))}
          </Ul>
        ) : (
          <Link href="/band">
            <a>
              <StyledNoContent backgroundImg={staticUrl('/static/images/banner/img-nocontent-moa.png')}>
                <span>MOA</span>에 가입해보세요!
              </StyledNoContent>
            </a>
          </Link>
        )}
      </>
    </AdditionalContentItemMobile>
  );
});

MyMoaMobile.displayName = 'MyMoaMobile';
export default MyMoaMobile;
