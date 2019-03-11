export const DEFAULT_BRANCH_INDEX_DATA = [{
  'name': '相近营业部'
},
{
  'name': '关注营业部'
}
]
export const SIMILAR_BRANCH = 1
export const FOCUS_BRANCH = 2
export class DEFAULT_DATE_DATA {
  constructor () {
    this.data = [{
      id: 1,
      name: '本日',
      key: 'day',
      disable: false
    },
    {
      id: 2,
      name: '本月',
      key: 'month',
      disable: false
    },
    {
      id: 3,
      name: '本年',
      key: 'year',
      disable: false
    }
    ]
  }
};
export class line {
  constructor () {
    this.data = {
      name: 'line',
      legend: {
        show: false
      },
      grid: {
        left: 50,
        right: 14,
        top: 30,
        bottom: 28
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D0D9E3'
          },
          symbol: ['none', 'arrow'],
          symbolSize: [3, 6]
        },
        axisLabel: {
          margin: 3,
          textStyle: {
            fontSize: 11
          }
        },
        data: []
      },
      yAxis: {
        show: true,
        name: '',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          padding: [0, 0, 0, 30],
          fontSize: 11,
          color: '#D0D9E3'
        },
        type: 'value',
        splitNumber: 3,
        min: 'dataMin',
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D0D9E3'
          },
          symbol: ['none', 'arrow'],
          symbolSize: [3, 6]
        },
        axisLabel: {
          verticalAlign: 'bottom',
          inside: true,
          margin: 7,
          textStyle: {
            fontSize: 11,
            fontWeight: 'lighter'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#D0D9E3',
            width: 0.3
          }
        }
      },
      series: [],
      tooltip: {
        show: true,
        confine: true,
        backgroundColor: '#4989DF',
        axisPointer: {
          z: 0,
          lineStyle: {
            color: '#4DA9FF',
            width: 0.5
          }
        },
        trigger: 'axis'
      }
    }
  }
};
export class lineSeries {
  constructor () {
    this.data = {
      type: 'line',
      smooth: true,
      showSymbol: false,
      lineStyle: {
        color: '#4DA9FF'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(77, 169, 255, 0.64)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(255, 255, 255, 0)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      itemStyle: {
        color: '#4DA9FF',
        borderWidth: 2
      },
      data: []
      // markPoint: {
      //   data: [
      //     {
      //       name: '最大值',
      //       type: 'max',
      //       valueDim: 'x',
      //       symbol: 'circle',
      //       symbolSize: 11,
      //       label: {
      //         show: false
      //       },
      //       itemStyle: {
      //         color: '#FFF',
      //         borderColor: '#4DA9FF',
      //         borderWidth: 2
      //       }
      //     },
      //     {
      //       name: '最大值',
      //       type: 'max',
      //       valueIndex: 0,
      //       valueDim: 'x',
      //       symbol: 'path://M550 144a30 30 0 0 1 30 -30h60a30 30 0 0 1 30 30v0a30 30 0 0 1 -30 30h-60a30 30 0 0 1 -30 -30z',
      //       symbolSize: [60, 30],
      //       symbolOffset: [-40, -20],
      //       label: {
      //         show: true,
      //         formatter: '',
      //         fontWeight: 'normal'
      //       },
      //       itemStyle: {
      //         color: '#4DA9FF',
      //         borderWidth: 0
      //       }
      //     },
      //     {
      //       name: '最大值',
      //       type: 'max',
      //       valueIndex: 0,
      //       valueDim: 'x',
      //       symbol: 'path://M321,938 L620.781062,938 C622.157412,938 623.472896,937.432648 624.417523,936.431639 L635.858455,924.307838 C636.9956,923.10282 638.894298,923.047799 640.099316,924.184944 C640.143795,924.226918 640.18698,924.270242 640.228811,924.314856 L651.578806,936.419942 C652.524031,937.428052 653.844338,938 655.22627,938 L715,938 C719.418278,938 723,941.581722 723,946 L723,1036 C723,1040.41828 719.418278,1044 715,1044 L321,1044 C316.581722,1044 313,1040.41828 313,1036 L313,946 C313,941.581722 316.581722,938 321,938 Z',
      //       symbolSize: [0, 0],
      //       symbolOffset: [-105, 23],
      //       label: {
      //         show: true,
      //         offset: [0, 3],
      //         rich: {
      //           a: {
      //             color: '#fff',
      //             lineHeight: 20,
      //             fontSize: 14,
      //             textBorderWidth: 0,
      //             textBorderColor: '#fff',
      //             fontWeight: 'lighter'
      //           }
      //         },
      //         formatter: () => {
      //           var text = '对准指向这个地方对准指向这个地方对准指向这个地方';
      //           text = text.replace(/\S{14}/g, function(match) {
      //             return match + '\n';
      //           });
      //           return '{a|' + text + '}';
      //         }
      //       },
      //       itemStyle: {
      //         color: '#3F69C2',
      //         borderWidth: 0
      //       }
      //     }
      //   ]
      // }
    }
  }
}
export const radar = {
  name: 'radar',
  color: ['#4B9EF6', '#FF9800', '#FF5959', '#02B4D6', '#BC9BF6', '#EDC301'],
  legend: {
    icon: 'path://M28,4h-7.9c-0.8-2-2.8-3.5-5.1-3.5S10.7,2,9.9,4H2C0.9,4,0,4.9,0,6s0.9,2,2,2h7.9c0.8,2,2.8,3.5,5.1,3.5S19.3,10,20.1,8H28c1.1,0,2-0.9,2-2S29.1,4,28,4z M15,8.5c-1.4,0-2.5-1.1-2.5-2.5c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5C17.5,7.4,16.4,8.5,15,8.5z',
    itemWidth: 16,
    itemHeight: 7,
    textStyle: {
      padding: [4, 10, 4, 0]
    },
    data: [],
    itemGap: 10,
    top: 10
  },
  radar: {
    // shape: 'circle',
    radius: '59%',
    center: ['50%', '58%'],
    nameGap: 5,
    indicator: [],
    name: {
      rich: {
        a: {
          lineHeight: 20,
          color: '#424242',
          fontSize: 14
        }
      },
      formatter: (text) => {
        text = text.length <= 5 ? text : text.replace(/\S{5}/g, function (match) {
          return match + '\n'
        })
        return '{a|' + text + '}'
      }
    },
    // scale: true,
    splitNumber: 6,
    splitLine: {
      lineStyle: {
        color: '#EFF2F5'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#EFF2F5'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: '#FFF'
      }
    }
  },
  series: [{
    name: '排名分布',
    type: 'radar',
    symbolSize: 4,
    // areaStyle: {normal: {}},
    data: []
  }],
  tooltip: {
    show: true,
    trigger: 'item',
    confine: true,
    backgroundColor: '',
    formatter: function (params) {
      // radar.tooltip.backgroundColor = radar.tooltip.colorList[params.dataIndex];
      let res = params.name + '<br/>'
      let indicator = radar.radar.indicator
      let indexUnit = radar.radar.indexUnit
      let displayValueArray = radar.radar.displayValueArray
      displayValueArray[params.dataIndex].forEach((item, k) => {
        res = res + indicator[k].name + ': ' + item + indexUnit[k] + '<br/>'
      })
      return '<div style="padding: 5px; opacity: 0.9; border-radius: 3px; background:' + params.color + '">' + res + '</div'
    }
  }
}
export const DEFAULT_SUPER_INDEX = [{
  id: 0,
  name: '总体经营情况',
  key: '01',
  lineMoudle: true,
  productMoudle: false,
  radarMoudle: true,
  pieMoudle: true

},
{
  id: 1,
  name: '增量拓展',
  key: '02',
  lineMoudle: true,
  productMoudle: false,
  radarMoudle: true,
  pieMoudle: false
},
{
  id: 2,
  name: '融资融券',
  key: '03',
  lineMoudle: true,
  productMoudle: false,
  radarMoudle: true,
  pieMoudle: false
},
{
  id: 3,
  name: '增值服务',
  key: '04',
  lineMoudle: true,
  productMoudle: false,
  radarMoudle: true,
  pieMoudle: false
},
{
  id: 4,
  name: '产品销售',
  key: '05',
  lineMoudle: true,
  productMoudle: true,
  radarMoudle: true,
  pieMoudle: false
}
]

export class Barstack {
  constructor () {
    this.data = {
      title: {
        text: '自营权益类投资风险—规模',
        textStyle: {
          color: '#424242',
          fontSize: '15',
          fontFamily: 'PingFangSC-Regular',
          fontWeight: '400'

        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'

        }
      },
      legend: {
        left: '20%',
        data: [
          '\n',
          '\n',
          '\n',
          '回购资金',
          '货币型基金',
          '可转债',
          '股票',
          '股票型基金'

        ]
      },
      grid: {
        left: '35',
        right: '4%',
        bottom: '4%',
        height: '60%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: ['02-28', '03-28', '04-28', '05-28', '06-28'],
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [4, 8],
          lineStyle: {
            color: '#D0D9E3'
          }
        },
        axisTick: {
          show: false
        },
        splitArea: {
          interval: 2
        }

      }],
      yAxis: [{
        type: 'value',
        // 坐标轴名称
        name: '（万）',
        nameGap: 15,
        nameTextStyle: {
          padding: [0, 0, 0, 35]
        },
        axisLine: { // 刻度线
          symbol: ['none', 'arrow'],
          symbolSize: [4, 8],
          symbolOffset: 20,
          lineStyle: {
            color: '#D0D9E3',
            shadowColor: '#D0D9E3',
            shadowOffsetY: -15

          }
        },
        splitLine: { // 网格线
          lineStyle: {
            shadowColor: '#D0D9E3',
            shadowOffsetX: -25
          }
        },
        axisTick: { // 坐标轴刻度
          show: false
        },
        axisLabel: { // 标签文字
          inside: true,
          verticalAlign: 'bottom',
          formatter: `{value}`,
          padding: [0, 0, 2, 0]
        },
        offset: 25 // 把y往右移动25
      }],
      series: [{
        name: '回购资金',
        type: 'bar',
        stack: 'assets',
        barWidth: 15,
        itemStyle: {
          normal: {
            color: 'rgba(238,247,255,1)',
            borderColor: '#549DE9'
          }
        },
        data: [320, 332, -121, 334, 390]

      },
      {
        name: '货币型基金',
        type: 'bar',
        stack: 'assets',
        barWidth: 15,
        itemStyle: {
          normal: {
            color: 'rgba(254,243,243,1)',
            borderColor: '#FF7171'
          }
        },
        data: [120, 132, 101, 134, 90 ]
      },
      {
        name: '可转债',
        type: 'bar',
        stack: 'assets',
        barWidth: 15,
        itemStyle: {
          normal: {
            color: 'rgba(255,245,230,1)',
            borderColor: '#FF9800'
          }
        },
        data: [220, 182, 191, 234, 290]
      },
      {
        name: '股票',
        type: 'bar',
        stack: 'assets',
        itemStyle: {
          normal: {
            color: 'rgba(241,255,247,1)',
            borderColor: '#15B660'
          }
        },
        data: [150, 232, 201, 154, 190]
      },
      {
        name: '股票型基金',
        type: 'bar',
        barWidth: 15,
        itemStyle: {
          normal: {
            color: 'rgba(238,252,254,1)',
            borderColor: '#02B4D6'
          }
        },
        stack: 'assets',
        data: [862, 1018, 964, 1026, 1679 ]
      }
      ]
    }
  }
}

