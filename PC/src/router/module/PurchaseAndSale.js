/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const PurchaseAndSaleRouter = {
  path: '/PurchaseAndSale',
  component: Layout,
  redirect: 'noredirect',
  name: 'PurchaseAndSale',
  meta: {
    title: '进销存',
    iconfont: '&#xe653;',
    roles: [1]
  },
  children: [
    {
      path: 'Purchase',
      name: 'Purchase',
      component: () => import('@/views/PurchaseAndSale/Purchase/Purchase.vue'),
      meta: { title: '采购', iconfont: '&#xe671;', roles: [3] },
      redirect: 'noredirect',
      children: [
        {
          path: 'PurchaseOrder',
          component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchaseOrder.vue'),
          name: 'PurchaseOrder',
          meta: { title: '采购订单', iconfont: '&#xe631;', roles: [21] }
        },
        {
          path: 'PurchaseOrderReturn',
          component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchaseOrderReturn.vue'),
          name: 'PurchaseOrderReturn',
          meta: { title: '采购退货申请', iconfont: '&#xe631;', roles: [22] }
        },
        {
          path: 'PurchaseReplacement',
          component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchaseReplacement.vue'),
          name: 'PurchaseReplacement',
          meta: { title: '采购换货申请', iconfont: '&#xe631;', roles: [23] }
        },
        // {
        //   path: 'PurchasingResultOrder',
        //   component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchasingResultOrder.vue'),
        //   name: 'PurchasingResultOrder',
        //   meta: { title: '采购订单结果', iconfont: '&#xe631;', roles:[]}
        // },
        // {
        //   path: 'PurchaseEntry',
        //   component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchaseEntry.vue'),
        //   name: 'PurchaseEntry',
        //   meta: { title: '采购入库单', iconfont: '&#xe631;', roles:[]}
        // },
        {
          path: 'PurchaseAllResult',
          component: () => import('@/views/PurchaseAndSale/Purchase/Pages/PurchaseAllResult.vue'),
          name: 'PurchaseAllResult',
          meta: { title: '采购历史', iconfont: '&#xe631;', roles: [24] }
        }
      ]
    },
    {
      path: 'Sale',
      name: 'Sale',
      component: () => import('@/views/PurchaseAndSale/Sale/Sale.vue'),
      meta: { title: '销售', iconfont: '&#xe671;', roles: [4] },
      redirect: 'noredirect',
      children: [
        {
          path: 'RetailOrder',
          component: () => import('@/views/PurchaseAndSale/Sale/Pages/RetailOrder.vue'),
          name: 'RetailOrder',
          meta: { title: '零售订单', iconfont: '&#xe631;', roles: [25] }
        },
        {
          path: 'SalesOrder',
          component: () => import('@/views/PurchaseAndSale/Sale/Pages/SalesOrder.vue'),
          name: 'SalesOrder',
          meta: { title: '销售订单', iconfont: '&#xe631;', roles: [26] }
        },
        {
          path: 'SalesOrdersReturn',
          component: () => import('@/views/PurchaseAndSale/Sale/Pages/SalesOrdersReturn.vue'),
          name: 'SalesOrdersReturn',
          meta: { title: '销售退货申请', iconfont: '&#xe631;', roles: [27] }
        },
        {
          path: 'SalesReplacement',
          component: () => import('@/views/PurchaseAndSale/Sale/Pages/SalesReplacement.vue'),
          name: 'SalesReplacement',
          meta: { title: '销售换货申请', iconfont: '&#xe631;', roles: [28] }
        },
        // {
        //   path: 'SalesResultOrder',
        //   component: () => import('@/views/PurchaseAndSale/Sale/Pages/SalesResultOrder.vue'),
        //   name: 'SalesResultOrder',
        //   meta: { title: '销售订单结果', iconfont: '&#xe631;', roles:[]}
        // },
        {
          path: 'SalesAllResults',
          component: () => import('@/views/PurchaseAndSale/Sale/Pages/SalesAllResults.vue'),
          name: 'SalesAllResults',
          meta: { title: '销售历史', iconfont: '&#xe631;', roles: [29] }
        }
      ]
    },
    {
      path: 'Fund',
      name: 'Fund',
      component: () => import('@/views/PurchaseAndSale/Fund/Fund.vue'),
      meta: { title: '资金', iconfont: '&#xe671;', roles: [5] },
      redirect: 'noredirect',
      children: [
        {
          path: 'PayByOrder',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/PayByOrder.vue'),
          name: 'PayByOrder',
          meta: { title: '按单付款', iconfont: '&#xe631;', roles: [30] }
        },
        {
          path: 'ReceiptByOrder',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/ReceiptByOrder.vue'),
          name: 'ReceiptByOrder',
          meta: { title: '按单收款', iconfont: '&#xe631;', roles: [31] }
        },
        {
          path: 'ReceiptOrder',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/ReceiptOrder.vue'),
          name: 'ReceiptOrder',
          meta: { title: '收款单', iconfont: '&#xe631;', roles: [32] }
        },
        {
          path: 'PaymentOrder',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/PaymentOrder.vue'),
          name: 'PaymentOrder',
          meta: { title: '付款单', iconfont: '&#xe631;', roles: [33] }
        },
        {
          path: 'AdvanceCollection',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/AdvanceCollection.vue'),
          name: 'AdvanceCollection',
          meta: { title: '预收款', iconfont: '&#xe631;', roles: [34] }
        },
        {
          path: 'AdvanceCharge',
          component: () => import('@/views/PurchaseAndSale/Fund/Pages/AdvanceCharge.vue'),
          name: 'AdvanceCharge',
          meta: { title: '预付款', iconfont: '&#xe631;', roles: [35] }
        }
      ]
    },
    {
      path: 'Warehouse',
      name: 'Warehouse',
      component: () => import('@/views/PurchaseAndSale/Warehouse/Warehouse.vue'),
      meta: { title: '仓库', iconfont: '&#xe671;', roles: [6] },
      redirect: 'noredirect',
      children: [
        {
          path: 'Ship',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/Ship.vue'),
          name: 'Ship',
          meta: { title: '发货', iconfont: '&#xe631;', roles: [36] }
        },
        {
          path: 'Receipt',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/Receipt.vue'),
          name: 'Receipt',
          meta: { title: '收货', iconfont: '&#xe631;', roles: [37] }
        },
        {
          path: 'OtherEntryOrder',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/OtherEntryOrder.vue'),
          name: 'OtherEntryOrder',
          meta: { title: '其他入库单', iconfont: '&#xe631;', roles: [38] }
        },
        {
          path: 'OtherOutOrder',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/OtherOutOrder.vue'),
          name: 'OtherOutOrder',
          meta: { title: '其他出库单', iconfont: '&#xe631;', roles: [39] }
        },
        {
          path: 'NewspaperOverflowOrder',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/NewspaperOverflowOrder.vue'),
          name: 'NewspaperOverflowOrder',
          meta: { title: '报溢单', iconfont: '&#xe631;', roles: [40] }
        },
        {
          path: 'ReportLossOrder',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/ReportLossOrder.vue'),
          name: 'ReportLossOrder',
          meta: { title: '报损单', iconfont: '&#xe631;', roles: [41] }
        },
        {
          path: 'CostAdjustmentOrder',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/CostAdjustmentOrder.vue'),
          name: 'CostAdjustmentOrder',
          meta: { title: '成本调价', iconfont: '&#xe631;', roles: [42] }
        },
        {
          path: 'StockTaking',
          component: () => import('@/views/PurchaseAndSale/Warehouse/Pages/StockTaking.vue'),
          name: 'StockTaking',
          meta: { title: '库存盘点', iconfont: '&#xe631;', roles: [54] }
        }
      ]
    },
    {
      path: 'Marketing',
      name: 'Marketing',
      component: () => import('@/views/PurchaseAndSale/Marketing/Marketing.vue'),
      meta: { title: '营销', iconfont: '&#xe671;', roles: [7] },
      redirect: 'noredirect',
      children: [
        {
          path: 'Coupon',
          component: () => import('@/views/PurchaseAndSale/Marketing/Pages/Coupon.vue'),
          name: 'Coupon',
          meta: { title: '优惠券', iconfont: '&#xe631;', roles: [43] }
        }
      ]
    },
    {
      path: 'Report',
      name: 'Report',
      component: () => import('@/views/PurchaseAndSale/Report/Report.vue'),
      meta: { title: '报表', iconfont: '&#xe671;', roles: [8] },
      redirect: 'noredirect',
      children: [
        {
          path: 'SearchStock',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/SearchStock.vue'),
          name: 'SearchStock',
          meta: { title: '查库存', iconfont: '&#xe631;', roles: [44] }
        },
        {
          path: 'CostChecking',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/CostChecking.vue'),
          name: 'CostChecking',
          meta: { title: '查费用', iconfont: '&#xe631;', roles: [45] }
        },
        {
          path: 'MoneyCollected',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/MoneyCollected.vue'),
          name: 'MoneyCollected',
          meta: { title: '查回款', iconfont: '&#xe631;', roles: [46] }
        },
        {
          path: 'CheckingFunds',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/CheckingFunds.vue'),
          name: 'CheckingFunds',
          meta: { title: '查资金', iconfont: '&#xe631;', roles: [47] }
        },
        {
          path: 'InventoryAnalysis',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/InventoryAnalysis.vue'),
          name: 'InventoryAnalysis',
          meta: { title: '库存报表', iconfont: '&#xe631;', roles: [48] }
        },
        {
          path: 'OrderStatistics',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/OrderStatistics.vue'),
          name: 'OrderStatistics',
          meta: { title: '订单统计', iconfont: '&#xe631;', roles: [52] }
        },
        {
          path: 'SalesReport',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/SalesReport.vue'),
          name: 'SalesReport',
          meta: { title: '销售报表', iconfont: '&#xe631;', roles: [53] }
        },
        {
          path: 'ManagementCenter',
          component: () => import('@/views/PurchaseAndSale/Report/Pages/ManagementCenter.vue'),
          name: 'ManagementCenter',
          meta: { title: '经营中心', iconfont: '&#xe631;', roles: [55] }
        }
      ]
    },
    {
      path: 'DataEditing',
      component: () => import('@/views/PurchaseAndSale/DataEditing/DataEditing.vue'), // Parent router-view
      name: 'DataEditing',
      meta: { title: '资料编辑', iconfont: '&#xe671;', roles: [2] },
      redirect: 'noredirect',
      children: [
        {
          path: 'CommodityAdd',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityAdd/CommodityAdd.vue'),
          name: 'CommodityAdd',
          meta: { title: '商品', iconfont: '&#xe627;', roles: [10] }
        },
        // {
        //   path: 'CommoditySKUCode',
        //   component: () => import('@/views/PurchaseAndSale/DataEditing/CommoditySKUCode/CommoditySKUCode.vue'),
        //   name: 'CommoditySKUCode',
        //   meta: { title: '商品SKU条码', iconfont: '&#xe615;', id: 4 }
        // },
        // {
        //   path: 'CommodityPrice',
        //   component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityPrice/CommodityPrice.vue'),
        //   name: 'CommodityPrice',
        //   meta: { title: '商品价格管理', iconfont: '&#xe652;', roles:[]}
        // },
        {
          path: 'CommodityAuxiliary',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityAuxiliary/CommodityAuxiliary.vue'),
          name: 'CommodityAuxiliary',
          meta: { title: '商品辅助资料', iconfont: '&#xe611;', roles: [11] }
        },
        {
          path: 'VIPCustomer',
          component: () => import('@/views/PurchaseAndSale/DataEditing/VIPCustomer/VIPCustomer.vue'),
          name: 'VIPCustomer',
          meta: { title: 'VIP客户', iconfont: '&#xe62a;', roles: [12] }
        },
        {
          path: 'ClientsLevels',
          component: () => import('@/views/PurchaseAndSale/DataEditing/ClientsLevels/ClientsLevels.vue'),
          name: 'ClientsLevels',
          meta: { title: '客户级别', iconfont: '&#xe62a;', roles: [13] }
        },
        {
          path: 'MembershipNumber',
          component: () => import('@/views/PurchaseAndSale/DataEditing/MembershipNumber/MembershipNumber.vue'),
          name: 'MembershipNumber',
          meta: { title: '会员卡', iconfont: '&#xe62a;', roles: [14] }
        },
        {
          path: 'Supplier',
          component: () => import('@/views/PurchaseAndSale/DataEditing/Supplier/Supplier.vue'),
          name: 'Supplier',
          meta: { title: '供应商', iconfont: '&#xe607;', roles: [15] }
        },
        {
          path: 'Warehouse',
          component: () => import('@/views/PurchaseAndSale/DataEditing/Warehouse/Warehouse.vue'),
          name: 'Warehouse',
          meta: { title: '仓库信息', iconfont: '&#xe643;', roles: [16] }
        },
        {
          path: 'BankAccount',
          component: () => import('@/views/PurchaseAndSale/DataEditing/BankAccount/BankAccount.vue'),
          name: 'BankAccount',
          meta: { title: '银行账户', iconfont: '&#xe618;', roles: [17] }
        },
        {
          path: 'CostType',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CostType/CostType.vue'),
          name: 'CostType',
          meta: { title: '费用类型', iconfont: '&#xe610;', roles: [18] }
        },
        /* {
          path: 'OtherIncome',
          component: () => import('@/views/PurchaseAndSale/DataEditing/OtherIncome/OtherIncome.vue'),
          name: 'OtherIncome',
          meta: { title: '其他费用', iconfont: '&#xe77f;', roles:[]}
        },*/
        {
          path: 'StaffInformation',
          component: () => import('@/views/PurchaseAndSale/DataEditing/StaffInformation/StaffInformation.vue'),
          name: 'StaffInformation',
          meta: { title: '角色信息', iconfont: '&#xe62f;', roles: [19] }
        },
        // {
        //   path: 'PositionAuthority',
        //   component: () => import('@/views/PurchaseAndSale/DataEditing/PositionAuthority/PositionAuthority.vue'),
        //   name: 'PositionAuthority',
        //   meta: { title: '岗位权限', iconfont: '&#xe61f;', roles:[]}
        // },
        {
          path: 'AllStaff',
          component: () => import('@/views/PurchaseAndSale/DataEditing/AllStaff/AllStaff.vue'),
          name: 'AllStaff',
          meta: { title: '全部操作员', iconfont: '&#xe631;', roles: [20] }
        }
      ]
    },
    {
      path: 'Setting',
      name: 'Setting',
      component: () => import('@/views/PurchaseAndSale/Setting/Setting.vue'),
      meta: { title: '设置', iconfont: '&#xe671;', roles: [9] },
      redirect: 'noredirect',
      children: [
        {
          path: 'InitialInventoryPeriod',
          component: () => import('@/views/PurchaseAndSale/Setting/Pages/InitialInventoryPeriod.vue'),
          name: 'InitialInventoryPeriod',
          meta: { title: '库存期初', iconfont: '&#xe631;', roles: [49] }
        },
        {
          path: 'BankOpening',
          component: () => import('@/views/PurchaseAndSale/Setting/Pages/BankOpening.vue'),
          name: 'BankOpening',
          meta: { title: '银行现金期初', iconfont: '&#xe631;', roles: [50] }
        },
        {
          path: 'StockEarlyWarning',
          component: () => import('@/views/PurchaseAndSale/Setting/Pages/StockEarlyWarning.vue'),
          name: 'StockEarlyWarning',
          meta: { title: '库存预警', iconfont: '&#xe631;', roles: [51] }
        }
      ]
    }

  ]
}
export default PurchaseAndSaleRouter
