/**
 * Return the last element in an array
 * @param arr the array
 * @returns   last element in the array (could be undefined)
 */
export default function lastArrEle<T>(arr: T[]) {
  return arr[arr.length - 1]
}