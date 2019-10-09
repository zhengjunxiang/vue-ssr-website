<template>
  <Row class="expand-row">
    <Col span="14" class="epd-row-l">
      <div class="epd-row-l-title clearfix">
        <div class="chart-tab fl">
          <button
            :class="{'active': chartType === 'hashType'}" 
            @click="handleChangeChartType('hashType')">{{$t('home.table.th2')}}</button>
          <button
            v-if="miningTypePPLNS == 'PPLNS'" 
            :class="{'active': chartType === 'luckyType'}" 
            @click="handleChangeChartType('luckyType')">{{$t('home.lucky')}}</button>
        </div>
        <a :href="getBlockStaticUrl" target="_blank" class="link-detail fr">
          {{$t('home.blockStatic')}}<i></i>
        </a>
      </div>
      <div 
        class="epd-row-chart" 
        :class="{'epd-row-chartH1': data.coinType == 'BTC' || data.coinType == 'BCH' || data.coinType == 'LTC'}"
        :id="`epd-chart-${data.coinType}`" 
        :ref="`epd-chart-${data.coinType}`"
        v-show="chartDataLen >= 1">
      </div>
      <div 
        v-show="chartDataLen < 1" 
        class="epd-row-chart epd-row-chartNodata" 
        :class="{'epd-row-chartH1': data.coinType == 'BTC' || data.coinType == 'BCH' || data.coinType == 'LTC'}">{{$t('common.noData')}}</div>
    </Col>
    <Col span="10" class="epd-row-r">
      <!--挖矿地址-->
      <div class="line line-mingAddr">
        <h5 class="line-title">{{$t('home.miningAddr')}}</h5>
        <div v-for="(item, index) in mineAddress[data.coinType]" :key="index">
          <span class="addr-text">{{item}}</span> 
          <span type="primary"
            v-clipboard:copy="item"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError" class="m-l-64 btn-copyIcon">{{$t('common.copy')}}</span>
        </div>
      </div>
      <!--收益模式与费率--> 
      <div class="line" v-if="data.miningType">
        <h5 class="line-title">{{$t('home.revenueFee')}}</h5>
        <span 
          class="fee-item" 
          :class="{first: index == 0}" 
          v-for="(item, index) in data.miningType" 
          :key="`fee-item-${index}`">
          {{item.payMethod}}: {{item.percentStr}}
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
            {{cV.count}} <span class="clr-a8a8a8">{{data.coinType}} /{{cV.calUnit}}</span>
          </span>
          <span class="income-item">
            <span>￥</span> {{cV.coinPriceCny}} <span class="clr-a8a8a8">/{{cV.calUnit}}</span>
          </span>
          <span>
            <span>$</span> {{cV.coinPriceUsd}} <span class="clr-a8a8a8">/{{cV.calUnit}}</span>
          </span>
        </div>
      </div>
      <!--收益对比 合并挖矿-->
      <div class="line clearfix" v-if="data.coinType == 'BTC' || data.coinType == 'BCH' || data.coinType == 'LTC'">
        <div 
          v-if="data.coinType == 'BTC' || data.coinType == 'LTC'"
          class="mergeMing-line">
          <span class="line-title">{{$t('home.mergedMining')}}</span>
          <span class="mergeMing-info" v-for="(it, ind) in dataDetail.mergeMiningInfos" :key="ind" style="padding-left: 10px;">
            1 <span class="hash-unit">{{data.coinType}}</span> = {{it.mergeRate}}
            <span class="hash-unit">{{it.coinType === 'DOC' ? 'DOGE' : it.coinType}}</span>
          </span>
        </div>
        <a 
          v-if="data.coinType == 'BTC' || data.coinType == 'BCH'"
          class="link-detail incomeCpr-line fr"  
          :href="`${redirectUrl}earnComparison.htm?userId=${userId}&coinType=${coinUrlName}&lang=${lan}`" target="_blank">
          BTC/BCH {{$t('home.earningsCpr')}}<i></i>
        </a>
      </div>
    </Col>
  </Row>
