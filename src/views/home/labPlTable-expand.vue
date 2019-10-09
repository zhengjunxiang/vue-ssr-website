<template>
  <div>
    <Row class="expand-row">
      <Col span="14" class="epd-row-l">
        <div class="epd-row-l-title clearfix">
          <div class="chart-tab fl">
            <button 
              :class="{'active': chartType === 'hashType'}">{{$t('home.table.th2')}}</button>
          </div>
          </a>
        </div>
        <div 
          class="epd-row-chart epd-row-chartH2"
          :id="`epd-chart-${data.coinType}`" 
          :ref="`epd-chart-${data.coinType}`"
          v-show="chartDataLen >= 1">
        </div>
        <div 
          v-show="chartDataLen < 1" 
          class="epd-row-chart epd-row-chartH2 epd-row-chartNodata">{{$t('common.noData')}}</div>
      </Col>
      <Col span="10" class="epd-row-r">
        <!--挖矿地址-->
        <div class="line line-mingAddr">
          <h5 class="line-title">{{$t('home.miningAddr')}}</h5>
          <div>
            <span class="addr-text">{{data.miningAddr}}</span> 
            <span type="primary"
              v-clipboard:copy="data.miningAddr"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError" class="m-l-64 btn-copyIcon">{{$t('common.copy')}}</span>
          </div>
        </div>
        <!--收益模式与费率-->
        <div class="line">
          <h5 class="line-title">{{$t('home.revenueFee')}}</h5>
          <span 
            class="fee-item first">
            {{data.miningType}}: {{data.feePercent*100 + '%'}}
          </span>
        </div>
        <!--算法-->
        <div class="line">
          <span class="line-title">{{$t('home.algorithm')}}</span>
          <span class="alg-info">{{dataDetail.algorithm}}</span>
        </div>
        <!--日理论收益-->
        <div class="line">
          <span class="line-title">{{$t('home.table.th3')}}</span>
          <div>
            <span class="income-item">
              {{cV.count}} <span class="clr-a8a8a8">{{cV.coinTypeStr}} /{{cV.calUnit}}</span>
            </span>
            <span class="income-item">
              <span>￥</span> {{cV.coinPriceCny}} <span class="clr-a8a8a8">/{{cV.calUnit}}</span>
            </span>
            <span>
              <span>$</span> {{cV.coinPriceUsd}} <span class="clr-a8a8a8">/{{cV.calUnit}}</span>
            </span>
          </div>
        </div>
      </Col>
    </Row>
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { mineAddress } from '../../libs/config'
export default {
  props: ['data', 'that'],
  data(){
    return {
      payStatusStyle:'',
      payStatusText:'',
      mineAddress,
      chartType:'hashType',
      chartDataLen:0,
      dataDetail:[],
    }
  },
  mounted(){
    this.getStatus();
    this.initExpandData();
  },
  computed: {
    ...mapGetters(['userId', 'currentCoin', 'coinUrlName', 'lan', 'siteUrl', 'epdRowLW']),
    cV(){
        let {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType,
          calculateUnit, coinUnit, coinCoefficient, miningType, feePercent} = this.data;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '';
        let coinTypeStr = coinType;
        if(coinType.indexOf("DGB") !== -1){
          coinTypeStr = coinType.split("_")[0];
        }
        //let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward * (1 - feePercent);
        let C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        if (C < Math.pow(10, -7)) C = 0;
        const count = parseFloat(C).toFixed(4), calUnit = this.$U.selectUnit(calculateUnit) ? this.$U.selectUnit(calculateUnit) : coinUnit.split('/')[0];
        let coinPriceCnyCv = this.$U.fNum(coinPriceCny * C, 4);
        let coinPriceUsdCv = this.$U.fNum(coinPriceUsd * C, 4);
        return {'count':count, 'calUnit':calUnit, 'coinPriceUsd':coinPriceUsdCv, 'coinPriceCny':coinPriceCnyCv, 'coinTypeStr':coinTypeStr};
    },
    miningTypePPLNS(){
      if(typeof this.data.miningType === 'string'){
        return false;
      }else{
        let miningType = this.data.miningType.filter(item => item.payMethod == "PPLNS");
        let mType = '';
        if(miningType.length > 0) mType = miningType[0].payMethod;
        return mType;
      }
    }
  },
  methods: {
    getStatus(){
      var payStatus = this.data.payStatus;
    },
    async initExpandData() {
      this.isloading = true;
      try {
        const data = await this.$store.dispatch('labCoinDetailQuery', {coinType: this.data.coinType});
        this.dataDetail = Object.freeze(data);
        this.isloading = false;
        this.$nextTick(()=>{
          let epdRowLWNew = document.getElementsByClassName('epd-row-l')[0].offsetWidth;
          if(epdRowLWNew > 0) this.$store.commit('setEpdRowLW', epdRowLWNew);
          this.fetchChartData();//初始化图表
        })
      } catch (e) { this.isloading = false }
    },
    async fetchChartData() {
      const type = this.chartType;
      const coinType = this.data.coinType;
      if(this.epdRowLW > 0) {
        var epdChartDomRef = 'epd-chart-'+this.data.coinType;
        this.$refs[epdChartDomRef].style.width = this.epdRowLW + 'px';
      }
      if (!this.echartInstance) this.echartInstance = this.$E.init(document.getElementById('epd-chart-'+this.data.coinType));
      if (this.echartInstance) window.onresize = () => this.echartInstance.resize();
      this.echartInstance.showLoading({
        text: 'Loading', color: '#1abf87', textColor: '#666',
        maskColor: 'rgba(255, 255, 255, 0.1)', zlevel: 0
      });

      //根据chartType设置yAxisName
      var yAxisNameTxt = this.$t('home.yHashName');

      //请求的路径
      const dataOrg = await this.$store.dispatch('labHashGraph', {coinType: coinType});
      const data = this.$U.orderHashTime(dataOrg.items);
      this.chartDataLen = data.length;
      //处理y轴数据
      const unit = data[0] && data[0].hashRateUnit ? data[0].hashRateUnit : '';
      const y = data.map(y => y.hashRate);
      //小屏
      var windowW = window.screen.availWidth;
      var gridLeftVal = windowW <= 414 ? 16 : 0 ;
      var gridRightVal = windowW <= 414 ? 22 : 20 ;
      var gridTopVal = windowW <= 414 ? 7 : 28 ;
      var yAxisName = windowW <= 414 ? '' : yAxisNameTxt + ' ' + unit ;
      //处理x轴数据
      let x = data.map(x => this.$U.fDate(x.timestamp, 'hh:mm'));

      const option = {
        grid: { left: '20px', right: '30px', top: gridTopVal, bottom: 0, containLabel: true, },
        tooltip: {
          backgroundColor: 'rgba(0,0,0, .8)', textStyle: {color: '#fff'},
          borderColor: 'rgb(90,90,90)', padding: 8, borderWidth: 1,
          trigger: 'axis', axisPointer: { type: 'cross' },
          formatter: params => {
            let date = '';
            if (data[0]) {
              date = this.$U.fDate(data[params[0].dataIndex].timestamp, 'YYYY-MM-DD hh:mm');
            }
            return `<span style="color: #62deb6; font-weight: 500; font-size: 18px;">${params[0].value} ${unit}</span>
               <br /> 
               <span style="color:rgba(255,255,255, .7); font-size:14px">${date}</span>`
          }
        },
        xAxis: {
          data: x, type: 'category', boundaryGap: false, 
          axisLine: { lineStyle: { color: '#4f4e4f' } },
          axisLabel: { color:'#8a8a8a', fontSize:14, align:'center' },
          interval:1,
          axisPointer:{
            lineStyle:{
              color: {
                colorStops: [{
                    offset: 0, color: '#3e9bd7' // 0% 处的颜色
                }, {
                    offset: 1, color: '#bc62da' // 100% 处的颜色
                }],
              }
            }
          }
        },
        yAxis: {
          name: yAxisName, nameTextStyle: {color:'rgba(255,255,255, .48)',fontSize:13}, type: 'value', boundaryGap: [0, '100%'],
          splitLine: { lineStyle:{ color: '#383738' } },
          axisLabel: { color: '#8a8a8a', fontSize:13, interval:1 },
          axisLine: { show: false }, axisTick: { show: false },
          max: value => parseFloat(value.max*1.1).toFixed(2)
        },
        series: [{
          type: 'line', smooth: true, data: y, symbolSize: 5,
          lineStyle: {
            color: {
              type: 'linear',
              colorStops: [
                { offset: 0.1, color: '#41a9ea'},
                { offset: 0.9, color: '#c65aea'},
              ]
            },
          },
          itemStyle: { color: '#8e7dda', borderWidth: 1,  },
          yAxis: { name: unit, type: 'value', boundaryGap: [0, '100%'] }
        }]
      };
      this.echartInstance.setOption(option);
      this.echartInstance.hideLoading();
    },
    onCopy() { this.$Message.success(this.$t('success.copy')) },
    onError() { this.$Message.error(this.$t('error.copy')) }
  }
};
</script>
<style lang='less'>
@import '../../styles/variable.less';
@import './expand.less';
</style>