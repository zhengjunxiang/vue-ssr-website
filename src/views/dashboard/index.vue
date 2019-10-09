<template>
  <div class='dashboard dashboard-adaption container'>
    <div class="dashboard-nodata container-inner">
      <!-- 页面初始化loading -->
      <div class="init-loading" v-show="displayCreatSubAcc === 'loading'">{{$t('common.loading')}}</div>
      <!-- 创建子账号提示 -->
      <NoSubAccountTip v-if="displayCreatSubAcc === true" />
      <!-- 添加矿机指南 -->
      <Card class="card-common card-pad-LR40" v-if="isShowRemind === true && (displayCreatSubAcc === false)">
        <div class='watchMode watchMode-adaption'>
          <h3 class="card-title title">{{$t('dashbord.noSubmitTipTitle')}}</h3>
          <h4><span>1</span>{{$t('dashbord.noSubmitTipStep1Title')}}</h4>
          <p class="step">
            {{$t('dashbord.noSubmitTipStep1Con')}}
            <a :href="`${redirectUrl}download.htm?m=tools&userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="link3" target="_black">{{$t('dashbord.noSubmitTipStep1Con1')}}</a>
            {{$t('dashbord.noSubmitTipStep1Con2')}}
          </p>
          <h4><span>2</span>{{$t('dashbord.noSubmitTipStep2Title')}}</h4>
          <p class="step">
            {{$t('dashbord.noSubmitTipStep2Con')}}
            <span class="clr-63a92a">{{userId}}.10x32</span>{{$t('dashbord.noSubmitTipStep2Con2')}}
          </p>
          <h4><span>3</span>{{$t('dashbord.noSubmitTipStep3Title')}}</h4>
          <p class="step step-spec">{{$t('dashbord.noSubmitTipStep3Con')}}</p>
        </div>
      </Card>
    </div>

    <transition name="fade" mode="out-in">
      <div class="container-inner" v-if="isShowRemind === false && (displayCreatSubAcc === false)">
        <Row class="bread">
          <Col span="15">
            <img :src="$U.requireCurrencyImg(`${currentCoin}.png`)" :alt="currentCoin" class="currency-icon">
            <span class="account-name">{{userId}}</span>
            <span>{{$t('dashbord.mining')}}</span>
            <span class="icon-arrow-r"></span>
            <span class="clr-21ae9c">{{currentCoin}}</span>
          </Col>
          <Col span="9" class="bread-col-r" v-if="currentCoin == 'BTC' || currentCoin == 'BCH'">
            <a :href="`${redirectUrl}earnComparison.htm`" target="_black">BTC／BCH {{$t('dashbord.incomeCompare')}}</a>
            <span class="icon-arrow-r"></span>
          </Col>
        </Row>
        <Row :gutter="20" class="info-part">
          <Col :xs="24" :sm="24" :md="24" :lg="8">
            <Card class="card-common card-pad-LR30">
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.realHashRate')}}</p>
                <p>
                  <countTo class="f-52 clr-1c1c1c" :startVal='hsNowS' :decimals="2" :endVal='hsNow' :duration='2000' />
                  <span class="unit">{{hsNowUnit}}</span>
                </p>
              </div>
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.fulldayHashRate')}}</p>
                <p>
                  <countTo class="f-52 clr-1c1c1c" :startVal='hsLast1DS' :decimals="2" :endVal='hsLast1D' :duration='2000' />
                  <span class="unit">{{hsLast1DUnit}}</span>
                </p>
              </div>
              <p class="info-item-name clearfix">{{$t('dashbord.hashRate')}}</p>
            </Card>
          </Col>
          <Col :xs="24" :sm="24" :md="24" :lg="8">
            <Card class="card-common card-pad-LR30">
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.offline')}}</p>
                <span @click="handleWorker('offline')">
                  <countTo class="f-52 clr-f95050 workerStatus" :startVal='offlineWorkerNumS' :endVal='offlineWorkerNum' :duration='2000' />
                </span>
              </div>
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.runStatus')}}</p>
                <span @click="handleWorker('online')">
                  <countTo class="f-52 clr-63a92a workerStatus" :startVal='onlineWorkerNumS' :endVal='onlineWorkerNum' :duration='2000' />
                </span>
              </div>
              <p class="info-item-name clearfix">{{$t('dashbord.workersNum')}} 
                <span class="number" @click="handleWorker('')">
                  (<countTo class="workerStatus" :startVal='totalWorkerNumS' :endVal='totalWorkerNum' :duration='2000' />)
                </span>
              </p>
            </Card>
          </Col>
          <Col :xs="24" :sm="24" :md="24" :lg="8">
            <Card class="card-info-Part3 card-common card-pad-LR30">
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.payStatus')}}</p>
                <div class="f-52 clr-f5904c">{{earningsNoPay}}</div>
              </div>
              <div class="info-item">
                <div class="info-item-label">
                  <Tooltip max-width="668" class="tip-box" placement="bottom-end" :transfer="true">
                    {{$t('dashbord.lastDayIncome')}}
                    <span class="icon-qst">i</span>
                    <div slot="content" class="tip-box-info">
                      <p>{{startTime}} ~ {{endTime}}</p>
                      <p>
                        <span>{{$t('dashbord.lastDayIncomeValid')}}</span>
                        <span>{{effectiveHash}}</span>
                        <span>{{effectiveHashUnit}}</span>
                      </p>
                      <p>
                        <span>{{$t('dashbord.lastDayIncomeMine')}}</span>
                        <span>{{earningsYesterdayStatic}}</span>
                        <span>{{currentCoin}}</span>
                      </p>
                      <p>
                        <span>{{lastDayIncomeZH}}</span>
                        <span>{{earningsOfUnit}}</span>
                        <span>{{currentCoin}}</span>
                      </p>
                    </div>
                  </Tooltip>
                </div>
                <div class="f-52 clr-21ae9c">{{earningsYesterday}}</div>
              </div>
              <p class="info-item-name clearfix">{{$t('dashbord.totalIncome')}} 
                <span class="number">
                  (<span>{{earningsTotal}}</span>)
                </span>
              </p>
            </Card>
            <Card class="card-info-Part3-adaption card-common card-pad-LR30">
              <p class="info-item-name clearfix">{{$t('dashbord.totalIncome')}} 
                <span class="number"> (<span>{{earningsTotal}}</span>) </span>
              </p>
              <div class="info-item">
                <p class="info-item-label">{{$t('dashbord.payStatus')}}</p>
                <div class="f-44 clr-f5904c info-item-data">{{earningsNoPay}}</div>
              </div>
              <div class="info-item">
                <div class="info-item-label">
                  <Tooltip max-width="368" class="tip-box">
                    {{$t('dashbord.lastDayIncome')}}
                    <span class="icon-qst">i</span>
                    <div slot="content" class="tip-box-info">
                      <p>{{startTime}} ~ {{endTime}}</p>
                      <p>
                        <span>{{$t('dashbord.lastDayIncomeValid')}}</span>
                        <span>{{effectiveHash}}</span>
                        <span>{{effectiveHashUnit}}</span>
                      </p>
                      <p>
                        <span>{{$t('dashbord.lastDayIncomeMine')}}</span>
                        <span>{{earningsYesterdayStatic}}</span>
                        <span>{{currentCoin}}</span>
                      </p>
                      <p>
                        <span>{{lastDayIncomeZH}}</span>
                        <span>{{earningsOfUnit}}</span>
                        <span>{{currentCoin}}</span>
                      </p>
                    </div>
                  </Tooltip>
                </div>
                <div class="f-44 clr-21ae9c info-item-data">{{earningsYesterday}}</div>
              </div>
            </Card>
          </Col>
        </Row>

        <Card class="card-chart card-common card-pad-LR40">
          <h3 class="card-title">{{$t('dashbord.chartTitle')}}</h3>
          <div class="chart-btn-box btn-box">
            <Button type="primary" :class="{'select': graphType === 'day', 'small': true}"
              @click="handleChangeGraphType('day')">{{$t('common.oneDay')}}</Button>
            <Button type="primary" :class="{'select': graphType === 'hour', 'small': true}"
              @click="handleChangeGraphType('hour')">{{$t('common.onHour')}}</Button>
          </div>
          <div id="dashboardGraph" class="dashboardGraph"></div>
        </Card>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mineAddress } from '../../libs/config'