</template>
<script>
import { mapGetters } from 'vuex'
import { mineAddress } from '../../libs/config'
export default {
  props: ['data', 'that'],
  data(){
    return {
      payStatusStyle:'', payStatusText:'', mineAddress,
      chartType:'hashType', chartDataLen:0, dataDetail: []
    }
  },
  mounted(){
    this.getStatus();
    this.initExpandData();
  },
  computed: {
    ...mapGetters(['userId', 'currentCoin', 'coinUrlName', 'lan', 'siteUrl', 'redirectUrl', 'epdRowLW']),
    cV() {
        let {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType,
          calculateUnit, coinUnit, coinCoefficient, miningType} = this.data;
        //根据switch值(settleAccount)设置计算币种
        let incomeSettleUnit = '', coinPrice = '', incomePercent = 1, C = 0;
        //获取PPS percent
        /*let f = miningType.filter(item => item.payMethod == "PPS");
        if(f.length > 0) incomePercent = f[0].percent;*/
        if(networkDiff == null) networkDiff = 1;
        if(coinCoefficient == null) coinCoefficient = 1;

        if (coinType === 'ETC' || coinType === 'ETH') {
          C = ((calculateUnit-0) * 86400) / networkDiff * blockReward;
        } else {
          C = ((calculateUnit-0) * 86400) / (coinCoefficient * networkDiff) * blockReward;
        }
        if (C < Math.pow(10, -7)) C = 0;
        const count = parseFloat(C).toFixed(8), calUnit = this.$U.selectUnit(calculateUnit);
        let coinPriceCnyCv = this.$U.fNum(coinPriceCny * C, 4);
        let coinPriceUsdCv = this.$U.fNum(coinPriceUsd * C, 4);
        return {'count':count, 'calUnit':calUnit, 'coinPriceUsd':coinPriceUsdCv, 'coinPriceCny':coinPriceCnyCv};
    },
    mergeRateType() {
      let coinType = this.data.coinType, mergeRateCoin='';
      if(coinType == "BTC"){
        mergeRateCoin = 'NMC'
      }else if(coinType == "LTC"){
        mergeRateCoin = 'DOC'
      } 
      return mergeRateCoin;
    },
    miningTypePPLNS() {
      let miningType = this.data.miningType.filter(item => item.payMethod == "PPLNS");
      let mType = '';
      if(miningType.length > 0) mType = miningType[0].payMethod;
      return mType;
    },
    getBlockStaticUrl() {
      let coinType = this.data.coinType;
      if (this.data.coinType === 'DASH') coinType = 'DAS';
      else if (this.data.coinType === 'SCC') coinType = 'SC';
      else if (this.data.coinType === 'BCH') coinType = 'BCC';
      else if(this.data.coinType === 'XMC') coinType = 'XMR';
      var urlStr = `${this.redirectUrl}poolStats.htm?userId=${this.userId}&coinType=${coinType}&lang=${this.lan}`;
      return urlStr;
    }
  },
  methods: {
    getStatus(){
      var payStatus = this.data.payStatus;
    },
    async initExpandData() {
      this.isloading = true;
      try {
        const data = await this.$store.dispatch('coinDetailQuery', {coinType: this.data.coinType});
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

      //根据chartType设置请求的路径
      var storeGraph = this.chartType == 'luckyType' ? 'luckyGraph' : 'hashGraph';
      const dataOrg = await this.$store.dispatch(storeGraph, {coinType: coinType});
      const data = this.$U.orderHashTime(dataOrg.items);
      this.chartDataLen = data.length;
      //处理y轴数据
      const unit = data[0] && data[0].hashRateUnit ? data[0].hashRateUnit : '';
      const y = data.map(y => {
        let d = [];
        if(this.chartType == 'luckyType') d = y.lucky;
        else d = y.hashRate;
        return d;
      });
      //根据chartType设置yAxisName
      var yAxisNameTxt = this.chartType == 'luckyType' ? this.$t('home.yLuckyName') : this.$t('home.yHashName');
      //小屏
      var windowW = window.screen.availWidth;
      var gridLeftVal = windowW <= 414 ? 16 : 0 ;
      var gridRightVal = windowW <= 414 ? 22 : 20 ;
      var gridTopVal = windowW <= 414 ? 7 : 28 ;
      var yAxisName = windowW <= 414 ? '' : yAxisNameTxt + ' ' + unit ;
      //处理x轴数据
      let x = [];
      if (type === 'luckyType') x = data.map(x => this.$U.fDate(x.timestamp, 'MM-DD'));
      else x = data.map(x => this.$U.fDate(x.timestamp, 'hh:mm'));
      const option = {
        grid: { left: '20px', right: '30px', top: gridTopVal, bottom: 0, containLabel: true, },
        tooltip: {
          backgroundColor: 'rgba(0,0,0, .8)', textStyle: {color: '#fff'},
          borderColor: 'rgb(90,90,90)', padding: 8, borderWidth: 1,
          trigger: 'axis', axisPointer: { type: 'cross' },
          formatter: params => {
            let date = '', str = '';
            if (data[0]) {
              date = this.$U.fDate(data[params[0].dataIndex].timestamp, 'YYYY-MM-DD hh:mm');
            }
            if(type === 'luckyType'){
              str = `${params[0].value} %`
            }else{
              str = `${params[0].value} ${unit}`
            }
            return `<span style="color: #62deb6; font-weight: 500; font-size: 18px;">${str}</span>
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
    handleChangeChartType(type) {
      this.chartType = type;
      this.fetchChartData();
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