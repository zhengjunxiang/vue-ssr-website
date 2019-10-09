<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <div class="expand-row0-row">
          <span class="label">{{$t('incomeRecord.incomeTableHeadICType1')}}</span>
          <span class="">{{type}}</span>
        </div>
        <div class="expand-row0-row">
          <span class="label">{{$t('incomeRecord.incomeTableHeadPay1')}}</span>
          <span :class="payStatusStyle">{{payStatusText}}</span>
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
      payStatusStyle:'',
      payStatusText:''
    }
  },
  mounted(){
    this.getStatus();
  },
  computed: {
    type() {
      if (this.data.type === 'REFUND') return this.$t('incomeRecord.refund');
      return this.data.type.replace('_PLUS', '+');
    }
  },
  methods: {
    getStatus(){
      var payStatus = this.data.payStatus;
      if(payStatus == 'PAID'){
        this.payStatusStyle = 'status-paid';
        this.payStatusText = this.$t('incomeRecord.payStatusPaid')
      }else if(payStatus == 'NOTPAID'){
        this.payStatusStyle = 'status-unPaid';
        this.payStatusText = this.$t('incomeRecord.payStatusUnPaid')
      }else{
        this.payStatusStyle = ''
        this.payStatusText = this.$t('incomeRecord.payStatusSettled')
      }
    }
  }
};
</script>
<style lang='less'>
.expand-row {
  margin-bottom: 0;
}

</style>