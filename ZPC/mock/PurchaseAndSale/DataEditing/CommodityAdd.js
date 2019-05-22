const commodityList =
  [{
    img: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    commodityName: '马连帽卫衣男2018秋季男',
    commodityAtrNo: 'ml002000081',
    commodityCode: '101',
    commodityBrand: '耐克',
    commodityUnit: '件',
    commodityStock: '123',
    commodityScore: '12312',
    commodityRetail: '123123',
    commodityVip: '3213123'
  }, {
    img: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    commodityName: '马连帽卫衣男2018秋123季男',
    commodityAtrNo: 'ml002000082',
    commodityCode: '102',
    commodityBrand: '啊克',
    commodityUnit: '件',
    commodityStock: '123',
    commodityScore: '12312',
    commodityRetail: '123123',
    commodityVip: '3213123'
  }]

export default {
  '/data/commodity': config => {
    return commodityList
  }
}

