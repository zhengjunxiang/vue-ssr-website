<template>
  <div class="user container">
    <div class="dashboard-nodata container-inner" style="padding: 0;">
      <!-- 页面初始化loading -->
      <div class="init-loading" v-show="displayCreatSubAcc === 'loading'">{{$t('common.loading')}}</div>
      <!-- 创建子账号提示 -->
      <NoSubAccountTip v-if="displayCreatSubAcc === true" />
      <!-- 添加矿机指南 -->
      <watchMode v-if="isShowRemind === true && (displayCreatSubAcc === false)" />
    </div>

    <transition name="fade" mode="out-in">
      <div class="container-inner-adaption container-inner clearfix"
        v-if="isShowRemind === false && (displayCreatSubAcc === false)" style="overflow: unset;">
        <div class="left-sider-adaption left-sider">
          <div class="data-display-box">
            <div class="data-item-time">
              <span class="update-text">{{$t('user.updateTime')}}</span>
              <span class="update-time">{{updateTime}}</span>
            </div>
            <div class="data-item">
              <div class="data-item-dataInfo">
                <span class="f-20">{{totalHash}}</span> 
                <span class="gray-text">{{unit}}</span>
              </div>
              <div class="gray-text"><span class="data-item-label">{{$t('user.totalHash')}}</span>
                <Tooltip max-width="368" class="tip-box">
                  <span class="icon-qst">?</span>
                  <div slot="content" class="tip-box-info">
                    <p>{{$t('user.totleHash')}}</p>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div class="data-item">
              <div class="data-item-dataInfo">
                <span class="f-20 hv-udl" @click="handleToAddStatus(0)">{{total}}</span> 
                <span class="gray-text">/</span>
                <span class="f-20 online-miner" @click="handleToAddStatus(1)">{{online}}</span> 
                <span class="gray-text">/</span>
                <span class="f-20 hv-udl" style="color: #f95050;" @click="handleToAddStatus(2)">{{offline}}</span> 
                <span class="gray-text">/</span>
                <span class="f-20 hv-udl" @click="handleToAddStatus(3)" style="color: #616161;">{{disable}}</span>
              </div>
              <div class="gray-text">
                <span class="data-item-label">{{$t('user.allMiner')}}</span>
                <Tooltip max-width="368" class="tip-box">
                  <span class="icon-qst">?</span>
                  <div slot="content" class="tip-box-info">
                    <p>{{$t('user.allMiner')}} {{$t('common.all')}} / <span style="color:#45ad02;">{{$t('status.active')}}</span> / <span style="color: #fe3a46;">{{$t('status.inactive')}}</span> / {{$t('status.invalid')}}</p>
                    <p>{{$t('status.inactive')}}: {{$t('user.inactiveEx')}}</p>
                    <p>{{$t('status.invalid')}}: {{$t('user.invalidEx')}}</p>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div class="data-item" style="position:relative;" v-if="workerWarnIsShow === true">
              <Spin v-if="loadingGroup" fix size="small" />
              <span class="workerWarn-btn" @click="initWorkerWarnForm"><i></i>{{$t('workerWarn.btn')}}</span>
            </div>
          </div>

          <div class="miner-addr-box">
            <Spin v-if="loadingGroup" fix size="large" />
            <Menu ref="menu" :active-name="activeNameId" @on-select="handleMenuItemSelect">
              <MenuItem v-for="(item, index) in workerGroup" :name="item.id" :key="index">
                {{typeof item.groupName === 'string' ? item.groupName : item.groupName($root)}} 
                <div class="badge" :id="`badge${item.id}`">{{item.workerNum}}</div>
              </MenuItem>
            </Menu>

            <div class="opt-btn-box" v-show="!isWatchMode">
              <div>
                <Button type="primary" class="add" @click="handleShowModal('add')">
                  <span class="icon"></span> {{$t('user.createGroup')}}
                </Button>
              </div>
              <div>
                <Button type="primary" class="del" v-show="showDelBtn" @click="handleShowModal('del')">
                  <span class="icon"></span> {{$t('user.deleteGroup')}}
                </Button>
              </div>
              <div>
                <Button type="primary" class="help">
                  <span class="icon"></span> {{$t('user.groupGuide')}}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <rightPart ref="rightPart" :groupId="activeNameId" :workerGroup="workerGroup" :loadingGroup="loadingGroup"
          @onFetchWorkerGroup="fetchWorkerGroup" @onAddMoveAm="onAddMoveAm" @onMenuItemSelect="handleMenuItemSelect" />
      </div>
    </transition>

    <!--矿工掉线提醒 开始-->
    <Modal v-model="modalWorkerWarn" :mask-closable="false" footer-hide class="modal-confirm-workerWarn modal-confirm modal-confirm-adaption"
      class-name="vertical-center-modal">
        <div class="ivu-modal-header-inner">
          <span>{{$t('workerWarn.modalTitle')}}</span>
          <Tooltip class="workerWarn-tip-box tip-box" >
            <span class="workerWarn-icon-qst icon-qst">i</span>
            <div slot="content" class="tip-box-info">
              <p>{{$t('workerWarn.modalTip0')}}<span style="color:#fb6565;">20</span>{{$t('workerWarn.modalTip01')}}</p>
              <p>{{$t('workerWarn.modalTip1')}}<span style="color:#9af451;">1</span>{{$t('workerWarn.modalTip11')}}</p>
            </div>
          </Tooltip>
        </div>
        <div class="workerWarn-infoBox">
            <div class="ivu-form-item ivu-form-item1">
              <label class="ivu-form-item-label">{{$t('workerWarn.label1')}}</label>
              <i-Switch v-model="workerWarnModel.switch" @on-change="workerWarnSwitch" class="switch-reset">
                  <span slot="open"></span>
                  <span slot="close"></span>
              </i-Switch>
            </div>
            <div class="ivu-form-item ivu-form-item2">
              <label class="ivu-form-item-label">{{$t('workerWarn.label2')}}</label>
              <span class="addWorkerWarnList-btn" @click="addWorkerWarnList">{{$t('workerWarn.addBtn')}}</span>
            </div>
            <p v-if="workerWarnListTip == true" class="warnList-tip">{{workerWarnListTipText}}</p>
            <!--添加联系人 form start-->
            <transition name="fadeForm">
              <div v-if="addWorkerWarnListForm">
                <Form 
                ref="formWorkerWarn" 
                :model="workerWarnModel" 
                :rules="workerWarnRuleValidator" >
                  <FormItem prop="warnName">
                    <Input 
                      v-model="workerWarnModel.warnName" 
                      :placeholder="$t('workerWarn.plholder1')" 
                      class="workerWarn-input-name addGroup-input" 
                      :class="{'divFocus':nameFocus == true}" 
                      @on-focus="addFocus" 
                      @on-blur="removeFocus">
                      <span slot="prepend">{{$t('workerWarn.label3')}}</span>
                    </Input>
                  </FormItem>
                  <FormItem prop="contact" class="select-workerWarn-form-item">
                    <Select 
                      v-model="workerWarnModel.contact" 
                      @on-change="workerWarnContactSelect" 
                      :label="workerWarnModel.contact" 
                      class="ivu-select-workerWarn">
                      <Option v-for="item in workerWarnContactList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem :prop="workerWarnModel.contact" class="contact-workerWarn-form-item">
                    <Input 
                      v-show="workerWarnModel.contact=='email'" 
                      v-model="workerWarnModel.email" 
                      type="email" 
                      :placeholder="$t('workerWarn.tip2')" 
                      class="workerWarn-input-email addGroup-input"/>
                    <Input 
                      v-show="workerWarnModel.contact=='phone'" 
                      v-model="workerWarnModel.phone" 
                      :placeholder="$t('workerWarn.tip4')" 
                      class="workerWarn-input-tel addGroup-input" 
                      :class="{'divFocus':nameFocus == true}" 
                      @on-focus="addFocus" 
                      @on-blur="removeFocus">
                      <span slot="prepend">+86</span>
                    </Input>
                  </FormItem>
                  <div class="modal-btn-box btn-box clearfix" style="margin-right:0">
                    <Button type="primary" class="select" @click="workerWarnAddSave">{{$t('workerWarn.btnSave')}}</Button>
                    <Button type="primary" @click="workerWarnAddCancle">{{$t('workerWarn.btnCle')}}</Button>
                  </div>
                </Form>
              </div>
            </transition>
            <!--添加联系人 form end-->
            <!--联系人列表 start-->
            <div class="workerWarnList" v-if="workerWarnList.length > 0">
              <div class="lst-body">
                <div class="lst-item-thead lst-item">
                  <span class="first-child">{{$t('workerWarn.label3')}}</span>
                  <span>{{$t('workerWarn.thTitle')}}</span>
                  <span class="last-child">{{$t('workerWarn.thOpt')}}</span>
                </div>
                <div class="lst-item" v-for="(item, index) in workerWarnList" :key="'lst'+index">
                  <span class="align-left">{{item.name}}</span>
                  <span>{{item.contact}}</span>
                  <span class="align-right">
                    <i class="workerWarnList-delBtn" @click="workerWarnListDel(item)"></i>
                  </span>
                </div>
              </div>
            </div>
            <!--联系人列表 end-->
        </div>
    </Modal>
    <!--矿工掉线提醒 结束-->
    <Modal v-model="modalAdd" :mask-closable="false" :title="$t('user.createGroup')" footer-hide class="modal-confirm modal-confirm-adaption"
      class-name="vertical-center-modal">
      <p class="addGroup-des" v-if="lan === 'zh'">{{$t('user.createGroupToAccount')}}“{{userId}}”{{$t('user.createGroupToAccount1')}}</p>
      <p class="addGroup-des" v-else>{{$t('user.createGroupToAccount')}}{{$t('user.createGroupToAccount1')}}"{{userId}}"</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <FormItem prop="groupName">
          <Input class="addGroup-input" v-model="formValidate.groupName" :placeholder="$t('user.createGroupToAccountHolder')" @on-keydown="handlekeydown"/>
        </FormItem>
      </Form>
      <div class="modal-btn-box btn-box">
        <Button type="primary" class="select" :loading="loadingModal" @click="handleAddGroup">{{$t('common.save')}}</Button>
      </div>
    </Modal>
    <Modal v-model="modalRemove" :mask-closable="false" :title="$t('user.delGroup')" footer-hide class="modal-confirm modal-confirm-adaption"
      class-name="vertical-center-modal">
      <p class="modal-confirm-info">
        <span class="modal-icon-warning">!</span>
        <span>{{$t('user.delGroup1')}} <span class="clr-red">({{groupNameDel}})</span></span>
      </p>
      <div class="modal-btn-box btn-box">
        <Button type="primary" class="del-liner" :loading="loadingModal"
         @click="handleDelGroup">{{$t('common.del')}}</Button>
        <Button type="default" @click="modalRemove = false">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import rightPart from './right-part'
