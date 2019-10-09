<template>
  <div class="right-side-adaption right-side">
    <div class="tab-box">
      <div class="summary-box">
        <Button type="primary" :class="{'select': query.workerStatus === 0}" @click="handleTabClick(0)">{{$t('common.all')}}  
          <span class="number">({{all}})</span>
        </Button>
        <Button type="primary" :class="{'select': query.workerStatus === 1}" @click="handleTabClick(1)">{{$t('status.active')}}  
          <span class="number">({{online}})</span>
        </Button>
        <Button type="primary" :class="{'select': query.workerStatus === 2}" @click="handleTabClick(2)">{{$t('status.inactive')}} 
          <span class="number">({{offline}})</span>
        </Button>
        <Button type="primary" :class="{'select': query.workerStatus === 3}" @click="handleTabClick(3)">{{$t('status.invalid')}}
          <span class="number">({{fail}})</span>
        </Button>
        <Spin v-show="loadingGroup" fix />
      </div>
      <Dropdown class="export-btn" trigger="click" @on-click="handleExport">
        <Button type="primary" class="ivu-btn-export">{{$t('user.export')}} <Icon type="ios-arrow-down"></Icon></Button>
        <DropdownMenu slot="list">
          <DropdownItem :name="0">{{$t('user.exportAll')}}</DropdownItem>
          <DropdownItem :name="1">{{$t('user.exportActive')}}</DropdownItem>
          <DropdownItem :name="2">{{$t('user.exportInactive')}}</DropdownItem>
          <DropdownItem :name="3" :disabled="!selection.length">{{$t('user.exportSelected')}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown class="export-btn btn-r-mg3" trigger="custom" :visible="moveWorkerVisible" v-show="!isWatchMode"
        @on-click="handleMoveWorker" @on-clickoutside="handleMoveGroupOutClick" placement="bottom-start">
        <Button type="primary" :class="selection.length === 0 ? 'ivu-btn-export disabled' : 'ivu-btn-export'" @click="handleOpenDrop">
          {{$t('user.moveToGroup')}} <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem v-for="(item, ind) in workerGroup" :name="item.id" :key="ind" v-if="item.id !== allGroupId">
            {{typeof item.groupName === 'string' ? item.groupName : item.groupName($root)}}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Input v-model="query.search" search :placeholder="$t('common.workerName')" @on-search="handleSearch"
        class="search-components search-components-large btn-r-mg3" @on-blur="handleSearchBlur"/>
      <!--mini search start-->  
      <div class="search-components search-components-mini" :class="{miniBarFocus: miniBarFocus == true}">
        <input type="text" v-model="query.search" :placeholder="$t('common.workerName')" @focus="handleSearchFocus" @blur="removeMiniBarFocus" />
        <input type="button" @click="handleSearch" value="搜索"/>
      </div>
      <!--mini search end-->
      <Button type="primary" class="clear-disable-work btn-r-mg3" v-show="query.workerStatus === 3 && !isWatchMode"
        @click="modalDelDisableWork = true" :title="$t('user.delOneClick')">
        {{$t('user.delOneClickBtnText')}}
      </Button>
    </div>
    <div class="table-box table-box-worker" :class="{'pos-rlt': workers.length === 0 && noDataSearch == true}">
      <Table :columns="columns($root)" :data="[]" ref="table" style="display: none;" />
      <div class="btnTypeSearchNodata" v-if="workers.length === 0 && noDataSearch == true">
        <div class="icon-search-nodata"></div>
        <p>{{$t('table.nodata')}}</p>
      </div>
      <!-- 授权账号下 -->
      <Table :columns="columns($root, false)" :data="workers" @on-sort-change="handleSort" v-show="isWatchMode"
        :highlight-row=false :loading="isloadingWorkers" class="table-large" :class="{'no-data': workers.length === 0}"
        @on-selection-change="handleSelectionChange" />

      <Table :columns="columns($root)" :data="workers" @on-sort-change="handleSort" v-show="!isWatchMode"
        :highlight-row=false :loading="isloadingWorkers" @on-selection-change="handleSelectionChange"
        class="table-large" :class="{'no-data': workers.length === 0}" />

      <Table  :columns="columns($root, true)"  :data="workers" @on-sort-change="handleSort" 
        :highlight-row=false :loading="isloadingWorkers" @on-selection-change="handleSelectionChange"
        class="table-mini" :class="{'no-data': workers.length === 0}"/>

      <Page :total="total" v-show="total > 10" size="small" :page-size-opts="[10, 40, 60, 80]" :page-size="pageSize" :current="query.pageNum"
        show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
    </div>
    <Card class="card-chart card-common card-pad-LR40">
      <h3 class="card-title">{{$t('user.workerGraph')}}</h3>
      <div class="chart-btn-box btn-box user-chart-btn-box">
        <Button type="primary" style="float: left;" class="chart-btn-operation" @click="handleDisplayAllWorkerGraph(true)">{{$t('common.all')}}</Button>
        <Button type="primary" style="float: left;" class="chart-btn-operation" @click="handleDisplayAllWorkerGraph(false)">{{$t('common.clear')}}</Button>
        <Button type="primary" :class="{'select': graphTypeAllWorker === 'day', 'small': true}"
          @click="handleChangeAllWorkerGraphType('day')">{{$t('common.oneDay')}}</Button>
        <Button type="primary" :class="{'select': graphTypeAllWorker === 'hour', 'small': true}"
          @click="handleChangeAllWorkerGraphType('hour')">{{$t('common.onHour')}}</Button>
      </div>
      <transition-group name="fade" mode="out-in">
        <div id="lineAllWorker" style="width: 100%; height: 360px;" v-show="!noData || graphAllWorkerLoading" key="lineAllWorker" />
        <div class="no-data" v-show="noData && !graphAllWorkerLoading" key="noData">{{$t('common.noData')}}</div>
      </transition-group>
      <div v-show="!noData" style="padding-bottom: 20px;">
        <span class="legend-item" v-for="(item, index) in workerAllGraphData.items"
          @mouseover="handleLegendItemHover('hover', item.userWorkerId)" @mouseout="handleLegendItemHover('out', item.userWorkerId)"
          @click="handleLegendItem(index)" :key="index">
          <em :style="`background: ${item.active ? item.color : '#ccc'};`"></em>
          {{item.userWorkerId}}
        </span>
      </div>
    </card>
    <Card v-if="showCreateWorkerTip != false" class="card-createWorker-tip card-common card-pad-LR30 createWorker-tip-adaption">
      <div class="createWorker-tip">
        <span class="createWorker-tip-icon"></span>
        <div class="createWorker-tip-con">
          <span class="clr-f95050">{{$t('user.creatWorkerTip1')}}</span>
          <span>{{$t('user.creatWorkerTip2')}}</span>
          <span class="clr-6f9b2a">XXX2018</span>
          <span>{{$t('user.creatWorkerTip3')}}</span>
        </div>
        <div class="createWorker-tip-btnBox">
          <button @click="closeCreateWorkerTip('forever')">{{$t('user.creatWorkerTipBtnClosefv')}}</button>
          <button @click="closeCreateWorkerTip()" class="createWorker-btnClose">{{$t('user.creatWorkerTipBtnClose')}}</button>
        </div>
      </div>
    </Card>
    <Modal v-model="modalDelDisableWork" :mask-closable="false" :title="$t('user.delInvalidWorker')" footer-hide
      class="modal-confirm modal-confirm-adaption" class-name="vertical-center-modal" @on-visible-change="handleVisibleChange">
      <p class="modal-confirm-info">
        <span class="modal-icon-warning">!</span>
        <span>{{$t('user.delInvalidWorker1')}}<span class="clr-red">{{fail}}</span></span> {{$t('user.delInvalidWorker1FailTotal')}}
      </p>
      <div class="btn-box modal-btn-box">
        <Button type="primary" class="del-liner" :loading="isloadingDel" @click="handleWorkerDel">{{$t('common.del')}}</Button>
        <Button type="default" @click="modalDelDisableWork = false" :loading="isloadingDel">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>
    <Modal class="modalWorkerGraph" v-model="modalWorkerGraph" :title="`${userId}.${workerId}`" footer-hide
      @on-visible-change="handleVisibleChange" class-name="vertical-center-modal" ref="modalWorkerGraph">
      <div class="btn-box">
        <Button type="primary" :class="{'select': graphType === 'day', 'small': true}"
          @click="handleChangeGraphType('day')">{{$t('common.oneDay')}}</Button>
        <Button type="primary" :class="{'select': graphType === 'hour', 'small': true}"
          @click="handleChangeGraphType('hour')">{{$t('common.onHour')}}</Button>
      </div>
      <div id="line" style="width: 100%; height: 240px; margin-left:auto; margin-right:auto;" />
    </Modal>
  </div>
</template>

<script>
import columns from './columns';
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers';
export default {
  name: 'right-part',
  data () {
    return {
      defaultGroupId: -1, allGroupId: -2,
      moveWorkerVisible: false, noDataSearch: false, miniBarFocus: false, showCreateWorkerTip:false,
      columns: columns(this), all: 0, online: 0, offline: 0, fail: 0,
      total: 0, pageSize: 40,
      query: { pageNum: 1, pageSize: 40, sortBy: '', order: '', search: '', workerStatus: 0 },
      workers: [], selection: [], isloadingWorkers: false,
      modalDelDisableWork: false, isloadingDel: false, modalWorkerGraph: false,
      echartInstance: null, graphType: 'hour', userWorkerId: '', workerId: '',
      echartInstanceAllWorker: null, graphTypeAllWorker: 'hour', graphAllWorkerLoading: false, noData: false,
      sortType: { hsLast1H: 'normal', hsLast1D: 'normal', shareLastTime: 'normal', workerId: 'normal' },
      workerAllGraphData: { items: [] }
    }
  },
  computed: {
    ...mapGetters(['isWatchMode', 'userId', 'currentCoin'])
  },
  props: ['groupId', 'workerGroup', 'disable', 'loadingGroup'],
  created() {
    const status = this.$route.query.status;
    if (status === 'online') this.query.workerStatus = 1;
    else if (status === 'offline') this.query.workerStatus = 2;
    this.$router.push({ query: {} });
  },
  mounted(){
    var closeCreateWorkerTipStorage = localStorage.getItem("closeCreateWorkerTip");
    if(closeCreateWorkerTipStorage === "true") this.showCreateWorkerTip = false;
    else this.showCreateWorkerTip = true;
    setTimeout(() => {
      this.echartInstanceAllWorker = this.$E.init(document.getElementById('lineAllWorker'));
      window.onresize = () => {
        this.echartInstanceAllWorker.resize();
        if (this.echartInstance) this.echartInstance.resize();
      }
      this.echartInstanceAllWorker.on('click', params => {
        this.echartInstanceAllWorker.clear();
        this.echartInstanceAllWorker.setOption(this.onSetWorkerAllGraphOpt(null, {type: 'item', name: params.seriesName}));
      });
    }, 60);
  },
  methods: {
    handleVisibleChange(bool) {
      if (!bool) document.getElementsByTagName('body')[0].style.cssText = '';
    },
    handleTabClick(type, isFetch) {
      this.query.workerStatus = type;
      if (!(isFetch === false)) this.$emit('onMenuItemSelect');
    },
    onSetTab(data) {
      this.all = data.totalWorkerNum;
      this.online = data.onlineWorkerNum;
      this.offline = data.offlineWorkerNum;
      this.fail = data.disableWorkerNum;
    },
    handleSearchBlur() {
      if (this.query.search === '') this.fetchWorkers();
    },
    onSetQueryData(type) {
      if (type === 'search') {
        this.noDataSearch = true;
        this.query.pageNum = 1;
      } else if (type === 'day' || type === 'hour') {
        this.query.pageNum = 1;
        this.noDataSearch = false;
      } else if (type === 'changePage') {
        this.noDataSearch = false;
      } else if (type === 'sort') {
        this.noDataSearch = false;
        this.query.pageNum = 1;
      } else {
        this.query.pageNum = 1;
        this.query.search = '';
        this.noDataSearch = false;
      }
      let queryData = { groupId: this.groupId };
      Object.keys(this.query).forEach(key => {
        const d = this.query[key];
        if (d === 0 || d) queryData[key] = d;
      });
      return queryData;
    },
    async fetchWorkers(type) {
      const queryData = this.onSetQueryData(type);
      setTimeout(() => {
        this.fetchHashRateChartAllWorker(queryData);
      }, 600);
      this.isloadingWorkers = true;
      try {
        const data = await this.$store.dispatch('workerQuery', queryData);
        this.selection = [];
        this.workers = Object.freeze(data.items);
        this.total = data.totalRecord;
        this.isloadingWorkers = false;
      } catch (e) { this.isloadingWorkers = false }
    },
    handlePageChange(page) {
      this.query.pageNum = page;
      this.fetchWorkers('changePage');
    },
    handlePageSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.pageSize = pageSize;
      if (this.query.pageNum === 1) this.fetchWorkers('changePage');
    },
    handleSort({column, key, order}) {
      if (key === 'hsLast1H') this.query.sortBy = 'hash1h';
      else if (key === 'hsLast1D') this.query.sortBy = 'hash1d';
      else if (key === 'shareLastTime') this.query.sortBy = 'submitLastTime';
      else if (key === 'workerId') this.query.sortBy = 'workerName';
      this.query.order = order;
      this.sortType = {hsLast1H: 'normal', hsLast1D: 'normal', shareLastTime: 'normal', workerId: 'normal'};
      this.sortType[key] = order;
      if (order === 'normal') this.query.sortBy = this.query.order = '';
      this.fetchWorkers('sort');
    },
    onSetExportFileName(name) {
      if (name === 0) return this.$U.setExportFileName(this.$t('user.allWorkerList'), this);
      else if (name === 1) return this.$U.setExportFileName(this.$t('user.activeWorkerList'), this);
      else if (name === 2) return this.$U.setExportFileName(this.$t('user.inActiveWorkerList'), this);
      else if (name === 3) return this.$U.setExportFileName(this.$t('user.selectWorkerList'), this);
    },
    async handleExport(name) {
      let allWorkers = [];
      if (name !== 3) {
        const data = await this.$store.dispatch('workerExport', {groupId: this.groupId, workerStatus: name});
        allWorkers = data.items;
      } else {
        if (this.selection.length === 0) return this.$Message.warning(this.$t('warn.plSelectWorker'))
        allWorkers = this.selection;
      }
      setTimeout(() => {
        this.$refs.table.exportCsv({
          filename: this.onSetExportFileName(name),
          original: false,
          columns: columns(this)(this.$root).filter((col, ind) => ind > 1).map((col, index) => {
            if (index === 5) col.title = this.$t('common.status');
            return col;
          }),
          data: allWorkers.map(data => {
            let status = '';
            if (data.workerStatus === 1) status = this.$t('status.active');
            else if (data.workerStatus === 2) status = this.$t('status.inactive');
            else if (data.workerStatus === 3) status = this.$t('status.invalid');
            data.shareLastTime = this.$U.fDate(data.shareLastTime);
            data.workerStatus = status;
            return data;
          })
        });
      }, 60)
    },
    handleSelectionChange(selection) {
      console.log('this.selection = selection', selection)
      this.selection = selection
    },
    handleSearch() {
      const len = this.$U.getByteLen(this.query.search);
      if (this.query.search === '') return this.$Message.warning(this.$t('warn.entSearchContent'));
      else if (this.$U.mapScriptSearch(this.query.search)) return this.$Message.warning(this.$t('warn.invalidCH'));
      else if (len > 50) return this.$Message.warning(this.$t('warn.CHLength'));
      this.fetchWorkers('search');
    },
    async handleMoveWorker(name) {
      if (this.selection.length === 0) return this.$Message.warning(this.$t('warn.plSelectWorker'))
      if (this.groupId === name) return this.$Message.warning(this.$t('warn.alreadyInGroup'));
      const workerIds = this.selection.map(item => item.id);
      this.moveWorkerVisible = false;
      try {
        await this.$store.dispatch('workerGroupMove', {groupId: name, workerIds})
        this.$Message.success(this.$t('success.moveGroup'))
        this.$emit("onFetchWorkerGroup");
        this.$emit("onMenuItemSelect");
        this.$emit("onAddMoveAm", name);
      } catch(e) { if (!e.isCodeError) this.$Message.error(this.$t('error.moveGroup')) }
    },
    async handleWorkerDel() {
      this.isloadingDel = true;
      try {
        if (this.fail) {
          await this.$store.dispatch('workerDel', {groupId: this.groupId});
          this.$emit("onMenuItemSelect", '', true);
          this.$emit("onFetchWorkerGroup");
          this.$Message.success(this.$t('success.del'));
        }
        this.isloadingDel = this.modalDelDisableWork = false;
      } catch(e) {
        if (!e.isCodeError) this.$Message.error(this.$t('error.del'));
        this.isloadingDel = false;
      }
    },
    onShowWorkerGraph({userWorkerId, workerId}) {
      this.modalWorkerGraph = true;
      this.userWorkerId = userWorkerId;
      this.workerId = workerId;
      setTimeout(() => { this.fetchHashRateChart() }, 300);
    },
    // 获取单个曲线图
    async fetchHashRateChart() {
      const type = this.graphType;
      //小屏时动态设置#line的width
      if (this.$root.$el) {
        const cW = this.$root.$el.clientWidth;
        if (cW && cW > 0 && cW <= 768) {
          if (document.getElementById('line')) document.getElementById('line').style.width = (cW - 20) + 'px';
        }
      }
      if (!this.echartInstance) this.echartInstance = this.$E.init(document.getElementById('line'));
      this.echartInstance.showLoading({
        text: 'Loading', color: '#1abf87', textColor: '#666',
        maskColor: 'rgba(255, 255, 255, 0.1)', zlevel: 0
      });
      try {
        const data = await this.$store.dispatch('workerGraph', {userWorkerId: this.userWorkerId, type});
        const unit = data.items[0] ? data.items[0].hashRateUnit : '';
        const y = data.items.map(y => y.hashRate);
        let x = [];
        if (type === 'day') x = data.items.map(x => this.$U.fDate(x.createTime, 'MM-DD'));
        else x = data.items.map(x => this.$U.fDate(x.createTime, 'hh:mm'));
        const option = {
          grid: { left: '20px', right: '30px', top: '35px', bottom: '20px', containLabel: true, },
          tooltip: {
            backgroundColor: 'rgba(0,0,0, .5)', textStyle: {color: '#fff'},
            borderColor: 'rgba(0,0,0, .6)', padding: 8, borderWidth: 1,
            trigger: 'axis', axisPointer: { type: 'cross' },
            formatter: params => {
              let date = '';
              if (data.items[0]) {
                if (type === 'day') date = this.$U.fDate(data.items[params[0].dataIndex].createTime, 'YYYY-MM-DD')
                else if (type === 'hour') date = this.$U.fDate(data.items[params[0].dataIndex].createTime, 'YYYY-MM-DD hh:mm')
              }
              return `<span style="color: #62deb6; font-weight: 500; font-size: 18px;">${params[0].value} ${unit}</span> <br /> <span style="color:#d3d3d3；font-size:14px">${date}</span>`
            }
          },
          xAxis: {
            data: x, type: 'category', boundaryGap: false, 
            axisLine: { lineStyle: { color: '#545353' } },
            axisLabel: { color:'rgba(255,255,255, .6)' }
          },
          yAxis: {
            name: unit, nameTextStyle: {color:'rgba(255,255,255, .45)'}, type: 'value', boundaryGap: [0, '100%'],
            splitLine: { show:true, lineStyle:{ color:['#454444'] } },
            axisLabel: { color:'rgba(255,255,255, .6)' },
            axisLine: { show: false, lineStyle: { color: '#5e5d5d' } }
          },
          series: [{
            type: 'line', smooth: true, data: y, symbolSize: 5,
            lineStyle: {
              color: {
                type: 'linear',
                colorStops: [
                  { offset: 0.1, color: '#784a79'},
                  { offset: 0.3, color: '#474fb1'},
                  { offset: 0.6, color: '#a24965'},
                  { offset: 0.9, color: '#784a79'}
                ]
              },
            },
            itemStyle: { color: '#d85450', borderWidth: 1,  },
            yAxis: { name: unit, type: 'value', boundaryGap: [0, '100%'] },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0.2, color: 'rgba(107, 74, 145, 0.3)' },
                    { offset: 1, color: 'rgba(76, 76, 162, 0.3)' }
                  ]
                }
              }
            },
          }]
        };
        this.echartInstance.setOption(option);
        this.echartInstance.hideLoading();
      } catch (e) { this.echartInstance.hideLoading() }
    },
    // 获取当前页矿工曲线图
    async fetchHashRateChartAllWorker(query) {
      const type = this.graphTypeAllWorker;
      this.echartInstanceAllWorker.showLoading({
        text: 'Loading', color: '#1abf87', textColor: '#666',
        maskColor: 'rgba(255, 255, 255, 0.6)', zlevel: 0
      });
      try {
        this.graphAllWorkerLoading = true;
        query.type = type;
        let data = await this.$store.dispatch('workerAllGraph', query);
        this.graphAllWorkerLoading = false;
        this.echartInstanceAllWorker.hideLoading();
        if (data === null || data === 'null' || !data) {
          this.workerAllGraphData = {items: []};
          this.echartInstanceAllWorker.clear();
          this.noData = true;
        } else {
          data.items.forEach(item => {
            item.color = this.$U.getColor();
            item.active = true;
          });
          this.workerAllGraphData = data;
          this.noData = false;
          const option = this.onSetWorkerAllGraphOpt(data);
          this.echartInstanceAllWorker.clear();
          this.echartInstanceAllWorker.setOption(option);
        }
      } catch (e) {
        console.error(e)
        this.graphAllWorkerLoading = false;
        this.echartInstanceAllWorker.hideLoading()
      }
    },
    onSetWorkerAllGraphOpt(d, {type, index, name} = {}) {
      const graphType = this.graphTypeAllWorker, data = d || this.workerAllGraphData;
      const mobileDevice = window.innerWidth <= 414 ? true : false;
      const unit = data.hashRateUnit;
      const legend = [], series = [], x = [], len = data.items.length;
      data.items.forEach((item, ind) => {
        if (type === undefined) {
          item.active = true;
          series.push({
            type: 'line', smooth: true, data: item.points,
            name: item.userWorkerId, yAxis: { type: 'value' },
            lineStyle: { color: item.color }, itemStyle: { color: item.color }
          });
        }
      });
      if (type === 'item') {
        data.items.forEach((item, ind) => {
          if (name !== item.userWorkerId) item.active = false;
          else {
            item.active = true;
            series.push({
              type: 'line', smooth: true, data: data.items[ind].points,
              name: data.items[ind].userWorkerId,
              yAxis: { type: 'value' },
              lineStyle: {color: data.items[ind].color}, itemStyle: {color: data.items[ind].color}
            });
          }
        });
      } else if (type === 'legend') {
        data.items.forEach((item, ind) => {
          if (index === ind) item.active = !item.active;
          if (item.active) {
            series.push({
              type: 'line', smooth: true, data: item.points,
              name: item.userWorkerId, yAxis: { type: 'value' },
              lineStyle: { color: item.color }, itemStyle: { color: item.color }
            });
          }
        });
      } else if (type === 'clear') data.items.forEach((item, ind) => item.active = false);
      if (graphType === 'day') data.timestamps.forEach(t => { x.push(this.$U.fDate(t, 'MM-DD')) });
      else data.timestamps.forEach(t => { x.push(this.$U.fDate(t, 'hh:mm')) });
      return {
        grid: { left: '20px', right: '30px', bottom:'20px', top: '35px', containLabel: true, },
        tooltip: {
          backgroundColor: 'rgba(0,0,0, .7)', textStyle: {color: '#fff'},
          padding: 8, borderWidth: 1,
          trigger: 'axis', axisPointer: { type: 'cross' },
          formatter: params => {
            let html = '', left = '', right = '', middle = '';
            if (mobileDevice) {
              params.forEach((item, index) => {
                left+=`<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`;
              });
              html += `<div style="margin-left: 5px; display: inline-block;">${left}</div>`;
            } else {
              if (len <= 40) {
                params.forEach((item, index) => {
                  index%2 === 1 ? right+= `<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`:
                  left += `<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`;
                });
                html += `
                  <div style="margin-left: 5px; display: inline-block;">${left}</div>
                  <div style="margin-left: 5px; display: inline-block;">${right}</div>
                `
              } else {
                params.forEach((item, index) => {
                  if (index%3 === 1) {
                    middle+= `<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`;
                  } else if (index%3 === 2) {
                    right+= `<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`;
                  } else {
                    left+= `<span style="font-size: 12px;">${item.marker} ${item.seriesName}: ${item.value}</span> <br/>`;
                  }
                });
                html += `
                  <div style="margin-left: 5px; display: inline-block;">${left}</div>
                  <div style="margin-left: 5px; display: inline-block;">${middle}</div>
                  <div style="margin-left: 5px; display: inline-block;">${right}</div>
                `
              }
            }
            return `<div>${html}</div>`
          }
        },
        xAxis: {
          data: x, type: 'category', boundaryGap: false, 
          axisLine: { lineStyle: { color: '#bfbfbf' } },
          axisLabel: { color:'#9e9f9f', fontSize:14, align:'center' },
        },
        yAxis: {
          name: unit, nameTextStyle: {color:'#9e9f9f',fontSize:13}, type: 'value', boundaryGap: [0, '100%'],
          splitLine: { lineStyle:{ color: '#f4f4f4' } },
          axisLabel: { color: '#9e9f9f', fontSize:13, interval:1 },
          axisLine: { show: false }, axisTick: { show: false },
          max: value => parseFloat(value.max*1.1).toFixed(2)
        },
        series
      };
    },
    handleLegendItem(index) {
      this.echartInstanceAllWorker.clear();
      this.echartInstanceAllWorker.setOption(this.onSetWorkerAllGraphOpt(null, {type: 'legend', index}));
    },
    handleLegendItemHover(type, seriesName) {
      const t = type === 'hover' ? 'highlight' : 'downplay'
      this.echartInstanceAllWorker.dispatchAction({ type: t, seriesName });
    },
    handleDisplayAllWorkerGraph(bool) {
      this.echartInstanceAllWorker.clear();
      if (bool) this.echartInstanceAllWorker.setOption(this.onSetWorkerAllGraphOpt());
      else this.echartInstanceAllWorker.setOption(this.onSetWorkerAllGraphOpt(null, {type: 'clear'}));
    },
    handleChangeGraphType(type) {
      this.graphType = type;
      this.fetchHashRateChart();
    },
    handleChangeAllWorkerGraphType(type) {
      this.graphTypeAllWorker = type;
      const queryData = this.onSetQueryData(type);
      this.fetchHashRateChartAllWorker(queryData);
    },
    handleOpenDrop() {
      if (this.selection.length === 0) this.$Message.warning(this.$t('warn.plSelectWorker'));
      else this.moveWorkerVisible = !this.moveWorkerVisible;
    },
    handleMoveGroupOutClick(e) { this.moveWorkerVisible = false },
    handleSearchFocus() { this.miniBarFocus = true },
    removeMiniBarFocus() { this.miniBarFocus = false },
    closeCreateWorkerTip(type){
      if (type == 'forever') localStorage.setItem("closeCreateWorkerTip", true);
      this.showCreateWorkerTip = false;
    }
  }
}
</script>
