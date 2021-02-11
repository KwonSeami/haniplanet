import {USER_TYPE_COLOR} from "../../components/community/common";

export const communityUserTypeColor = (userType) => 
 userType ? USER_TYPE_COLOR[userType] : USER_TYPE_COLOR.default

export const checkOnlinePage = (name: string) => ['온·오프 강의요청', '온·오프 강의후기'].includes(name);
