/**
 * @param arr - 숫자 배열입니다.
 * @param value - 숫자입니다.
 * 이 함수는 배열이 정렬됐을 경우에만 정상적으로 동작합니다.
 * 이진 탐색을 이용하여, 넘겨준 value에 가장 근접한 arr의 index와 value를 객체 형태로 반환합니다.
 */

const findClosestValue = (arr: number[], value: number) => {
  let mid;
  let low = 0;
  let high = arr.length - 1;

  while((high - low) > 1) {
    mid = Math.floor((low + high) / 2);

    if (arr[mid] < value) {
      low = mid;
    } else {
      high = mid;
    }
  }

  if (value - arr[low] <= arr[high] - value) {
    return {
      index: low,
      value: arr[low]
    };
  }

  return {
    index: high,
    value: arr[high]
  };
};

export default findClosestValue;