import watchMode from './watchMode'
import { mapGetters } from 'vuex'
import { baseUrl } from '../../libs/config'
import NoSubAccountTip from 'src/components/noSubAccountTip/index'
export default {
  name: 'Worker',
  components: { rightPart, watchMode, NoSubAccountTip },
  data() {
    const validateGrounName = (rule, value, callback) => {
      const len = this.$U.getByteLen(value);
        if (value === '') callback(new Error(this.$t('warn.plInp')));
        else if (this.$U.mapScript(value)) callback(new Error(this.$t('warn.invalidCH')));
        else if (len > 20 || len < 3) callback(this.$t('warn.CHLength'));
        else callback();
    };
    const validateWarnEmail = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('workerWarn.tip2')));
      else if (!this.$U.emailScript(value)) callback(new Error(this.$t('workerWarn.tip3')));
      else callback();
    };
    const validateWarnTel = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('workerWarn.tip4')));
      else if (!this.$U.telScript(value)) callback(new Error(this.$t('workerWarn.tip5')));
      else callback();
    };
    const validateWarnName = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('workerWarn.tip6')));
      else callback();
    };
    return {
      workerGroup: [], activeNameId: '', groupNameDel: '',
      unit: '', totalHash: '0.00', disable: 0, offline:0, online:0, total: 0, updateTime: '',
      modalAdd: false, modalRemove: false, loadingModal: false, loadingGroup: false,
      formValidate: { groupName: '' },
      ruleValidate: {
        groupName: [{ validator: validateGrounName, trigger: 'change' }]
      },
      modalWorkerWarn:false,
      addWorkerWarnListForm:false,
      workerWarnModel:{
        switch:false,
        warnName:'',
        contact:'email',
        email:'',
        phone:'',
        countryCode:'86'
      },
      workerWarnRuleValidator:{
        warnName: [{validator: validateWarnName, trigger: 'blur'}],
        email: [{validator: validateWarnEmail, trigger: 'blur'}],
        phone: [{validator: validateWarnTel, trigger: 'blur'}]
      },
      workerWarnContactList:[
        {
          value: 'email',
          label: this.$t('workerWarn.sltEmail')
        },
        {
          value: 'phone',
          label: this.$t('workerWarn.sltTel')
        }
      ],
      workerWarnList: [],
      workerWarnListTip: false,
      workerWarnListTipText: '',
      nameFocus: false
    }
  },
  computed: {
    ...mapGetters(['lan', 'userId', 'reFetchApi', 'isWatchMode', 'isShowRemind', 'currentCoin', 'displayCreatSubAcc', 'isInitData', 'workerWarnIsShow']),
    showDelBtn() {
      const name = this.activeNameId;
      return !(name === -1 || name === -2);
    },
  },
  watch: {
    reFetchApi(bool) {
      if (this.isShowRemind === true || this.displayCreatSubAcc === true) return null;
      this.fetchWorkerGroup(() => {
        this.$nextTick(() => { this.$refs['menu'].updateActiveName() });
      }, true);
    },
    isInitData(bool) { if (bool) this.initdata() },
    workerWarnList(newV, oldV) {
      if (newV.length < 1) this.showWorkerWarnTip('tip7');
      else if (newV.length >=3 ) {
        this.showWorkerWarnTip('tip0');
        this.addWorkerWarnListForm = false;
      } else this.workerWarnListTip = false;
    }
  },
  mounted() { if (this.isInitData) this.initdata() },
  methods: {
    async initdata() {
      if (this.isShowRemind === true || this.displayCreatSubAcc === true) return null;
      this.fetchWorkerGroup(() => {
        setTimeout(() => {
          if (this.$refs['menu']) this.$refs['menu'].updateActiveName();
        }, 600);
      }, true);
      this.fetchWorkerWarnIsShow();//初始化预警白名单
    },
    async fetchWorkerWarnIsShow(){
      await this.$store.dispatch("workerWarnIsShow");
    },
    async fetchWorkerGroup(cd, isResetActiveNameId) {
      if (isResetActiveNameId) {
        this.activeNameId = -2;
        this.$nextTick(() => { this.handleMenuItemSelect() });
      }
      try {
        const data = await this.$store.dispatch("workerGroup", {pageNum: 1, pageSize: 200});
        if (data.items) {
          data.items.forEach(item => {
            if (item.id === -2) item.groupName = (root) => root.$t('user.allGroup');
            if (item.id === -1) item.groupName = (root) => root.$t('user.defaultGroup');
          })
          this.workerGroup = data.items;
          if (cd) cd();
        }
      } catch (e) {
        this.$Message.error(this.$t('error.getGroup'));
        console.error("error", e);
      }
    },
    async handleMenuItemSelect(name, refreshSummary) {
      if (name) this.activeNameId = name;
      setTimeout(() => {
        if (this.$refs["rightPart"]) this.$refs["rightPart"].fetchWorkers();
      }, 600);
      try {
        this.loadingGroup = true;
        if (refreshSummary && name !== -2 && this.activeNameId !== -2) {
          const data = await this.$store.dispatch("workerGroupSummary", {groupId: -2});
          this.updateTime = this.$U.fDate(new Date().getTime(), 'MM-DD hh:mm:ss');
          this.unit = data.unit;
          this.totalHash = data.totalHash;
          this.disable = data.disableWorkerNum;
          this.offline = data.offlineWorkerNum;
          this.online = data.onlineWorkerNum;
          this.total = data.totalWorkerNum;
        }
        const data = await this.$store.dispatch("workerGroupSummary", {groupId: name || this.activeNameId});
        this.loadingGroup = false;
        this.workerGroup.some(item => {
          if (item.id === data.groupId) return item.workerNum = data.totalWorkerNum;
        });
        setTimeout(() => {
          if (this.$refs["rightPart"]) this.$refs["rightPart"].onSetTab(data);
        }, 300);
        if (name === -2 || this.activeNameId === -2) {
          this.updateTime = this.$U.fDate(new Date().getTime(), 'MM-DD hh:mm:ss');
          this.unit = data.unit;
          this.totalHash = data.totalHash;
          this.disable = data.disableWorkerNum;
          this.offline = data.offlineWorkerNum;
          this.online = data.onlineWorkerNum;
          this.total = data.totalWorkerNum;
        }
      } catch (e) {
        this.loadingGroup = false;
        console.error(e)
      }
    },
    onAddMoveAm(id) {
      const domMeunItem = document.getElementById(`badge${id}`);
      domMeunItem.classList.add('moveTo')
      setTimeout(() => { domMeunItem.classList.remove('moveTo') }, 800)
    },
    handleToAddStatus(status) {
      this.activeNameId = -2;
      this.$nextTick(() => {
        this.$refs['menu'].updateActiveName();
        this.$refs['rightPart'].handleTabClick(status);
      });
    },
    handleShowModal(type) {
      if (type === 'add') this.modalAdd = true;
      else if (type === 'del') {
        this.modalRemove = true;
        this.workerGroup.some(item => {
          if (item.id === this.activeNameId) return this.groupNameDel = item.groupName;
        });
      }
    },
    handleAddGroup() {
      this.$refs['formValidate'].validate(async valid => {
        if (valid) {
          try {
            this.loadingModal = true;
            await this.$store.dispatch('workerGroupAdd', {groupName: this.formValidate.groupName});
            this.formValidate.groupName = '';
            this.modalAdd = false;
            this.loadingModal = false;
            this.fetchWorkerGroup();
            this.$Message.success(this.$t('success.addGroup'));
          } catch (e) {
            if (!e.isCodeError) this.$Message.error(this.$t('error.addGroup'));
            this.loadingModal = false
          }
        } else this.$Message.error(this.$t('error.check'));
      })
    },
    async handleDelGroup() {
      this.loadingModal = true;
      try {
        await this.$store.dispatch('workerGroupDel', {groupId: this.activeNameId})
        this.modalRemove = false;
        this.loadingModal = false;
        this.$refs['rightPart'].handleTabClick(0, false)
        this.fetchWorkerGroup(() => {
          this.$nextTick(() => { this.$refs['menu'].updateActiveName() });
        }, true);
        this.$Message.success(this.$t('success.delGroup'));
      } catch (e) {
        this.loadingModal = false
        if (!e.isCodeError) this.$Message.error(this.$t('error.delGroup'));
      }
    },
    handlekeydown(e) {
      if (e.keyCode === 13) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
      }
    },
    async initWorkerWarnForm(){//初始化矿工掉线提醒表单内容
      //获取表单数据 并初始化数据
      let query = {
        'userId':this.userId,
        'coinType':this.currentCoin
      }
      var data = await this.$store.dispatch("workerWarnQuery", query);
      this.workerWarnModel.switch = data.switcher;
      this.workerWarnList = data.items;
      this.modalWorkerWarn = true;
    },
    async workerWarnSwitch(e){
      //是否显示添加至少一个提醒联系人tip
      if (this.workerWarnList.length < 1) this.showWorkerWarnTip('tip7');
      else {
        this.workerWarnListTip = false;
        let query = {
          'userId':this.userId,
          'coinType':this.currentCoin,
          'openFlag':e
        }
        var messageText = e == true ? this.$t('success.openAlarm') : this.$t('success.closeAlarm');
        try {
          await this.$store.dispatch('workerWarnSwitcher', query)
          this.$Message.success(messageText);
        } catch (e) {
          if (!e.isCodeError) this.$Message.error(messageText);
        }
      }
    },
    showWorkerWarnTip(str){
      this.workerWarnListTip = true;
      this.workerWarnListTipText = this.$t('workerWarn.'+str);
    },
    workerWarnContactSelect(v){
      this.workerWarnModel.email = '';
      this.workerWarnModel.phone = '';
    },
    addWorkerWarnList(){
      if (this.workerWarnList.length >= 3) {
        this.workerWarnListTip = true;
        this.workerWarnListTipText = this.$t('workerWarn.tip0')
      } else {
        this.addWorkerWarnListForm = true
      }
    },
    workerWarnAddSave(){
      this.$refs['formWorkerWarn'].validate(async valid => {
        if (valid) {
          try {
            let contactType = this.workerWarnModel.contact == 'email' ? 0 : 1;
            var formData = new FormData();
            formData.append('userId', this.userId);
            formData.append('coinType', this.currentCoin);
            formData.append('name', this.workerWarnModel.warnName);
            formData.append('type', contactType);
            formData.append('email', this.workerWarnModel.email);
            formData.append('phone', this.workerWarnModel.phone);
            formData.append('countryCode', this.workerWarnModel.countryCode);
            formData.append('language', this.lan);
            await this.$store.dispatch('workerWarnAddSave', formData);
            this.$refs['formWorkerWarn'].resetFields();//清空表单项
            this.initWorkerWarnForm();//重新加载列表数据
            this.$Message.success(this.$t('success.alarmContactAdd'));
          } catch (e) {
            if (!e.isCodeError) this.$Message.error(this.$t('error.alarmContactAdd'));
          }
        } else this.$Message.error(this.$t('error.check'));
      })
    },
    workerWarnAddCancle(){
      this.addWorkerWarnListForm = false;
      this.$refs['formWorkerWarn'].resetFields();
    },
    async workerWarnListDel(item){
      let query = {
        'userId': this.userId,
        'coinType': this.currentCoin,
        'id': item.id
      }
      try {
        await this.$store.dispatch('workerWarnListDel', query)
        this.$Message.success(this.$t('success.alarmContactDel'));
        this.initWorkerWarnForm();//重新加载列表数据
      } catch (e) {
        if (!e.isCodeError) this.$Message.error(this.$t('error.alarmContactDel'));
      }
    },
    addFocus() { this.nameFocus = true },
    removeFocus() { this.nameFocus = false },
  }
}
</script>
<style lang='less'>
@import '../../styles/variable.less';
@import './index.less';
@import './workerWarnModal.less';
</style>