var xAxisData = []
var data1 = []
var data2 = []
var data3 = []
var data4 = []

for (var i = 0; i < 4; i++) {
  xAxisData.push('Class' + i)
  data1.push((Math.random() * 2).toFixed(2))
  data2.push(-Math.random().toFixed(2))
  data3.push((Math.random() * 5).toFixed(2))
  data4.push((Math.random() + 0.3).toFixed(2))
}

export class reversebar {
  constructor () {
    this.data = {
      backgroundColor: '#eee',
      legend: {
        data: ['bar', 'bar2', 'bar3', 'bar4'],
        align: 'left',
        left: 10
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack', 'tiled']
          },
          dataView: {}
        }
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['02-28', '03-28', '04-28', '05-28' ],
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [4, 8],
          lineStyle: {
            color: '#D0D9E3'
          }
        },
        axisTick: {
          show: false
        },
        splitArea: {
          interval: 2
        }

      },
      yAxis: {
        type: 'value',
        // 坐标轴名称
        name: '（万）',
        nameGap: 15,
        nameTextStyle: {
          padding: [0, 0, 0, 35]
        },
        axisLine: { // 刻度线
          symbol: ['none', 'arrow'],
          symbolSize: [4, 8],
          symbolOffset: 20,
          lineStyle: {
            color: '#D0D9E3',
            shadowColor: '#D0D9E3',
            shadowOffsetY: -15

          }
        },
        splitLine: { // 网格线
          lineStyle: {
            shadowColor: '#D0D9E3',
            shadowOffsetX: -25
          }
        },
        axisTick: { // 坐标轴刻度
          show: false
        },
        axisLabel: { // 标签文字
          inside: true,
          verticalAlign: 'bottom',
          formatter: `{value}`,
          padding: [0, 0, 2, 0]
        },
        offset: 25 // 把y往右移动25
      },
      series: [{
        name: 'bar',
        type: 'bar',
        stack: 'one',
        itemStyle: {
          normal: {
            color: '#EEF7FF',
            borderColor: '#549DE9'
          }
        },
        data: [0.71, 0.71, 0.71, 0.71]
      },
      {
        name: 'bar2',
        type: 'bar',
        stack: 'two',
        itemStyle: {
          normal: {
            color: '#FEF3F3',
            borderColor: '#FF7171'
          }
        },
        data: [1.76, 1.61, 2.88, 3.41]
      },
      {
        name: 'bar3',
        type: 'bar',
        stack: 'three',
        itemStyle: {
          normal: {
            color: '#FFF3DF',
            borderColor: '#FF9800'
          }
        },
        data: [-1.05, -0.98, -3.33, -2.41]
      }
      ]
    }
  }
}
