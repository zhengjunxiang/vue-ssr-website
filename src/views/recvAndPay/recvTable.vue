<template>
  <div class='recvTable'>
    <div class="table-box">
      <Table :columns="columns($root)" :data="allDataList" ref="table" style="display: none;" />
      <Table :columns="columns($root)" :data="dataList" @on-sort-change="handleSort"
        :loading="isloading" class="table-large clearfix" :class="{'no-data': dataList.length === 0}"  />
      <Table :columns="columns($root, true)" :data="dataList" @on-sort-change="handleSort"
        :loading="isloading" class="table-mini clearfix" :class="{'no-data': dataList.length === 0}" />
      
      <Page :total="total" v-show="total > 40" size="small" :page-size-opts="[40, 60, 80]"
        :page-size="query.pageSize" :current="query.pageNum" show-total show-sizer
        @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
    </div>
  </div>
</template>

<script>
import columns from './columnsRecv'
import { mapGetters } from 'vuex'
export default {
  name: 'recvTable',
  data () {
    return {
      dataList: [], isloading: false, columns: columns(this), total: 0,
      allDataList: [],
      sortType: {creatDate: 'normal', dayHashRate: 'normal', payStatus: 'normal'},
      query: { pageNum: 1, pageSize: 40, sortBy: '', order: '' },
      nmcType: ''
    }
  },
  props: ['dateQuery'],
  computed: {
    ...mapGetters(['currentCoin']),
  },
  methods: {
    async fetchDataList() {
      let queryData = { coinType: this.currentCoin };
      Object.keys(this.query).forEach(key => {
        const d = this.query[key];
        if (d === 0 || d) queryData[key] = d;
      });
      if (this.dateQuery.startTime) queryData.startTime = this.dateQuery.startTime;
      if (this.dateQuery.endTime) queryData.endTime = this.dateQuery.endTime;
      this.isloading = true;
      try {
        const data = await this.$store.dispatch('recvAndPayRecv', queryData);
        this.dataList = data.items;
        this.total = data.totalRecord;
        this.$emit('onSetTotleRecv', (data.totalRecv-0).toFixed(8));
        this.isloading = false;
      } catch (e) { this.isloading = false }
    },
    async handleExport() {
      let queryData = {};
      if (this.dateQuery.startTime) queryData.startTime = this.dateQuery.startTime;
      if (this.dateQuery.endTime) queryData.endTime = this.dateQuery.endTime;
      try {
        const data = await this.$store.dispatch('recvAndPayExportRecv', queryData);
        this.$emit('onSetExportLoading', false);
        this.allDataList = data.items;
        setTimeout(() => {
          this.$refs.table.exportCsv({
            filename: this.$U.setExportFileName(this.$t('incomeRecord.incomeList'), this),
            original: false,
            columns: this.columns(this).map((col, index) => {
              if (col.key === 'dayRecv') col.title = this.$t('incomeRecord.incomeTableHeadIncome');
              return col;
            }),
            data: data.items.map(data => {
              let {creatDate, dayHashRate, dayHashRateUnit, payStatus, type, plusPercent, dayRecv} = data;
              data.creatDate = this.$U.fDate(creatDate, 'YYYY-MM-DD');
              data.dayHashRate = `${dayHashRate} ${dayHashRateUnit}`;
              if (plusPercent && plusPercent !== '0.00000000') {
                const a = dayRecv / (1+(plusPercent-0));
                data.dayRecv = `${a.toFixed(8)} + ${(a * (plusPercent-0)).toFixed(8)} ${this.currentCoin}`;
              } else data.dayRecv = `${dayRecv} ${this.currentCoin}`;
              data.type = type.replace('_PLUS', '+');
              if (payStatus === 'NOTPAID') data.payStatus = this.$root.$t('incomeRecord.payStatusUnPaid');
              else if (payStatus === 'PAID') data.payStatus = this.$root.$t('incomeRecord.payStatusPaid');
              else data.payStatus = this.$root.$t('incomeRecord.payStatusSettled');
              return data;
            })
          });
        }, 60)
      } catch (e) {
        this.$emit('onSetExportLoading', false);
        console.error(e);
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
      else if (key === 'dayHashRate') this.query.sortBy = 'SHARE1_COUNT';
      else if (key === 'payStatus') this.query.sortBy = 'STATUS';
      this.query.order = order.toUpperCase();
      this.sortType = {creatDate: 'normal', dayHashRate: 'normal', payStatus: 'normal'};
      this.sortType[key] = order;
      if (order === 'normal') {
        this.query.sortBy = '';
        this.query.order = '';
      }
      this.fetchDataList();
    },
  }
}
</script>

<style lang='less'>

</style>
