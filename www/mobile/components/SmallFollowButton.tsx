import {followUser} from "../src/reducers/orm/user/follow/thunks";
import {staticUrl} from "../src/constants/env";
import * as React from "react";
import styled from "styled-components";
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $WHITE} from "../styles/variables.types";
import {fontStyleMixin, inlineBlockMixin} from "../styles/mixins.styles";


const Btn = styled.button<{
  isFollow?: boolean;
}>`
  position: absolute;
  z-index: 1;
  text-align: center;
  border: 1px solid ${$BORDER_COLOR};
  background-color: ${$WHITE};
  box-sizing: border-box;
  ${props => props.isFollow && fontStyleMixin({
  size: 11,
  weight: 'bold',
  color: `${props.isFollow ? $POINT_BLUE : $FONT_COLOR}`
})};
  

  img {
    ${inlineBlockMixin(7)};
    margin: -3px 0 0;
  }
`;

interface Props {
  onClick: () => void;
  is_follow: boolean;
}

const SmallFollowButton = React.memo<Props>(({onClick, is_follow}) => {
  return (
    <Btn
      onClick={onClick}
      isFollow={is_follow}
      className="small-follow-button"
    >
      {is_follow ? (
        <img
          src={staticUrl('/static/images/icon/check/icon-check2.png')}
          alt="팔로우"
        />
      ) : (
        <img
          src={staticUrl('/static/images/icon/icon-mini-plus.png')}
          alt="팔로우"
        />
      )}
      &nbsp;팔로우
    </Btn>
  )
});

export default SmallFollowButton;
