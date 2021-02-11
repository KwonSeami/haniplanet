const getPageGroupCount = (currentPage: number, maximum: number, groupCount = 10) => {
  const base = Math.floor(currentPage / groupCount);

  const min = currentPage % groupCount === 0
    ? currentPage - groupCount + 1
    : base * groupCount + 1;
  const _max = currentPage % groupCount === 0
    ? currentPage
    : base * groupCount + groupCount;
  const max = _max > maximum ? maximum : _max;

  return [min, max];
};

export default getPageGroupCount;