<template>
  <div class='tablePay'>
    <div v-show="showJointlyCoin" class="tablePay-currency-tab clearfix">
      <Button @click="fetchDataList(currentCoin)" :class="[{active: currentCoin === activeCoinType},'ivu-btn-tab']">{{currentCoin}}</Button>
      <Button @click="fetchDataList(jointlyCoin)" :class="[{active: jointlyCoin === activeCoinType},'ivu-btn-tab']">{{changeCoinType}}</Button>
      <Button @click="fetchDataList('VCASH')" :class="[{active: 'VCASH' === activeCoinType},'ivu-btn-tab']" v-if="currentCoin === 'BTC'">VCASH</Button>
    </div>

    <div class="table-box">
      <!-- 主挖币种 -->
      <Table :columns="columns($root, true)" :data="dataList" @on-sort-change="handleSort" :loading="isloading" class="table-large clearfix"
        @on-expand="handleExpand" v-show="activeCoinType === currentCoin" :class="{'no-data': dataList.length === 0}"/>
      <Table :columns="columns($root, true, true)" :data="dataList" @on-sort-change="handleSort" :loading="isloading" class="table-mini clearfix"
        @on-expand="handleExpand" v-show="activeCoinType === currentCoin" :class="{'no-data': dataList.length === 0}"/>
      <!-- 域名币种 -->
      <Table :columns="columns($root)" :data="dataList" @on-sort-change="handleSort" :loading="isloading" class="table-large clearfix"
        v-show="activeCoinType !== currentCoin" :class="{'no-data': dataList.length === 0}"/>
      <Table :columns="columns($root, true, true)" :data="dataList" @on-sort-change="handleSort" :loading="isloading" class="table-mini clearfix" 
        v-show="activeCoinType !== currentCoin" :class="{'no-data': dataList.length === 0}"/>
      
      <Table :columns="columns($root)" :data="allDataList" ref="table" style="display: none;" />
      <Page :total="total" v-show="total > 40" size="small" :page-size-opts="[40, 60, 80]"
        :page-size="query.pageSize" :current="query.pageNum" show-total show-sizer
        @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
    </div>
  </div>
</template>

<script>
import columns from './columnsPay'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers';
import { browser } from 'src/libs/config'
export default {
  name: 'tablePay',
  data () {
    return {
      dataList: [], isloading: false, columns: columns(this), total: 0,
      allDataList: [],
      sortType: {creatDate: 'normal'},
      query: { pageNum: 1, pageSize: 40, sortBy: '', order: '' },
      activeCoinType: '', expandDataList: [],
      extendLoading: false, browser
    }
  },
  mounted() {
    this.activeCoinType = this.currentCoin;
  },
  watch: {
    currentCoin(value) { this.activeCoinType = value }
  },
  computed: {
    ...mapGetters(['currentCoin']),
    showJointlyCoin() {
      return this.currentCoin === 'BTC' || this.currentCoin === "LTC";
    },
    jointlyCoin() {
      if (this.currentCoin === 'BTC') return 'NMC';
      else if (this.currentCoin === 'LTC') return 'DOC';
      else return this.currentCoin;
    },
    changeCoinType: function () {
      if (this.jointlyCoin === 'DOC') return 'DOGE';
      return this.jointlyCoin;
    }
  },
  props: ['dateQuery'],
  methods: {
    async fetchDataList(coin) {
      if (coin) this.activeCoinType = coin;
      let queryData = { coinType: coin ? coin : this.activeCoinType };
      Object.keys(this.query).forEach(key => {
        const d = this.query[key];
        if (d === 0 || d) queryData[key] = d;
      });
      if (this.dateQuery.startTime) queryData.startTime = this.dateQuery.startTime;
      if (this.dateQuery.endTime) queryData.endTime = this.dateQuery.endTime;
      this.isloading = true;
      try {
        const data = await this.$store.dispatch('recvAndPayPay', queryData);
        this.dataList = data.items.map((item, index) => {
          this.expandDataList[index] = [];
          item.index = index;
          return item;
        });
        this.total = data.totalRecord;
        this.isloading = false;
      } catch (e) { this.isloading = false }
    },
    async handleExport() {
      let queryData = { coinType: this.activeCoinType };
      if (this.dateQuery.startTime) queryData.startTime = this.dateQuery.startTime;
      if (this.dateQuery.endTime) queryData.endTime = this.dateQuery.endTime;
      try {
        const data = await this.$store.dispatch('recvAndPayExportPay', queryData);
        this.$emit('onSetExportLoading', false);
        this.allDataList = data.items;
        setTimeout(() => {
          this.$refs.table.exportCsv({
            filename: this.$U.setExportFileName(this.$t('incomeRecord.payList'), this),
            original: false,
            columns: this.columns(this).map((col, index) => col),
            data: data.items.map(data => {
              data.creatDate = this.$U.fDate(data.creatDate, 'YYYY-MM-DD');
              data.amount = `${data.amount} ${this.activeCoinType}`;
              return data;
            })
          });
        }, 60)
      } catch(e) {
        this.$emit('onSetExportLoading', false);
        console.error(e)
      }
    },
    handlePageChange(page) {
      this.query.pageNum = page;
      this.fetchDataList();
    },
    handlePageSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      if (this.query.pageNum === 1) this.fetchDataList();
    },
    handleSort({column, key, order}) {
      if (key === 'creatDate') this.query.sortBy = 'ACCOUNT_TIME';
      this.query.order = order.toUpperCase();
      this.sortType = {creatDate: 'normal'};
      this.sortType[key] = order;
      if (order === 'normal') {
        this.query.sortBy = '';
        this.query.order = '';
      }
      this.fetchDataList();
    },
    async handleExpand(row, status) {
      this.expandDataList[row.index] = [];
      this.expandDataList = [...this.expandDataList];
      if (!status) return;
      this.extendLoading = true;
      let queryData = { payId: row.payId };
      try {
        const data = await this.$store.dispatch('recvAndPayPayRecv', queryData);
        this.extendLoading = false;
        this.expandDataList[row.index] = data.items;
        this.expandDataList = [...this.expandDataList];
      } catch(e) {
        this.extendLoading = false;
        console.error(e);
      }
    }
  }
}
</script>

<style lang='less'>

</style>