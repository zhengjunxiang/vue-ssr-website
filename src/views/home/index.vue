<template>
  <div class='home home-adaption'>
    <!--carousel banner start-->
    <div class="carousel-box">
      <div class="active-bg" style="background:#000;">
        <img src="" data-src="active/vcash.jpg" class="banner-1 ant-banner" alt="vcash">
      </div>
    </div>
    <!--carousel banner end-->
    <!--币种tabs start-->
    <div class="home-cur-box container-inner">
      <div class="home-tab clearfix">
        <div class="fr">
          <i-Switch size="large" v-model="settleAccountSwitchModel" class="home-ivu-switch fr" @on-change="settleAccountSwitch">
            <span slot="open">RMB</span>
            <span slot="close">USD</span>
          </i-Switch>
          <span class="showModalCal-btn fr" @click="v => onShowModalCal('default')">
            <i class="calc-btn" /><span class="showModalCal-txt">{{$t('home.earningsCal')}}</span>
          </span>
        </div>
      </div>
      <TableAntPl ref="tableAntPl" class="table-antPl" :settleAccount="settleAccount" 
        @onShowModalCal="onShowModalCal" v-show="curTabType === 'antPl'" key="tableAntPl" />
    </div>
    <!--币种tabs end-->
    <!--计算器Modal-->
    <ModalCalc ref="ModalCalcRef" class="home-modalCalc">
    </ModalCalc>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableAntPl from './antPlTable'
import ModalCalc from './modalCalculator'
import ClientOnly from 'vue-client-only'
export default {
  name: 'home',
  data () {
    return {
      curTabType: 'antPl', settleAccount:'', settleAccountSwitchModel: true, coins: []
    }
  },
  components:{ TableAntPl, ModalCalc, ClientOnly },
  computed: {
    ...mapGetters(['userId', 'currentCoin', 'coinUrlName', 'lan', 'siteUrl','redirectUrl', 'isPc']),
  },
  watch: {
    lan(newV, oldV){
      this.onAutoSetImg();
      if (newV == "zh") {
        this.settleAccount = "RMB";
        this.settleAccountSwitchModel = true;
      } else {
        this.settleAccount = "USD";
        this.settleAccountSwitchModel = false;
      }
    }
  },
  mounted () {
    this.onAutoSetImg();
    this.initSettleAccount();
    this.fetchAntplDataList();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    onAutoSetImg() {
      const banners = document.querySelectorAll('.ant-banner');
      [...banners].forEach(item => {
        item.setAttribute('src', this.$U.requireImgAuto(item.dataset.src, this.lan))
      })
      const bannersExt = document.querySelectorAll('.ant-banner-ext');
      [...bannersExt].forEach(item => {
        item.setAttribute('src', this.$U.requireImgAuto(item.dataset.src, this.lan, 'jpg'))
      })
    },
    initSettleAccount() {
      if (this.lan == 'zh') this.settleAccount = 'RMB';
      else this.settleAccount = 'USD';
    },
    async fetchAntplDataList() {
      try {
        let data = await this.$store.dispatch('coinListQuery');
        this.$nextTick(() => { 
          this.$refs['tableAntPl'].fetchDataList(data.items);
        })
      } catch (e) { this.isloading = false }
    },
    settleAccountSwitch(e){
      this.settleAccount = e == true ? 'RMB' : 'USD';
    },
    onShowModalCal(data) {
      this.$refs.ModalCalcRef.onShow(data, this.settleAccount)
    }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
@import './index';
@import './modalCalc';
@import './active';
</style>