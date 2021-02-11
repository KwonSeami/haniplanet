export const ADMIN_PERMISSION_GRADE = ['admin', 'owner', 'staff'];

export const NAME_BY_EXPOSE_TYPE = {
  nick: {
    korName: '닉네임',
    engName: 'nick_name'
  },
  real: { 
    korName: '실명',
    engName: 'name'
  }
};

export const nameByExposeType = (userExposeType, memberData) => {
  switch (userExposeType) {
    case 'anon':
      return ['아이디', memberData.user.auth_id];
    case 'real':
      return ['실명', memberData.user.name];
    case 'nick':
      return ['닉네임', memberData.user.nick_name];
    default:
      return ['', ''];
  }
};
