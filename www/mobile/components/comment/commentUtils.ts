const blindReasonText = (blindReason, prefix) => {
  switch(blindReason){
    case 'privy':
      return `당사자 요청에 의해 블라인드 처리된 ${prefix}글입니다.`;
    case 'reported':
      return `신고 누적 3건으로, 블라인드 처리된 ${prefix}글입니다.`;
    case 'admin':
      return `관리자에 의해 블라인드 처리된 ${prefix}글입니다.`;
    default:
      return `블라인드 처리된 ${prefix}글입니다.`;
  }
};

export default blindReasonText;