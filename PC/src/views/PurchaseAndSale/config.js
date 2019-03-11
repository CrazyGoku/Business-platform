export const statusMap = {
  1: '未收',
  2: '部分收',
  3: '已收',
  4: '未发',
  5: '部分发',
  6: '已发',
  7: '未收未发',
  8: '未收部分发',
  9: '未收已发',
  10: '部分收未发',
  11: '部分收部分发',
  12: '部分收已发',
  13: '已收未发',
  14: '已收部分发',
  15: '已收已发'
}
export const disabledMap = {
  1: '禁用',
  0: '启用'
}
export const clearMap = {
  '1': '已结算',
  '0': '未结算'
}
export const orderDetailMap = [
  { key: 'id', name: '订单编号' },
  { key: 'goodsName', name: '商品名称' },
  { key: 'goodsSkuSku', name: '商品规格' },
  { key: 'discountMoney', name: '折扣' },
  { key: 'inTotalQuantity', name: '入库总量' },
  { key: 'inWarehouseName', name: '入库名称' },
  { key: 'goodsBarCode', name: '商品条形码' },
  { key: 'goodsId', name: '商品货号' },
  { key: 'money', name: '金额' },
  { key: 'quantity', name: '总量' },
  { key: 'remark', name: '备注' },
  { key: 'clearStatus', name: '结算状态' },
  { key: 'clearedMoney', name: '已结算金额' },
  { key: 'createTime', name: '日期' },
  { key: 'inNotReceivedQuantity', name: '未收数量' },
  { key: 'inReceivedQuantity', name: '收到数量' },
  { key: 'notClearedMoney', name: '未结算金额' },
  { key: 'orderMoney', name: '订单金额' },
  { key: 'orderStatus', name: '订单状态' },
  { key: 'supplierName', name: '供应商名称' },
  { key: 'totalDiscountMoney', name: '总优惠金额' },
  { key: 'totalMoney', name: '总金额' },
  { key: 'userName', name: '经手人' }
]
