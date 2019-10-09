<template>
  <div class='setting container' style="padding-bottom: 50px;">
    <div class="container-inner">
      <span class="h1 con-inner">{{$t('setting.hasDelSub')}}</span>
      <div class="card-box">
        <div class="ant-table">

          <Spin size="large" fix v-show="acLoading === true" />
          <div class="ant-noData" v-show="(accounts.length === 0) && (acLoading === false)">{{$t('common.noData')}}</div>

          <div class="ant-table-tr-box" v-for="(item, index) in accounts" :key="index">
            <div class="ant-table-tr">
              <span>{{$t('setting.sub')}}: {{item.userId}} <span v-if="item.emailFrom">({{$t('setting.accreditSub')}}: {{item.emailFrom}})</span> </span>
              <span class="ant-table-opt">
                <Button type="primary" class="btn-com" @click="handleShowModal(true, item.userId, item.id)">{{$t('setting.recover')}}</Button>
              </span>
            </div>
          </div>
        </div>
        <div class="page-box">
          <Page :total="total" v-show="total > 10" size="small" :page-size-opts="[10, 40, 60]" :page-size="query.pageSize" :current="query.pageNum"
            show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
        </div>
      </div>
    </div>

    <Modal v-model="modalRecover" :mask-closable="false" footer-hide class="ant-modal mini">
      <h3 class="h1">{{$t('setting.recoverSub')}}</h3>
      <div class="content-box icon-type">
        <div class="content-h">
          <img :src="$U.requireIcon('TK-tishi-icon.png')" alt="icon" class="tip-icon"> 
          {{$t('setting.suerRecSub')}} <span class="clr-red">{{recoverAccount}}</span> ？
        </div>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com liner" @click="handleRecoverAccount" :loading="recoverLoading">{{$t('common.confirm')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowModal(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'setting-trash',
  data () {
    return {
      modalRecover: false, total: 0, accounts: [], acLoading: '', recoverAccount: '', recoverId: '',
      recoverLoading: false,
      query: { pageNum: 1, pageSize: 10 }
    }
  },
  mounted() { this.fetchAccountRecycle() },
  methods: {
    async fetchAccountRecycle() {
      const {pageNum, pageSize} = this.query;
      try {
        this.acLoading = true;
        const data = await this.$store.dispatch('setAccountRecycleQuery', {pageNum, pageSize});
        this.total = data.total;
        this.accounts = data.items;
        this.acLoading = false;
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.log(e);
        this.acLoading = false;
      }
    },
    async handleRecoverAccount() {
      try {
        this.recoverLoading = true;
        await this.$store.dispatch('setAccountRecycleRecover', {id: this.recoverId});
        this.recoverLoading = this.modalRecover = false;
        this.$store.commit('setFetchUserList');
        this.fetchAccountRecycle();
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.log(e);
        this.modalRecover = this.recoverLoading = false;
      }
    },
    handleShowModal(bool, account, id) {
      this.modalRecover = bool;
      this.recoverAccount = account;
      this.recoverId = id;
    },
    handlePageChange(num) {
      this.query.pageNum = num;
      this.fetchAccountRecycle();
    },
    handlePageSizeChange(size) {
      this.query.pageSize = size;
      this.fetchAccountRecycle();
    }
  }
}
</script>

<style lang='less'>
@import '../index';
@import '../index-m';
</style>