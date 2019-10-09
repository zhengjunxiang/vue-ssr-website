<template>
<div class='setting container' style="padding-bottom: 50px; z-index:9;">
  <div class="container-inner">
    <h3 class="con-inner">
      <Button type="primary" class="btn-com liner" @click="handleShowAdd(true)">{{$t('setting.addSub')}}</Button>
      <div class="list-right-opt">
        <Tooltip :content="$t('setting.intoTrash')" placement="left-start">
          <router-link class="icon-btn" to="/setting/trash"><img :src="$U.requireIcon('trash.png')" alt="trash"></router-link>
        </Tooltip>
        <Tooltip :content="$t('setting.setZoom')" placement="left-start">
          <span class="icon-btn" @click="handleShowTime(true)"><img :src="$U.requireIcon('time.png')" alt="time"></span>
        </Tooltip>
      </div>
    </h3>
    <div class="card-box">
      <div class="ant-table">
        
        <Spin size="large" fix v-show="acLoading === true" />
        <div class="ant-noData" v-show="(accounts.length === 0) && (acLoading === false)">{{$t('common.noData')}}</div>

        <div class="ant-table-tr-box" v-for="(item, index) in accounts" :key="index">
          <div class="ant-table-tr" style="overflow: hidden;">
            <div class="userId-box">
              <span>{{$t('setting.sub')}}: </span>
              <span class="userId">{{item.userId}} </span>
              <span v-if="item.emailFrom">({{$t('setting.accreditSub')}}: {{item.emailFrom}})</span> 
              <span v-if="item.remark" class="remark">{{$t('setting.remark')}}{{item.remark}}</span>
            </div>
            <div class="ant-table-opt">
              <Button type="primary" class="btn-com" v-if="!item.emailFrom" @click="handleConfig(item.userId)">{{$t('setting.config')}}</Button>
              <!-- <Button type="primary" class="btn-com" v-if="!item.emailFrom" @click="handleShowShare(true, item.userId)">{{$t('setting.accredit')}}</Button> -->
              <Button type="primary" class="btn-com" v-if="!item.emailFrom" @click="handleShowUpdateRemark(true, item.userId)">{{$t('setting.updateRemark')}}</Button>
              <Button type="primary" class="btn-com del" @click="handleShowDelAccount(true, item)">{{$t('common.del')}}</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="page-box">
        <Page :total="total" v-show="total > 10" size="small" :page-size-opts="[10, 40, 60, $t('common.all')]" :page-size="pageSize" :current="query.pageNum"
          show-total show-sizer @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange" />
      </div>
    </div>

    <Modal v-model="modalAdd" :mask-closable="false" footer-hide class="ant-modal mini">
      <AddSubAccount :modalAdd="modalAdd" @cd="handleSubmitAdd"/>
    </Modal>

    <Modal v-model="modalTime" :mask-closable="false" footer-hide class="mini ant-modal">
      <h3 class="h1">{{$t('setting.timezoneSet')}}</h3>
      <div class="content-box">
        <div class="content-p">{{$t('setting.curTimezone')}}</div>
        <Select v-model="curTimeZone" style="width: 100%; margin-top: 20px;" size="large">
          <Option v-for="(item, index) in timeZone" :value="item.value" :key="index">{{item.label}}</Option>
        </Select>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com liner" @click="handleSetTimeZone" :loading="timeZoneLoading">{{$t('common.confirm')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowTime(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalDel" :mask-closable="false" footer-hide class="mini ant-modal">
      <h3 class="h1">{{$t('setting.delSub')}}</h3>
      <div class="content-box icon-type">
        <div class="content-h">
          <img :src="$U.requireIcon('TK-tishi-icon.png')" alt="icon" class="tip-icon">
          {{curOptAccount.emailFrom ? $t('setting.warning09') : $t('setting.warning03')}} <span class="clr-red">{{curOptAccount.userId}}</span>？
        </div>
        <div class="content-p">{{$t('setting.warning04')}}</div>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com del-liner" @click="handleDelAccount" :loading="delLoading">{{$t('common.del')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowDelAccount(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalShare" :mask-closable="false" footer-hide class="ant-modal modal-share">
      <h3 class="h1"><span class="sub-ac-name">{{shareUserId}}</span> {{$t('setting.warning05')}}</h3>
      <div class="content-box">
        <Form ref="formShare" :model="formShare" :rules="ruleShare">
          <FormItem prop="emailTo">
            <Input size="large" v-model="formShare.emailTo" :placeholder="$t('setting.warning06')" />
          </FormItem>
          <FormItem>
            <Input size="large" v-model="formShare.emailToRemark" :placeholder="$t('setting.noteName')" />
          </FormItem>
          <FormItem prop="permissions" class="checkboxGroup-box">
            <span class="checkboxGroup-title">{{$t('setting.permissions')}}</span>
            <CheckboxGroup v-model="formShare.permissions" style="display: inline-block;">
              <Checkbox label="dashboard">{{$t('setting.dashboard')}}</Checkbox>
              <Checkbox label="payment">{{$t('setting.recvAndPay')}}</Checkbox>
              <Checkbox label="worker">{{$t('setting.worker')}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <p class="tip-text">{{$t('setting.warning07')}}</p>
        <div class="btns-box">
          <Button type="default" @click="handleShare" class="btn-com liner" :loading="shareLoading">{{$t('setting.accredit')}}</Button>
          <Button type="default" class="btn-com w" @click="handleShowShare(false)">{{$t('common.cancel')}}</Button>
        </div>
        <h3 class="h2 pc">{{$t('setting.accreditedSub')}}</h3>
        <div class="ant-table">
          <Spin fix size="large" v-show="shareListLoading" />
          <div class="ant-table-header">
            <span class="ant-table-td">{{$t('setting.email')}}</span>
            <span class="ant-table-td">{{$t('setting.noteName')}}</span>
            <span class="ant-table-td">{{$t('setting.time')}}</span>
            <span class="ant-table-td">{{$t('setting.opt')}}</span>
          </div>
          <div class="ant-table-header m">{{$t('setting.accreditedSub')}}</div>
          <div class="ant-noData" v-if="!shareList.length">{{$t('common.noData')}}</div>
          <div class="ant-table-tr clearfix" v-else v-for="(item, index) in shareList" :key="index">
            <span class="ant-table-td"><span class="display-m">{{$t('setting.email')}}</span> <span class="right-m">{{item.emailTo || '--'}}</span></span>
            <span class="ant-table-td"><span class="display-m">{{$t('setting.noteName')}}</span> <span class="right-m">{{item.emailToRemark || '--'}}</span></span>
            <span class="ant-table-td"><span class="display-m">{{$t('setting.time')}}</span> <span class="right-m">{{$U.fDate(item.createTime) || '--'}}</span></span>
            <span class="ant-table-td">
              <span class="display-m">{{$t('setting.opt')}}</span>
              <span class="right-m"><span class="icon trash" @click="handleShowDelShare(true, item.id, item.emailTo)" /></span>
            </span>
          </div>
        </div>
        <div class="page-box">
          <Page :total="totalShare" v-if="totalShare > 10" size="small" :page-size="queryShare.pageSize"
            :current="queryShare.pageNum" show-total @on-change="handlePageChangeShare" />
        </div>
      </div>
    </Modal>
    <!-- 删除授权提示框 -->
    <Modal v-model="modalDelShare" :mask-closable="false" footer-hide class="mini ant-modal">
      <h3 class="h1">{{$t('setting.delAutSub')}}</h3>
      <div class="content-box icon-type">
        <div class="content-h">
          <img :src="$U.requireIcon('TK-tishi-icon.png')" alt="icon" class="tip-icon"> 
          {{$t('setting.warning08')}} <span class="clr-red">{{delShareEmailTo}}</span>？
        </div>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com del-liner" @click="handleDelShare" :loading="delShareLoading">{{$t('common.del')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowDelShare(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>
    <!-- 修改备注 -->
    <Modal v-model="modalUpdateRemark" :mask-closable="false" footer-hide class="mini ant-modal">
      <h3 class="h1">{{$t('setting.updateRemark')}}</h3>
      <div class="content-box">
        <p>{{$t('setting.updateRemarkTitle')}}</p>
        <Form ref="formRemark" :model="formRemark" :rules="ruleRemark" @submit.native.prevent>
          <FormItem prop="remark">
            <Input v-model="formRemark.remark" size="large" />
          </FormItem>
        </Form>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com liner" @click="handleUpdateRemark" :loading="updateRemarkLoading">{{$t('common.confirm')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowUpdateRemark(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>
  </div>
</div>
</template>

<script>
import {timeZone} from 'src/libs/config';
import { mapGetters } from 'vuex'
import AddSubAccount from './addSubAccount'
export default {
  name: 'Setting',
  data () {
    const validateEmaid = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('warn.plInp')));
      if (!this.$U.mapEmail(value)) callback(new Error(this.$t('warn.inpEmail')));
      else callback();
    };
    const validateRemark = (rule, value, callback) => {
      if (this.$U.mapScriptRemark(value)) callback(new Error(this.$t('warn.invalidCH')));
      if (this.$U.getByteLen(value) > 30) callback(new Error(this.$t('warn.CHLength')));
      else callback();
    };
    return {
      modalAdd: false,
      modalTime: false, curOptAccount: {},
      total: 0, curTimeZone: '', timeZoneLoading: false, accounts: [], acLoading: '',
      modalDel: false, delLoading: false,
      modalUpdateRemark: false, updateRemarkLoading: false, updateRemarkUserId: '',
      query: { pageNum: 1, pageSize: 10 },
      shareList: [], totalShare: 0,
      modalShare: false, shareLoading: false, shareListLoading: false, shareUserId: '',
      queryShare: { pageNum: 1, pageSize: 10 },
      formRemark: { remark: '' },
      ruleRemark: {
        remark: [{ validator: validateRemark, trigger: 'change' }]
      },
      formShare: { emailTo: '', emailToRemark: '', permissions: [] },
      ruleShare: {
        emailTo: [
          { required: true, message: this.$t('warn.plInp'), trigger: 'blur' },
          { validator: validateEmaid, trigger: 'change' }
        ],
        permissions: [
          { required: true, type: 'array', min: 1, message: this.$t('warn.leastSel'), trigger: 'change' }
        ],
      },
      delShareId: '', delShareEmailTo: '', modalDelShare: false, delShareLoading: false
    }
  },
  computed: {
    ...mapGetters(['lan']),
    timeZone() { return timeZone[this.lan] || [] },
    pageSize() {
      if (this.query.pageSize === 1000) return this.$root.$t('common.all');
      return this.query.pageSize;
    }
  },
  components:{ AddSubAccount },
  created() {
    if (process.env.VUE_ENV === 'server') return;
    const settingPageSize = localStorage.getItem('settingPageSize');
    if (settingPageSize) this.query.pageSize = settingPageSize - 0;
  },
  mounted() { this.fetchAccount() },
  methods: {
    async fetchAccount() {
      const {pageNum, pageSize} = this.query;
      try {
        this.acLoading = true;
        const data = await this.$store.dispatch('setAccountQuery', {pageNum, pageSize});
        this.total = data.total;
        this.accounts = data.items;
        this.acLoading = false;
      } catch(e) {
        console.error('e', e);
        this.acLoading = false;
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'))
      }
    },
    async fetchTimezone() {
      try {
        const data = await this.$store.dispatch('setAccountTimezoneQuery');
        this.curTimeZone = data;
      } catch(e) {
        console.error('e', e);
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'));
      }
    },
    async handleSetTimeZone() {
      const {pageNum, pageSize} = this.query;
      try {
        this.timeZoneLoading = true;
        await this.$store.dispatch('setAccountTimezoneUpdate', {zoneName: this.curTimeZone});
        this.timeZoneLoading = this.modalTime = false;
      } catch(e) {
        console.error('e', e);
        this.timeZoneLoading = this.modalTime = false;
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'))
      }
    },
    handleShowUpdateRemark(bool, userId) {
      this.updateRemarkUserId = userId || '';
      this.modalUpdateRemark = bool;
    },
    handleUpdateRemark() {
      this.$refs['formRemark'].validate(async valid => {
        if (valid) {
          try {
            this.updateRemarkLoading = true;
            const data = await this.$store.dispatch('setAccountUpdateRemark', {
              userId: this.updateRemarkUserId, remark: this.formRemark.remark
            });
            if (data-0 === 0) this.$Message.error(this.$t('error.updateErr'));
            this.updateRemarkLoading = this.modalUpdateRemark = false;
            this.formRemark.remark = '';
            this.fetchAccount();
          } catch(e) {
            console.error(e);
            this.updateRemarkLoading = false;
          }
        } else this.$Message.error(this.$t('valid.validError'));
      });
    },
    handleShowAdd(bool) {this.modalAdd = bool},
    handleShowDelAccount(bool, item) {
      if (bool === false) return this.modalDel = false;
      this.modalDel = true;
      this.curOptAccount = item;
    },
    async handleDelAccount() {
      try {
        this.delLoading = true;
        const {id, userId, emailFrom = ''} = this.curOptAccount;
        await this.$store.dispatch('setAccountDelete', {id, userId, emailFrom});
        this.delLoading = false;
        this.modalDel = false;
        this.$store.commit('setFetchUserList');
        this.fetchAccount();
      } catch(e) {
        console.error('e', e);
        this.delLoading = this.modalDel = false;
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'))
      }
    },
    handleShowTime(bool) {
      this.curTimeZone = '';
      if (bool) this.fetchTimezone();
      this.modalTime = bool;
    },
    handleSubmitAdd() {
      this.modalAdd = false;
      this.$store.commit('setFetchUserList');
      this.fetchAccount();
    },
    handlePageChange(num) {
      this.query.pageNum = num;
      this.fetchAccount();
    },
    handlePageSizeChange(size) {
      if (typeof size !== "number") {
        this.query.pageSize = 1000;
        localStorage.setItem('settingPageSize', 1000);
      } else {
        this.query.pageSize = size;
        localStorage.setItem('settingPageSize', size);
      }
      if (this.query.pageNum === 1) this.fetchAccount();
    },
    handleConfig(userIdConf) { this.$router.push({ path: '/setting/configuration', query: { userIdConf } }) },
    handleShowShare(bool, userId) {
      if (bool === false) return this.modalShare = false;
      this.shareUserId = userId;
      this.modalShare = true;
      this.fetchShareList();
    },
    async fetchShareList() {
      const { pageNum, pageSize } = this.queryShare;
      try {
        this.shareListLoading = true;
        const data = await this.$store.dispatch('setAccountShareQuery', {pageNum, pageSize, emailFrom: this.shareUserId});
        this.shareListLoading = false;
        this.shareList = data.items;
        this.totalShare = data.total;
      } catch(e) {
        console.error(e)
        this.shareListLoading = false;
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'));
      }
    },
    handleShare() {
      const {emailTo, emailToRemark, permissions} = this.formShare;
      const data = {emailTo, userId: this.shareUserId};
      if (emailToRemark) data.emailToRemark = emailToRemark;
      if (permissions.length) data.permissions = permissions.join(',');
      this.$refs['formShare'].validate(async valid => {
        if (valid) {
          try {
            this.shareLoading = true;
            await this.$store.dispatch('setAccountShareAdd', data);
            this.modalShare = this.shareLoading  = false;
            this.$Message.success(this.$t('success.shareAccount'));
          } catch(e) {
            if (e.isCodeError !== true) this.$Message.error(this.$t('error.shareAccount'));
            console.error(e);
            this.shareLoading  = false;
          }
        } else this.$Message.error(this.$t('error.valFails'));
      })
    },
    handlePageChangeShare(num) {
      this.queryShare.pageNum = num;
      this.fetchShareList();
    },
    handleShowDelShare(bool, id, email) {
      this.modalDelShare = bool;
      if (id) this.delShareId = id;
      if (email) this.delShareEmailTo = email;
    },
    async handleDelShare() {
      try {
        this.delShareLoading = true;
        await this.$store.dispatch('setAccountShareDelete', {id: this.delShareId});
        this.fetchShareList();
        this.delShareLoading = this.modalDelShare = false;
      } catch(e) {
        console.error(e);
        this.delShareLoading = this.modalDelShare = false;
        if (!e.isCodeError) this.$Message.error(this.$t('error.fetchErr'));
      }
    }
  }
}
</script>

<style lang='less'>
@import './index.less';
@import './index-m.less';
</style>
