import expandRow from './labPlTable-expand.vue'
import {coinFullName, helpUrl, helpUrlArr} from '../../libs/config'

export default that => (root, bool, isH5) => {
  let h5Td2Width = 0, h5Td3Width = 0;
  if(root.$el){
    if(root.$el.clientWidth && root.$el.clientWidth > 0){
      let cW = root.$el.clientWidth - 110 - 25 - 30;
      h5Td2Width = cW*0.4;
      h5Td3Width = cW*0.6;
    }
  }

  var expand = {
    type: 'expand',
    width: 25,
    className:'expandBox',
    render: (h, params) => h(expandRow,
      { props: { data: params.row, that } }
    )
  }
  var columnsArr = [
    {
      key: 'coinType',
      className:'th-coin',
      //width:200,
      renderHeader: (h, params) => {
        return h('div',{
          class:'th-first'
        },[
          h('span', root.$t('home.table.th1'))
        ])
      },
      render: (h, params) => {
        const {coinType} = params.row;
        return h('span', {
          class:'coin-col'
        },[
          h('img', {
            class: 'coinType-img',
            attrs:{
              src:that.$U.requireCurrencyImg(`${coinType}.png`)
            }
          }, ''),
          h('span', {
            class:'coin-typ'
          }, [
            h('span', coinType),
            h('span', {class: 'coin-fullName'}, coinFullName[coinType])
          ])
        ])
      }
    },
    {
      title: root.$t('home.table.th2'),
      key: 'poolHashrate',
      align:'right',
      className:'th-hash',
      //width:200,
      render: (h, params) => {
        const {poolHashrate, poolHashrateUnit} = params.row;
        return h('span', [
          h('span', poolHashrate),
          h('span', {class: 'hash-unit'}, poolHashrateUnit)
        ])
      }
    },
    {
      key: 'coinPriceCny',
      align: 'right',
      //width:280,
      className:'th-price worker-col',
      renderHeader: (h, params) => {
        return h('div',[
          h('span', root.$t('home.table.th3')),
          h('span',{
            class:'rejectRatio-icon'
          }, [
            h('span','i'),
            h('span',{
              class:'rejectRatio-icon-tip'
            }, root.$t('home.table.th3Tip'))
          ])
        ])
      },
      render: (h, params) => {
        const {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType,
          calculateUnit, coinUnit, coinCoefficient, miningType, feePercent} = params.row;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '';

        //let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward * (1 - feePercent);
        let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        if (C < Math.pow(10, -7)) C = 0;

        const calUnit = that.$U.selectUnit(calculateUnit) ? that.$U.selectUnit(calculateUnit) : coinUnit.split('/')[0];
        if (that.settleAccount == "RMB") {
          incomeSettleUnit = '￥';
          coinPrice = that.$U.fNum(coinPriceCny * C, 4);
        } else if (that.settleAccount === 'USD') {
          incomeSettleUnit = '$';
          coinPrice = that.$U.fNum(coinPriceUsd * C, 4);
        }
        
        return h('span', [ 
          h('span', incomeSettleUnit), 
          h('span', coinPrice), 
          h('span', {class: 'hash-unit'}, `/${calUnit}`) 
        ])
      }
    },
    {
      title: root.$t('home.table.th4'),
      key: 'minimumPayment',
      align: 'center',
      className:'th-pay',
      render: (h, params) => {
        const {minimumPayment, coinType} = params.row;
        let coinTypeStr = coinType;
        if(coinType.indexOf("DGB") !== -1){
          coinTypeStr = coinType.split("_")[0];
        }
        return h('span', [  
          h('span', minimumPayment), 
          h('span', {class: 'hash-unit'}, coinTypeStr) 
        ])
      }
    },
    {
      title: root.$t('home.table.th5'),
      key: 'miningType',
      align: 'left',
      className:'th-mType',
      //width:200,
      render: (h, params) => {
        const {miningType} = params.row;
        return h('span',{class: ''}, miningType)
      }
    },
    {
      title: root.$t('home.minghlp'),
      key: '',
      align: 'center',
      className:'th-help',
      width:that.lan == 'zh' ? 50 : 70,
      render: (h, params) => {
        const {coinType} = params.row;
        let hrefStr = helpUrlArr[coinType] ? `${helpUrl}${helpUrlArr[coinType][that.lan]}` : '';
        return h('a', {
            class: 'icon-help icon-help-h5',
            attrs:{
              href:hrefStr,
              target:'_black'
            },
            on:{
              click: e => {
                e.stopPropagation();
              }
            }
          }, '')
      }
    },
    {
      title: root.$t('home.calc'),
      key: '',
      align: 'center',
      className:'th-mType',
      width:that.lan == 'zh' ? 70 : 98,
      render: (h, params) => {
        const {coinType} = params.row;
        let hrefStr = helpUrlArr[coinType] ? `${helpUrl}${helpUrlArr[coinType][that.lan]}` : '';
        return h('span', {
          class: 'icon-calc',
          on:{
            click: e => {
              e.stopPropagation();
              that.onShowModalCal(e, params.row)
            }
          }
        }, '')
      }
    }
  ];
  var columnsArrH5 = [
    {
      //title: root.$t('home.table.th1'),
      key: 'coinType',
      width:110,
      renderHeader: (h, params) => {
        return h('div',{
          class:'th-first'
        },[
          h('span', root.$t('home.table.th1'))
        ])
      },
      className:'table-cell-coin',
      render: (h, params) => {
        const {coinType} = params.row;
        return h('span', {
          class:'coin-col'
        },[
          h('img', {
            class: 'coinType-img',
            attrs:{
              src:that.$U.requireCurrencyImg(`${coinType}.png`)
            }
          }, ''),
          h('span', {
            class:'coin-typ'
          }, [
            h('span', coinType),
            h('span', {class: 'coin-fullName'}, coinFullName[coinType])
          ])
        ])
      }
    },
    {
      title: root.$t('home.table.th2'),
      key: 'poolHashrate',
      align:'right',
      width:h5Td2Width,
      render: (h, params) => {
        const {poolHashrate, poolHashrateUnit} = params.row;
        return h('span', [
          h('span', poolHashrate),
          h('span', {class: 'hash-unit'}, poolHashrateUnit)
        ])
      }
    },
    {
      key: 'coinPriceCny',
      align: 'right',
      width:h5Td3Width,
      className:'worker-col',
      renderHeader: (h, params) => {
        return h('div',[
          h('span', root.$t('home.table.th3')),
          h('span',{
            class:'rejectRatio-icon'
          }, [
            h('span','i'),
            h('span',{
              class:'rejectRatio-icon-tip'
            }, root.$t('home.table.th3Tip'))
          ])
        ])
      },
      render: (h, params) => {
        const {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType,
          calculateUnit, coinUnit, coinCoefficient, miningType, feePercent} = params.row;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '';

        //let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward * (1 - feePercent);
        let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        if (C < Math.pow(10, -7)) C = 0;
        const calUnit = that.$U.selectUnit(calculateUnit) ? that.$U.selectUnit(calculateUnit) : coinUnit.split('/')[0];
        if (that.settleAccount == "RMB") {
          incomeSettleUnit = '￥';
          coinPrice = that.$U.fNum(coinPriceCny * C, 4);
        } else if (that.settleAccount === 'USD') {
          incomeSettleUnit = '$';
          coinPrice = that.$U.fNum(coinPriceUsd * C, 4);
        }
        
        return h('span', [ 
          h('span', incomeSettleUnit), 
          h('span', coinPrice), 
          h('span', {class: 'hash-unit'}, `/${calUnit}`) 
        ])
      }
    },
    {
      title: ' ',
      key: '',
      align: 'right',
      width:30,
      slot:'action'
    }
  ];

  let columns = isH5 == true ? columnsArrH5 : columnsArr;
  if (bool) columns = [expand, ...columns];
  return columns;
}
