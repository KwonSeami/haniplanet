import {$POINT_BLUE, $WHITE} from "../styles/variables.types";
import {staticUrl} from "../src/constants/env";
import * as React from "react";
import CommonStyleButton from "./CommonStyleButton";
import classNames from "classnames";

interface Props {
  id: HashId | Id;
  is_follow: boolean;
  onClick: () => void;
}

const FollowButton = React.memo<Props>(({id, is_follow, onClick, className}) => {
  return (
    <CommonStyleButton
      color={is_follow && $WHITE}
      backgroundColor={is_follow && $POINT_BLUE}
      onClick={onClick}
      className={classNames("follow-button", [className])}
    >
      {is_follow ? (
        <img
          src={staticUrl('/static/images/icon/check/icon-check3.png')}
          alt="팔로우"
          style={{width: '12px', marginRight: '4px'}}
        />
      ) : (
        <img
          src={staticUrl('/static/images/icon/icon-btn-follow.png')}
          alt="팔로우"
          style={{width: '13px', marginRight: '4px'}}
        />
      )}
      팔로우
    </CommonStyleButton>
  )
});

export default FollowButton;
