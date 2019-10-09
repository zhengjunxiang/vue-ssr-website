<template>
  <div style="position: relative;">
    <Row class="expand-row" >
      <Col span="24">
        <div v-if="expandH5 == true" class="payTable-expand-row0">
          <div class="expand-row0-row">
            <span class="label">{{$t('incomeRecord.payTableHeadWalletAddr0')}}</span>
            <a class="pay-link" :href="hrefWallet" target="_blank">{{data.walletAddress}}</a>
          </div>
          <div class="expand-row0-row">
            <span class="label">{{$t('incomeRecord.payTableHeadTransaction0')}}</span>
            <a class="pay-link" :href="hrefTrans" target="_blank">{{data.transactionHash}}</a>
          </div>
        </div>
        <div v-for="(item, index) in expandDataList" :key="index" class="payTable-expand-row">
          <span class="expand-row-inner-col">
            <span class="label">{{$t('incomeRecord.settledDate')}}</span>
            <span>{{$root.$U.fDate(item.creatDate, 'YYYY-MM-DD')}}</span>
          </span>
          <span class="expand-row-inner-col">
            <span v-if="item.type !== 'REFUND'" class="label">{{$t('incomeRecord.mineIncome')}} {{item.type.replace('_PLUS', '+')}}:</span>
            <span v-else class="label">{{$t('incomeRecord.compensatingIncome')}}</span>
            <span>{{item.dayRecv}} <span class="hash-unit">{{coin}}</span></span>
          </span>
        </div>
        <span class="btn-more" @click="handleSwitchMore" v-show="showMoreBtn && !extend">{{$t('common.more')}}</span>
      </Col>
    </Row>
    <Spin size="large" fix v-show="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return { extend: false }
  },
  props: ['data', 'expandData', 'coin', 'loading', 'expandH5', 'browser'],
  computed: {
    expandDataList() {
      if (this.extend) return this.expandData[this.data.index];
      else return this.expandData[this.data.index].slice(0, 3);
    },
    showMoreBtn() { return this.expandData[this.data.index].length > 3 },
    hrefWallet() {
      const {walletAddress} = this.data;
      let b = this.browser[this.coin];
      if (this.coin === 'ETH') b = `${b}account/`;
      else if (this.coin === 'ETC') b = `${b}addr/`;
      else if (this.coin === 'LTC' || this.coin === 'DASH' || this.coin === 'SCC' || this.coin === 'BTM'
        || this.coin === 'NMC' || this.coin === 'DOC') b = `${b}address/`;
      else if (this.coin === 'ZEC') b = `${b}accounts/`;
      else if (this.coin === 'XMC') b = `${b}search?value=`;
      return `${b}${walletAddress}`;
    },
    hrefTrans() {
      const {transactionHash} = this.data;
      let b = this.browser[this.coin];
      if (this.coin === 'ETH' || this.coin === 'ETC' || this.coin === 'LTC' || this.coin === 'DASH'
        || this.coin === 'SCC' || this.coin === 'XMC' || this.coin === 'NMC' || this.coin === 'DOC') b = `${b}tx/`;
      else if (this.coin === 'ZEC') b = `${b}transactions/`;
      else if (this.coin === 'BTM') b = `${b}transaction/`;
      return `${b}${transactionHash}`;
    }
  },
  methods: {
    handleSwitchMore() { this.extend = !this.extend }
  }
}
</script>

<style lang='less'>

</style>