import countTo from 'vue-count-to';
import NoSubAccountTip from 'src/components/noSubAccountTip/index'
import { setTimeout } from 'timers';
export default {
  name: 'Dashboard',
  components: { countTo, NoSubAccountTip },
  data () {
    return {
      hsNow: 0, hsNowS: 0, hsNowUnit: '', hsLast1D: 0, hsLast1DS: 0, hsLast1DUnit: '',
      totalWorkerNum: 0, totalWorkerNumS: 0, onlineWorkerNum: 0, onlineWorkerNumS: 0, offlineWorkerNum: 0, offlineWorkerNumS: 0,
      earningsYesterday: 0, earningsNoPay: 0, earningsTotal: 0,
      startTime: '--', endTime: '--', effectiveHash: '', effectiveHashUnit: '', earningsOfUnit: '', earningsUnit: '',
      graphType: 'hour', echartInstance: null, timer: null,
      mineAddress, payMethods: [], miniPayment: 0
    }
  },
  computed: {
    ...mapGetters(['isInitData', 'isShowRemind', 'userId', 'currentCoin', 'reFetchApi', 'coinUrlName', 'lan', 'displayCreatSubAcc', 'redirectUrl']),
    lastDayIncomeZH() {
      if (this.lan === 'zh') return `折合每${this.earningsUnit}收益：`;
      else if (this.lan === 'en') return `Earnings/${this.earningsUnit}:`;
    },
    decimals() {
      if (this.currentCoin === 'BTM' || this.currentCoin === 'SCC') return 2;
      return 8;
    },
    earningsYesterdayStatic() { return (this.earningsYesterday-0).toFixed(this.decimals) },
    userIdURI() {
      if (this.userId) return encodeURI(this.userId).replace(/\+/g, '%2B');
      return '';
    },
  },
  watch: {
    reFetchApi() { this.initData() },
    isInitData(bool) { this.initData() },
  },
  mounted() { if (this.isInitData) this.initData() },
  destroyed() { clearInterval(this.timer) },
  methods: {
    handleWorker(type) {
      this.$router.push({name: 'worker', query: {status: type}})
    },
    async initData() {
      if (this.$route.query.ticket) this.$router.push('/dashboard');
      this.fetchMinerInfo();
      if (this.isShowRemind === true || this.displayCreatSubAcc === true) return null;
      this.fetchHash();
      this.fetchWorkerNum();
      this.fetchEarnings();
      setTimeout(() => this.fetchGraph(), 680);
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.fetchHash();
          this.fetchWorkerNum();
          this.fetchEarnings();
          this.fetchGraph();
        }, 1000*20);
      }
    },
    async fetchHash() {
      try {
        const data = await this.$store.dispatch('dashboardHash');
        if (this.hsNow !== data.hsNow - 0) {
          this.hsNowS = this.hsNow;
          this.hsNow = data.hsNow - 0;
        }
        if (this.hsLast1D !== data.hsLast1D - 0) {
          this.hsLast1DS = this.hsLast1D;
          this.hsLast1D = data.hsLast1D - 0;
        }
        if (this.hsLast1DUnit !== data.hsLast1DUnit) this.hsLast1DUnit = data.hsLast1DUnit;
        if (this.hsNowUnit !== data.hsNowUnit) this.hsNowUnit = data.hsNowUnit;
      } catch(e) {
        console.error(e);
        this.hsNow = this.hsLast1D = 0.00;
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.realtimeData'));
      }
    },
    async fetchWorkerNum() {
      try {
        const data = await this.$store.dispatch('dashboardWorkerNum');
        if (this.totalWorkerNum !== data.totalWorkerNum - 0) {
          this.totalWorkerNumS = this.totalWorkerNum;
          this.totalWorkerNum = data.totalWorkerNum - 0;
        }
        if (this.onlineWorkerNum !== data.onlineWorkerNum - 0) {
          this.onlineWorkerNumS = this.onlineWorkerNum;
          this.onlineWorkerNum = data.onlineWorkerNum - 0;
        }
        if (this.offlineWorkerNum !== data.offlineWorkerNum) {
          this.offlineWorkerNumS = this.offlineWorkerNum;
          this.offlineWorkerNum = data.offlineWorkerNum - 0;
        }
      } catch(e) {
        console.error(e);
        this.totalWorkerNum = this.onlineWorkerNum = this.offlineWorkerNum = 0;
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.realtimeData'));
      }
    },
    async fetchEarnings() {
      try {
        const data = await this.$store.dispatch('dashboardEarnings');
        this.earningsYesterday = data.earningsYesterday;
        this.earningsNoPay = data.earningsNoPay;
        this.earningsTotal = data.earningsTotal;
        this.effectiveHash = (data.effectiveHash-0).toFixed(this.decimals);
        this.earningsOfUnit = (data.earningsOfUnit-0).toFixed(this.decimals);
        if (this.startTime !== this.$U.fDate(data.startTime)) this.startTime = this.$U.fDate(data.startTime);
        if (this.endTime !== this.$U.fDate(data.endTime)) this.endTime = this.$U.fDate(data.endTime);
        this.effectiveHashUnit = data.effectiveHashUnit
        this.earningsUnit = data.earningsUnit;
      } catch(e) {
        console.error(e);
        this.earningsOfUnit = this.effectiveHash = this.earningsTotal = this.earningsYesterday = this.earningsNoPay = 0;
        this.startTime = this.endTime = '--';
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.realtimeData'));
      }
    },
    async fetchGraph() {
      const type = this.graphType, dom = document.getElementById('dashboardGraph') || null;
      if (!dom) return;
      this.echartInstance = this.$E.init(dom);
      window.onresize = () => this.echartInstance.resize();
      this.echartInstance.showLoading({
        text: 'Loading', color: '#1abf87', textColor: '#666',
        maskColor: 'rgba(255, 255, 255, 0.1)', zlevel: 0
      });
      const data = await this.$store.dispatch('dashboardGraph', {userWorkerId: this.userWorkerId, type});
      const unit = data.items[0] ? data.items[0].hashRateUnit : '';
      const y = data.items.map(y => y.hashRate);
      let yAxisName = unit, x = [];
      if (type === 'day') x = data.items.map(x => this.$U.fDate(x.timestamp, 'MM-DD'));
      else x = data.items.map(x => this.$U.fDate(x.timestamp, 'hh:mm'));
      const option = {
        grid: { left: '20px', right: '30px', top: '14px', bottom: 0, containLabel: true, },
        tooltip: {
          backgroundColor: 'rgba(0,0,0, .8)', textStyle: {color: '#fff'},
          borderColor: 'rgb(90,90,90)', padding: 8, borderWidth: 1,
          trigger: 'axis', axisPointer: { type: 'cross' },
          formatter: params => {
            let date = '';
            if (data.items[0]) {
              if (type === 'day') date = this.$U.fDate(data.items[params[0].dataIndex].timestamp, 'YYYY-MM-DD')
              else if (type === 'hour') date = this.$U.fDate(data.items[params[0].dataIndex].timestamp, 'YYYY-MM-DD hh:mm')
            }
            return `<span style="color: #62deb6; font-weight: 500; font-size: 18px;">${params[0].value} ${unit}</span> <br /> <span style="color:#d4d4d4；font-size:14px">${date}</span>`
          }
        },
        xAxis: {
          data: x, type: 'category', boundaryGap: false, 
          axisLine: { lineStyle: { color: '#bfbfbf' } },
          axisLabel: { color:'#9e9f9f', fontSize:14, align:'center' },
          interval:1,
          axisPointer:{
            lineStyle:{
              color: {
                colorStops: [{
                    offset: 0, color: '#5ecd67' // 0% 处的颜色
                }, {
                    offset: 1, color: '#58cebb' // 100% 处的颜色
                }],
              }
            }
          }
        },
        yAxis: {
          name: yAxisName, nameTextStyle: {color:'#9e9f9f',fontSize:13}, type: 'value', boundaryGap: [0, '100%'],
          splitLine: { lineStyle:{ color: '#f4f4f4' } },
          axisLabel: { color: '#9e9f9f', fontSize:13, interval:1 },
          axisLine: { show: false }, axisTick: { show: false },
          max: value => parseFloat(value.max*1.1).toFixed(2)
        },
        series: [{
          type: 'line', smooth: true, data: y, symbolSize: 5,
          lineStyle: {
            color: {
              type: 'linear',
              colorStops: [
                { offset: 0.1, color: '#5ecd67'},
                { offset: 0.9, color: '#58cebb'},
              ]
            },
          },
          itemStyle: { color: '#6bd186', borderWidth: 1,  },
          yAxis: { name: unit, type: 'value', boundaryGap: [0, '100%'] },
          areaStyle: {
            normal: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(205, 240, 216, 1)' },
                  { offset: 0.7, color: 'rgba(255, 255, 255, 0.9)' }
                ]
              }
            }
          },
        }]
      };
      this.echartInstance.setOption(option);
      this.echartInstance.hideLoading();
    },
    async fetchMinerInfo() {
      const data = await this.$store.dispatch('dashboardMinerInfo');
      if (data) {
        this.payMethods = data.payMethods;
        this.miniPayment = data.miniPayment;
      }
    },
    handleChangeGraphType(type) {
      this.graphType = type;
      this.fetchGraph();
    },
    onCopy() { this.$Message.success(this.$t('success.copy')) },
    onError() { this.$Message.error(this.$t('error.copy')) }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
@import './index';
</style>