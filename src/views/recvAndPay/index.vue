<template>
  <div class='recvAndPay container'>
    <div class="dashboard-nodata container-inner"  style="padding-left:0;">
      <!-- 页面初始化loading -->
      <div class="init-loading" v-show="displayCreatSubAcc === 'loading'">{{$t('common.loading')}}</div>
      <!-- 创建子账号提示 -->
      <NoSubAccountTip v-if="displayCreatSubAcc === true" />
      <!-- 没有数据 -->
      <div class="no-data-page" v-if="isShowRemind === true && (displayCreatSubAcc === false)">
        {{$t('incomeRecord.noDataAll')}}
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="container-inner recvAndPay-container-inner" v-if="isShowRemind === false && (displayCreatSubAcc === false)">
        <div class="opt-box clearfix">
          <RadioGroup v-model="curType" type="button" @on-change="handleCurType" class="tab-m-RadioGroup">
            <Radio label="recv">{{$t('incomeRecord.tabNameIncome')}}</Radio>
            <Radio label="pay">{{$t('incomeRecord.tabNamePay')}}</Radio>
          </RadioGroup>

          <div class="table-opt-btnBox">
            <span class="table-opt-total" v-if="showTotleRecv">
              <span>{{$t('incomeRecord.incomeTotalName')}}</span>
              <span>{{totleRecv}}</span>
              <span class="unit">{{currentCoin}}</span>
            </span>
            <Button @click="handleExport" class="m-l-10 ivu-btn-common" :loading="exportLoading">{{exportDisplay}}</Button>
            <span class="table-opt-total">{{$t('incomeRecord.dateTitle')}}</span>
            <Dropdown trigger="click" @on-click="handleDropdown" class="ivu-dropdown-common" placement="bottom-end">
              <Button type="primary">{{filterTypeDisplay}} <Icon type="ios-arrow-down" /></Button>
              <DropdownMenu slot="list">
                <DropdownItem name="all">{{$t('common.all')}}</DropdownItem>
                <DropdownItem name="7day">{{$t('incomeRecord.dateOption7day')}}</DropdownItem>
                <DropdownItem name="30day">{{$t('incomeRecord.dateOption30day')}}</DropdownItem>
                <DropdownItem name="custom">{{$t('incomeRecord.dateOptionCustom')}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <span @click="handleDateDisplay">
              <DatePicker :editable="false" type="daterange" style="width: 240px; font-size: 12px;" v-show="filterType === 'custom'"
                @on-change="handleDatePickerChange" ref="datePicker" placement="bottom-end" :options="options" confirm :open="open"
                @on-ok="handleDatePickerConfirm" :placeholder="$t('incomeRecord.dateSelect')" @on-clickoutside="handleClickoutside" />
            </span>
          </div>
        </div>
        <div class="table-recv" :style="`display: ${curType === 'recv' ? 'block' : 'none'}`">
          <TableRecv ref="recv" :dateQuery="query" @onSetTotleRecv="onSetTotleRecv" @onSetExportLoading="onSetExportLoading" />
        </div>
        <div class="table-pay" :style="`display: ${curType === 'pay' ? 'block' : 'none'}`">
          <PayTable ref="pay" :dateQuery="query" @onSetExportLoading="onSetExportLoading" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableRecv from './recvTable'
import PayTable from './payTable'
import { setTimeout, setInterval, clearInterval } from 'timers';
import NoSubAccountTip from 'src/components/noSubAccountTip/index'
export default {
  name: 'recvAndPay',
  data () {
    return {
      curType: 'recv', filterType: 'all', totleRecv: '0.00',
      query: { startTime: '', endTime: '' }, open: false,
      exportLoading: false, timerRef: null,
      options: {
        disabledDate: date => date && date.valueOf() > Date.now()
      },
    }
  },
  components: {TableRecv, PayTable, NoSubAccountTip},
  computed: {
    ...mapGetters(['currentCoin', 'isInitData', 'isShowRemind', 'reFetchApi', 'userId', 'displayCreatSubAcc']),
    filterTypeDisplay() {
      const type = this.filterType;
      if (type === 'all') return this.$t('common.all');
      else if (type === '7day') return this.$t('incomeRecord.dateOption7day');
      else if (type === '30day') return this.$t('incomeRecord.dateOption30day');
      else if (type === 'custom') return this.$t('incomeRecord.dateOptionCustom');
    },
    exportDisplay() {
      if (this.curType === 'recv') return this.$t('incomeRecord.incomeTableExport');
      else if (this.curType === 'pay') return this.$t('incomeRecord.incomeTablePay');
    },
    showTotleRecv() { return this.curType === 'recv' }
  },
  watch: {
    currentCoin(value) {
      this.curType = 'recv';
      localStorage.setItem('recvAndPayType', 'recv');
    },
    userId(value) {
      this.curType = 'recv';
      localStorage.setItem('recvAndPayType', 'recv');
    },
    reFetchApi() { this.initdata() },
    isInitData(bool) { 
      if (bool) this.initdata()
    },
  },
  created() {
    if (process.env.VUE_ENV === 'server') return;
    this.curType = localStorage.getItem('recvAndPayType') || 'recv'
  },
  mounted() {
    if (this.isInitData) this.initdata()
  },
  methods: {
    initdata() {
      if (this.isShowRemind) return null;
      this.onResetData();
    },
    handleDateDisplay() {
      this.open = true;
      const y = document.body.scrollTop + document.documentElement.scrollTop;
      this.$nextTick(() => { window.scrollTo(0, y ? y-1 : y+1) });
    },
    handleClickoutside() { this.open = false },
    handleDatePickerConfirm(event) {
      var event = event || window.event;
      event.stopPropagation();
      this.fetchDataList();
      this.open = false;
    },
    onResetData() {
      this.query = { startTime: '', endTime: '' };
      this.filterType = 'all';
      this.$nextTick(() => { this.fetchDataList() })
    },
    handleCurType(type) {
      this.curType = type;
      localStorage.setItem('recvAndPayType', type);
      this.onResetData();
    },
    onSetTotleRecv(totle) { this.totleRecv = totle },
    handleDropdown(name) {
      const timestamp = new Date().valueOf();
      this.filterType = name;
      if (name !== 'custom') {
        this.$refs['datePicker'].handleClear();
        this.open = false;
      }
      if (name === 'custom') this.open = true;
      if (name === 'all' || name === 'custom') {
        this.query.startTime = '';
        this.query.endTime = '';
      } else if (name === '7day') {
        this.query.startTime = `${this.$U.fDate(timestamp-1000*60*60*24*6, 'YYYY-MM-DD')} 00:00:00`;
        this.query.endTime = `${this.$U.fDate('', 'YYYY-MM-DD')} 23:59:59`;
      } else if (name === '30day') {
        this.query.startTime = `${this.$U.fDate(timestamp-1000*60*60*24*29, 'YYYY-MM-DD')} 00:00:00`;
        this.query.endTime = `${this.$U.fDate('', 'YYYY-MM-DD')} 23:59:59`;
      }
      this.$nextTick(() => {
        if (name === 'all' || name === '7day' || name === '30day') this.fetchDataList();
      })
    },
    handleDatePickerChange(format) {
      if (this.filterType !== 'custom') return null;
      this.query.startTime = format[0] ? `${format[0]} 00:00:00` : '';
      this.query.endTime = format[1] ? `${format[1]} 23:59:59` : '';
    },
    handleExport() {
      this.exportLoading = true;
      if (this.curType === 'recv') this.$refs['recv'].handleExport();
      else if (this.curType === 'pay') this.$refs['pay'].handleExport();
    },
    fetchDataList() {
      let fetched = false;
      this.timerRef = setInterval(() => {
        if (fetched) {
          clearInterval(this.timerRef);
          this.timerRef = null;
          return null;
        }
        if (this.$refs[this.curType]) {
          fetched = true;
          this.$refs[this.curType].fetchDataList();
        }
      }, 120);
    },
    onSetExportLoading(bool) { this.exportLoading = bool }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
@import './index.less';
</style>