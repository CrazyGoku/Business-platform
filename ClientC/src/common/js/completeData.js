export function completeData(data) {
   //  补齐3的倍数
  if (data.length > 0) {
    let extraNum = data.length % 3 > 0 ? 3 - data.length % 3 : 0;
    let emptyItem = {};
    while (extraNum > 0) {
      data.push(emptyItem);
      extraNum--;
    }
  }
  return data;
}
