import expandRow from './antPlTable-expand.vue'
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
      //width:210,
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
      //width:200,
      render: (h, params) => {
        const {poolHashrate} = params.row;
        var poolHashrateV = '', poolHashrateUnit = '';
        if(poolHashrate){
          poolHashrateV = poolHashrate.split(" ")[0];
          poolHashrateUnit = poolHashrate.split(" ")[1];
        }
        return h('span', [
          h('span', poolHashrateV),
          h('span', {class: 'hash-unit'}, poolHashrateUnit)
        ])
      }
    },
    {
      key: 'coinPriceCny',
      align: 'right',
      className:'worker-col',
      //width:260,
      renderHeader: (h, params) => {
        return h('div',[
          h('span', root.$t('home.table.th3')),
          h('span',{
            class:'rejectRatio-icon'
          }, [
            h('span','i'),
            h('span',{
              class:'rejectRatio-icon-tip-index rejectRatio-icon-tip'
            }, root.$t('home.table.th3Tip'))
          ])
        ])
      },
      render: (h, params) => {
        const {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType,
          calculateUnit, coinUnit, coinCoefficient, miningType} = params.row;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '', feePercent = 1, C=0;
        //获取PPS percent
        /*var f = miningType.filter(item => item.payMethod == "PPS");
        if(f.length > 0) feePercent = f[0].percent;*/

        //console.log(calculateUnit, feePercent)

        if(coinType === 'ETC' || coinType === 'ETH'){
          //C = ((calculateUnit-0) * 86400) / networkDiff * blockReward * feePercent;
          C = ((calculateUnit-0) * 86400) / networkDiff * blockReward;
        }else{
          //C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward * feePercent;
          C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        }
        
        if (C < Math.pow(10, -7)) C = 0;

        const calUnit = that.$U.selectUnit(calculateUnit);
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
      render: (h, params) => {
        const {minimumPayment, coinType} = params.row;
        /*if (type === 'REFUND') return h('span', root.$t('incomeRecord.refund'))
        return h('span', type.replace('_PLUS', '+'))*/
        return h('span', [  
          h('span', minimumPayment), 
          h('span', {class: 'hash-unit'}, coinType) 
        ])
      }
    },
    {
      title: root.$t('home.table.th5'),
      key: 'miningType',
      align: 'left',
      //width:220,
      render: (h, params) => {
        const {miningType} = params.row;
        var payMethod = miningType.map(item => item.payMethod);
        return h('span',{class: ''}, payMethod.join(", "))
      }
    },
    {
      title: root.$t('home.minghlp'),
      key: '',
      align: 'center',
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
        const {poolHashrate} = params.row;
        var poolHashrateV = '', poolHashrateUnit = '';
        if(poolHashrate){
          poolHashrateV = poolHashrate.split(" ")[0];
          poolHashrateUnit = poolHashrate.split(" ")[1];
        }
        return h('span', [
          h('span', poolHashrateV),
          h('span', {class: 'hash-unit'}, poolHashrateUnit)
        ])
      }
    },
    {
      key: 'coinPriceCny',
      align: 'right',
      className:'worker-col',
      width:h5Td3Width,
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
          calculateUnit, coinUnit, coinCoefficient, miningType} = params.row;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '', feePercent = 1, C=0;
        //获取PPS percent
        /*var f = miningType.filter(item => item.payMethod == "PPS");
        if(f.length > 0) feePercent = f[0].percent;*/

        if(coinType === 'ETC' || coinType === 'ETH'){
          C = ((calculateUnit-0) * 86400) / networkDiff * blockReward;
        }else{
          C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        }
        
        if (C < Math.pow(10, -7)) C = 0;

        const calUnit = that.$U.selectUnit(calculateUnit);
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
      slot: 'action1',
      width:30
    }
  ];

  let columns = isH5 == true ? columnsArrH5 : columnsArr;
  if (bool) columns = [expand, ...columns];
  return columns;
}
