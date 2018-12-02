/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const PurchaseAndSaleRouter = {
  path: '/PurchaseAndSale',
  component: Layout,
  redirect: 'noredirect',
  name: 'PurchaseAndSale',
  meta: {
    title: '进销存',
    iconfont: '&#xe653;'
  },
  children: [
    {
      path: 'DataEditing',
      component: () => import('@/views/PurchaseAndSale/DataEditing/DataEditing.vue'), // Parent router-view
      name: 'DataEditing',
      meta: { title: '资料编辑', iconfont: '&#xe671;' },
      redirect: 'noredirect',
      children: [
        {
          path: 'CommodityAdd',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityAdd/CommodityAdd.vue'),
          name: 'CommodityAdd',
          meta: { title: '商品', iconfont: '&#xe627;', id: 1 }
        },
        {
          path: 'CommoditySKUCode',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommoditySKUCode/CommoditySKUCode.vue'),
          name: 'CommoditySKUCode',
          meta: { title: '商品SKU条码', iconfont: '&#xe615;', id: 2 }
        },
        {
          path: 'CommodityPrice',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityPrice/CommodityPrice.vue'),
          name: 'CommodityPrice',
          meta: { title: '商品价格管理', iconfont: '&#xe652;' }
        },
        {
          path: 'CommodityAuxiliary',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CommodityAuxiliary/CommodityAuxiliary.vue'),
          name: 'CommodityAuxiliary',
          meta: { title: '商品辅助资料', iconfont: '&#xe611;' }
        },
        {
          path: 'VIPCustomer',
          component: () => import('@/views/PurchaseAndSale/DataEditing/VIPCustomer/VIPCustomer.vue'),
          name: 'VIPCustomer',
          meta: { title: 'VIP客户', iconfont: '&#xe62a;' }
        },
        {
          path: 'Supplier',
          component: () => import('@/views/PurchaseAndSale/DataEditing/Supplier/Supplier.vue'),
          name: 'Supplier',
          meta: { title: '供应商', iconfont: '&#xe607;' }
        },
        {
          path: 'Warehouse',
          component: () => import('@/views/PurchaseAndSale/DataEditing/Warehouse/Warehouse.vue'),
          name: 'Warehouse',
          meta: { title: '仓库信息', iconfont: '&#xe643;' }
        },
        {
          path: 'StaffInformation',
          component: () => import('@/views/PurchaseAndSale/DataEditing/StaffInformation/StaffInformation.vue'),
          name: 'StaffInformation',
          meta: { title: '职员部门', iconfont: '&#xe62f;' }
        },
        {
          path: 'BankAccount',
          component: () => import('@/views/PurchaseAndSale/DataEditing/BankAccount/BankAccount.vue'),
          name: 'BankAccount',
          meta: { title: '银行账户', iconfont: '&#xe618;' }
        },
        {
          path: 'CostType',
          component: () => import('@/views/PurchaseAndSale/DataEditing/CostType/CostType.vue'),
          name: 'CostType',
          meta: { title: '费用类型', iconfont: '&#xe610;' }
        },
        {
          path: 'OtherIncome',
          component: () => import('@/views/PurchaseAndSale/DataEditing/OtherIncome/OtherIncome.vue'),
          name: 'OtherIncome',
          meta: { title: '其他费用', iconfont: '&#xe77f;' }
        },
        {
          path: 'PositionAuthority',
          component: () => import('@/views/PurchaseAndSale/DataEditing/PositionAuthority/PositionAuthority.vue'),
          name: 'PositionAuthority',
          meta: { title: '岗位权限', iconfont: '&#xe61f;' }
        },
        {
          path: 'AllStaff',
          component: () => import('@/views/PurchaseAndSale/DataEditing/AllStaff/AllStaff.vue'),
          name: 'AllStaff',
          meta: { title: '全部操作员', iconfont: '&#xe631;' }
        }
      ]
    }
  ]
}
export default PurchaseAndSaleRouter
