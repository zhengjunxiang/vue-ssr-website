<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <div>
          <span class="expand-col-col">{{$t('common.rejectRatio')}}:</span>
          <span class="expand-col-col">{{data.rejectRatio}}</span>
        </div>
        <div>
          <span class="expand-col-col">{{$t('common.shareLastTime')}}:</span>
          <span class="expand-col-col">
            <span :class="textStatus">{{time}}</span>
            <!-- <span class="icon icon-graph" @click="onShowWorkerGraph"></span> -->
          </span>
        </div>
      </Col>
    </Row>
    
  </div>
</template>
<script>
export default {
  props: ['data', 'that'],
  data(){
    return {
      textStatus:'',
      time:''
    }
  },
  mounted(){
    this.formatTime();
    //this.that.onShowWorkerGraph(this.data)
  },
  methods: {
    onShowWorkerGraph(){
      this.that.onShowWorkerGraph(this.data)
    },
    formatTime(){
      const {shareLastTime, workerStatus} = this.data;
      let age = '', time, textStatus = '';
      var dateFormatStr = 'YYYY-MM-DD hh:mm';
      if (workerStatus === 2) {
        this.textStatus = 'inactive-text',
        time = `${this.that.$U.fDate(shareLastTime, dateFormatStr)}`
      } else if (workerStatus === 3) {
        this.textStatus = 'invalid-text',
        time = `${this.that.$U.fDate(shareLastTime, dateFormatStr)}`
      } else time = this.that.$U.fDate(shareLastTime, dateFormatStr);
      this.time = time
    }
  }
};
</script>
<style lang='less'>
@import '../../styles/variable.less';
.expand-row {
  margin-bottom: 0;
}

</style>