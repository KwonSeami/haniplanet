import {TYPE_GRADIENT} from "../../components/community/common";

export const communityUserTypeGradient = (userType) => 
  userType ? TYPE_GRADIENT[userType] : TYPE_GRADIENT.default;

export const checkOnlinePage = (name: string) => ['온·오프 강의요청', '온·오프 강의후기'].includes(name);