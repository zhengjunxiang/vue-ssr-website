<template>
  <div class='setting configuration container'>
    <div class="container-inner">
      <h3 class="h1 con-inner">
        <Button type="primary" class="btn-com" @click="handleBack"
          style="padding: 0 10px !important; line-height: 30px;">{{$t('common.back')}}</Button>
        {{$t('setting.sub')}} {{userIdConf}}
      </h3>
      <div class="card-box">
        <div class="ant-table">
          <div class="ant-table-header">
            <span class="ant-table-td">{{$t('setting.coin')}}</span>
            <span class="ant-table-td">{{$t('setting.pay')}}</span>
            <span class="ant-table-td">{{$t('setting.mode')}}</span>
            <span class="ant-table-td">{{$t('setting.wallet')}}</span>
            <span class="ant-table-td">{{$t('setting.opt')}}</span>
          </div>

          <div class="ant-noData" v-show="coinsLoading === true">{{$t('common.loading')}}</div>
          <div class="ant-noData" v-show="(coins.length === 0) && (coinsLoading === false)">{{$t('common.noData')}}</div>

          <div :class="`ant-table-tr-box ${editingIndex === index ? 'editting' : ''}`" v-for="(item, index) in coins" :key="index">
            <div class="ant-table-tr clearfix">
              <div v-if="editingIndex === index">
                <span class="ant-table-td">
                  <img :src="$U.requireCurrencyImg(`${item.coinType}.png`)" :alt="item.coinType"> 
                  {{item.coinType}}
                </span>
                <span class="ant-table-td">
                  <span class="display-m label-text">{{$t('setting.pay')}}</span>
                  <Input v-model="query.miniPayment" size="large" />
                  <div class="tip-text">{{$t('setting.minPay')}} {{item.miniPaymentSystem}}</div>
                </span>
                <span class="ant-table-td">
                  <span class="display-m label-text">{{$t('setting.mode')}}</span>
                  <Select v-model="query.payMethod" size="large">
                    <Option v-for="(it, ind) in item.payMethodList" :value="it" :key="ind">{{it}}</Option>
                  </Select>
                </span>
                <span class="ant-table-td block">
                  <span class="display-m label-text">{{$t('setting.wallet')}}</span>
                  <Input v-model="query.wallet" style="width: 80%;" size="large" :disabled="item.isLocked+'' === '1'" />
                  <Input v-model="query.paymentId" style="width: 80%; margin-top: 10px;" v-if="item.coinType === 'XMC'"
                    :placeholder="$t('setting.paymentId')" size="large" :disabled="item.isLocked+'' === '1'" />
                </span>
                <span class="ant-table-td">
                  <Button type="primary" class="btn-com" @click="handleUpdate(index)" :loading="settingLoading">{{$t('common.confirm')}}</Button>
                  <Button type="primary" class="btn-com w" @click="handleUpdate('')">{{$t('common.cancel')}}</Button>
                </span>
              </div>
              <div v-else>
                <span class="ant-table-td">
                  <img :src="$U.requireCurrencyImg(`${item.coinType}.png`)" :alt="item.coinType"> {{item.coinType}}
                  <span v-if="(item.coinType === 'BTC' || item.coinType === 'BCH') && item.wallet" class="display-m right-m">
                    <span v-if="item.miningCoin" :style="`color: ${item.coinType === 'BTC' ? '#f5904c' : '#63a92a'}`">
                      {{$t('setting.mining')}}{{item.coinType}}
                    </span>
                    <span v-else @click="handleShowSwitch(true, item)"
                      :style="`color: ${item.coinType === 'BTC' ? '#f5904c' : '#63a92a'}; cursor: pointer;`">
                      {{$t('setting.switch')}}{{item.coinType}}
                    </span>
                  </span>
                </span>
                <span class="ant-table-td"><span class="display-m label-text">{{$t('setting.pay')}}</span>{{item.miniPayment || '--'}}</span>
                <span class="ant-table-td"><span class="display-m label-text">{{$t('setting.mode')}}</span>{{item.payMethod || '--'}}</span>
                <span class="ant-table-td block">
                  <span class="display-m label-text">{{$t('setting.wallet')}}</span>
                  <div>
                    <img :src="$U.requireIcon('lock.png')" alt="lock" class="table-icon"
                      v-if="item.isLocked+'' === '1'" @click="handleShowLock(true, 'lock')" />
                    <img :src="$U.requireIcon('unlock.png')" alt="unlock" class="table-icon"
                      v-else @click="handlShowLockComfrin(true, item)" />
                    {{item.wallet || '--'}} 
                    <span v-if="(item.coinType === 'BTC' || item.coinType === 'BCH')" class="display-pc coin-opt">
                      <span v-if="item.miningCoin" :style="`color: ${item.coinType === 'BTC' ? '#f5904c' : '#63a92a'}`">
                        {{$t('setting.mining')}} {{item.coinType}}
                      </span>
                      <span v-else @click="handleShowSwitch(true, item)"
                        :style="`color: ${item.coinType === 'BTC' ? '#f5904c' : '#63a92a'}; cursor: pointer;`" class="coinChange-hover">
                        {{$t('setting.switch')}} {{item.coinType}}
                      </span>
                    </span>
                  </div>
                </span>
                <span class="ant-table-td">
                  <div class="ant-table-opt">
                    <span @click="handleEdit(index)" class="hover light-c right-line">{{$t('setting.edit')}}</span>
                    <span @click="handleShowQr(index)" :class="`hover light-c ${item.moreList2.length ? 'right-line' : ''}`">
                      {{$t('setting.obMode')}}
                    </span>
                    <!-- 设置更多操作 -->
                    <Dropdown trigger="click" placement="bottom-end" v-if="item.moreList2.length" @on-click="handleMore">
                      <span class="hover light-c">{{$t('common.more1')}}</span>
                      <DropdownMenu slot="list">
                        <DropdownItem v-for="(it, ind) in item.moreList2" :key="ind"
                          :name="it.mergeType === 'MERGE' ? `merge-${item.coinType}-${it.coinType}` : 'candy'">
                          <span v-if="it.mergeType === 'MERGE'">
                            {{$t('setting.mergeWallet')}} ({{it.coinType === 'DOC' ? 'DOGE' : it.coinType}})
                          </span>
                          <a v-else :href="`${redirectUrl}user/settings.htm?m=candyWallet&userId=${userIdURI}&coinType=${setCoinTypeName(item.coinType)}&lang=${lan}`" target="_blank">
                            {{$t('subNav.wltSet')}}
                          </a>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <span style="opacity: 0;" class="hover light-c right-line" v-else>{{$t('common.more1')}}</span>
                  </div>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <Modal v-model="modalSwitchCoin" :mask-closable="false" footer-hide class="ant-modal mini">
      <div class="content-box" style="text-align: center; margin-top: 30px;">
        <h3 class="h2">{{$t('setting.sureSwitch')}} <span class="hover" :style="`color: ${switchCoinItem.coinType === 'BTC' ? '#f5904c' : '#63a92a'};`">{{switchCoinItem.coinType}}</span> ？</h3>
      </div>
      <div class="btns-box">
        <Button type="default" class="btn-com liner" @click="handleSwitchCoin" :loading="switchCoinLoading">{{$t('common.confirm')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleShowSwitch(false)">{{$t('common.cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalLockWalletComfrin" :mask-closable="false" footer-hide class="ant-modal mini">
      <div class="content-box" style="text-align: center; margin-top: 30px;">
        <h3>{{$t('setting.contactService01')}}</h3>
        <h3>{{$t('setting.contactService02')}}</h3>
      </div>
      <div class="btns-box">
        <Button type="primary" class="btn-com liner" @click="handlShowLockComfrin(false)">{{$t('setting.thinking')}}</Button>
        <Button type="primary" class="btn-com w" @click="handleLockWallet" :loading="lockWalletLoading">{{$t('setting.lock')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalLockWallet" :mask-closable="false" footer-hide class="ant-modal mini">
      <div class="content-box" style="text-align: center; margin-top: 30px;">
        <h3 v-if="lockType === 'unlock'">{{$t('setting.sureEmail')}}</h3>
        <h3 v-else-if="lockType === 'lock'">{{$t('setting.contactOnline')}}</h3>
      </div>
      <div class="btns-box">
        <Button type="primary" class="btn-com w" @click="handleShowLock(false)">{{$t('setting.close')}}</Button>
      </div>
    </Modal>

    <Modal v-model="modalQr" :mask-closable="false" class="ant-modal obs mini footer-tip">
      <h3 class="h1">{{$t('setting.observe')}}</h3>
      <div class="content-box">
        <div class="modal-item">
          <span class="modal-label">{{$t('setting.sub')}}</span>
          <span class="modal-value">{{userIdConf}}</span>
        </div>
        <div class="modal-item">
          <span class="modal-label">{{$t('setting.coin')}}</span>
          <span class="modal-value">{{dataQr.coinType}}</span>
        </div>
        <div class="modal-item">
          <span class="modal-label">{{$t('setting.createTime')}}</span>
          <span class="modal-value">{{$U.fDate(dataQr.createTime)}}</span>
        </div>
        <div class="modal-item">
          <span class="modal-label">{{$t('setting.observeLink')}}</span>
          <span class="modal-value">{{`${obHost}${dataQr.accessKey}&coinType=${dataQr.coinType}`}}</span>
        </div>
        <div class="qr-box">
          <canvas id="qr" style="margin-left: -10px;" /><div>{{$t('setting.scanLink')}}</div>
        </div>
        <div class="qr-box btns-box btns-left">
          <Button type="primary" class="btn-com w" @click="handleQrDel" :loading="qrDalLoading">{{$t('setting.stopShare')}}</Button>
          <Button type="primary" style="margin: 0;" class="btn-com liner" @click="handleCopyObUrl">{{$t('setting.copyLink')}}</Button>
        </div>
        <Spin fix size="large" v-show="qrLoading" />
      </div>
      <div slot="footer">
        <div class="tip-text">{{$t('setting.tips')}}</div>
        <p class="tip-text-item"><span class="tip-text-num">1、</span> {{$t('setting.copyErr')}}</p>
        <p class="tip-text-item"><span class="tip-text-num">2、</span> {{$t('setting.createLink')}}</p>
      </div>
    </Modal>

    <Modal v-model="modalMerge" :mask-closable="false" class="ant-modal merge mini footer-tip">
      <h3 class="h1">{{mergeCoin || '--'}} {{$t('setting.mergeMine')}} <span style="color: #616161;">{{changeCoinType || '--'}}({{mergeData.userId || '--'}})</span></h3>
      <div class="content-box">
        <p class="h3">{{changeCoinType || '--'}} {{$t('setting.oldWallet')}}: <span style="color: #9f9f9f;">{{mergeData.wallet || '--'}}</span> 
          <span v-if="mergeData.wallet" v-clipboard:copy="mergeData.wallet" v-clipboard:success="onCopy">
            <Icon type="md-copy" />
          </span>
        </p>
        <Input size="large" v-model="mergeWallet" :placeholder="`${changeCoinType} ${$t('setting.newWallet')}`" style="margin-top: 20px;"  />
      </div>
      <div class="btns-box">
        <Button type="primary" class="btn-com liner" @click="handleSaveMerge(false)" :loading="mergeLoading">{{$t('common.save')}}</Button>
        <Button type="primary" class="btn-com w" @click="modalMerge = false" :loading="mergeLoading">{{$t('common.cancel')}}</Button>
      </div>
      <div slot="footer">
        <div class="tip-text">{{$t('setting.tips')}}</div>
        <p class="tip-text-item"><span class="tip-text-num">1、</span> {{mergeCoinTip}}</p>
        <p class="tip-text-item"><span class="tip-text-num">2、</span> {{$t('setting.tips02')}}</p>
        <p class="tip-text-item"><span class="tip-text-num">3、</span> {{$t('setting.tips03')}}</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import QRious from 'qrious';
import { mapGetters } from 'vuex';
export default {
  name: 'configuration',
  data () {
    return {
      modalSwitchCoin: false, switchCoinItem: {}, switchCoinLoading: false,
      modalLockWallet: false, lockType: '',
      modalQr: false, qrLoading: false, dataQr: {},
      settingLoading: false, qrDalLoading: false,
      modalLockWalletComfrin: false, lockComfrinItem: null, lockWalletLoading: false,
      modalMerge: false, mergeLoading: false, mergeData: {}, mergeCoin: '', mergeWallet: '',
      userIdConf: '', editingIndex: '', coins: [], coinsLoading: '',
      query: { miniPayment: '', payMethod: '', wallet: '', paymentId: ''},
      obHost: 'https://www.XXX.com/observer.htm?accessKey='
    }
  },
  watch: {
    userId(userId) {
      this.$router.push({path: '/setting/configuration', query: { userIdConf: userId }});
      this.fetchCoins(() => this.userIdConf = userId);
    }
  },
  computed: {
    ...mapGetters(['siteUrl', 'lan', 'redirectUrl', 'userId']),
    userIdURI() {
      if (this.userIdConf) return encodeURI(this.userIdConf).replace(/\+/g, '%2B');
      return '';
    },
    mergeCoinTip() {
      if (this.mergeData.mergeCoin) return this.$t(`setting.tips01${this.mergeData.mergeCoin}`);
      return '';
    },
    changeCoinType() {
      if (this.mergeData.mergeCoin === 'DOC') return 'DOGE';
      return this.mergeData.mergeCoin;
    }
  },
  mounted() {
    this.userIdConf = this.$route.query.userIdConf || '';
    this.fetchCoins();
  },
  methods: {
    handleBack() { this.$router.push({name: 'setting'}) },
    async fetchCoins(cb) {
      var cloneCoins = this.coins;
      this.coins = [];
      try {
        const userIdConf = this.$route.query.userIdConf;
        this.coinsLoading = true;
        const data = await this.$store.dispatch('setAccountSettingQuery', {userId: userIdConf});
        this.coins = Object.freeze(data.items);
        if (cb) cb();
        this.coinsLoading = false;
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        this.$router.push({path: '/setting/configuration', query: { userIdConf: this.userIdConf }});
        this.coins = cloneCoins;
        console.error(e);
        this.coinsLoading = false;
      }
    },
    handleShowSwitch(bool, coin) {
      this.modalSwitchCoin = bool;
      if (coin) this.switchCoinItem = coin;
    },
    async handleSwitchCoin() {
      const {id, coinType} = this.switchCoinItem;
      try {
        this.switchCoinLoading = true;
        await this.$store.dispatch('setAccountSwitch', {id, coinType, userId: this.userIdConf});
        this.switchCoinLoading = this.modalSwitchCoin = false;
        this.fetchCoins();
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
        this.switchCoinLoading = this.modalSwitchCoin = false;
      }
    },
    handlShowLockComfrin(bool, item) {
      this.lockComfrinItem = item || null;
      this.modalLockWalletComfrin = bool;
    },
    async handleShowLock(bool, type) {
      this.modalLockWallet = bool;
      this.lockType = type || '';
    },
    async handleLockWallet() {
      const item = this.lockComfrinItem;
      this.lockWalletLoading = true;
      try {
        await this.$store.dispatch('setAccountWalletLock', {
          id: item.id, coinType: item.coinType, userId: this.userIdConf
        });
        this.modalLockWalletComfrin = this.lockWalletLoading = false;
        this.handleShowLock(true, 'unlock');
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
        this.lockWalletLoading = false;
      }
    },
    handleEdit(index) {
      const {miniPayment, payMethod, wallet, paymentId} = this.coins[index];
      this.editingIndex = index;
      this.query = { miniPayment, payMethod, wallet };
      if (paymentId) this.query.paymentId = paymentId;
    },
    async handleUpdate(index) {
      if (index === '') return this.editingIndex = '';
      const {id, coinType, miniPaymentSystem} = this.coins[index];
      const { miniPayment, payMethod, wallet, paymentId} = this.query;
      if (!this.$U.mapNumber(miniPayment)) return this.$Message.warning(this.$t('warn.inpNum'));
      if (miniPayment-0 < miniPaymentSystem-0) return this.$Message.warning(this.$t('warn.onLessMinPay'));
      if (wallet === '') return this.$Message.warning(this.$t('warn.inpWallet'));
      try {
        let data = {id, coinType, wallet, miniPayment, payMethod, userId: this.userIdConf};
        if (paymentId) data.paymentId = paymentId;
        this.settingLoading = true;
        await this.$store.dispatch('setAccountSettingUpdate', data);
        if (this.coins[index].wallet !== wallet) this.$Message.warning(this.$t('setting.sureEmail'));
        this.settingLoading = false;
        this.editingIndex = '';
        this.fetchCoins();
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
        this.settingLoading = false;
        this.editingIndex = '';
      }
    },
    async handleShowQr(index) {
      const {coinType} = this.coins[index];
      try {
        this.dataQr = {};
        const data = await this.$store.dispatch('setAccountObserverQuery', {coinType, userId: this.userIdConf});
        this.modalQr = true;
        this.qrLoading = true;
        this.dataQr = data;
        this.dataQr.coinType = coinType;
        new QRious({
          size: 160,
          element: document.getElementById('qr'),
          value: `${this.obHost}${data.accessKey}&coinType=${coinType}`
        });
        this.qrLoading = false;
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
        this.qrLoading = false;
      }
    },
    async handleQrDel() {
      const {coinType, id} = this.dataQr;
      try {
        this.qrDalLoading = true;
        await this.$store.dispatch('setAccountObserverDelete', {coinType, id, userId: this.userIdConf});
        this.modalQr = this.qrDalLoading =false;
      } catch(e) {
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
        this.modalQr = this.qrDalLoading = false;
      }
    },
    handleCopyObUrl: function () {
      this.$copyText(`${this.obHost}${this.dataQr.accessKey}&coinType=${this.dataQr.coinType}`).then(
        e => { this.$Message.success(this.$t('success.copy')) },
        e => { console.error(e) })
    },
    async handleMore(name) {
      this.mergeData = {};
      if (name.indexOf('merge') !== -1) {
        this.modalMerge = true;
        const coinType = name.split('-')[1], mergeCoin = name.split('-')[2];
        this.mergeCoin = {};
        try {
          const data = await this.$store.dispatch('setAccountWalletMergeQuery', {coinType, mergeCoin, userId: this.userIdConf});
          this.mergeData = data;
          this.mergeCoin = coinType;
        } catch(e) {
          if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
          console.error(e);
        }
      } else if (name === 'candy') {
      }
    },
    onCopy() { this.$Message.success(this.$t('success.copy')) },
    async handleSaveMerge() {
      try {
        if (this.mergeWallet === '') return this.$Message.warning(this.$t('warn.plInp'));
        this.mergeLoading = true;
        await this.$store.dispatch('setAccountWalletMergeUpdate', {
          coinType: this.mergeCoin, wallet: this.mergeWallet, userId: this.userIdConf,
          mergeCoin: this.mergeData.mergeCoin
        });
        this.mergeWallet = '';
        this.mergeLoading = this.modalMerge = false;
        this.$Message.warning(this.$t('setting.sureEmail'));
      } catch(e) {
        this.mergeLoading = this.modalMerge = false;
        if (e.isCodeError !== true) this.$Message.error(this.$t('error.fetchErr'));
        console.error(e);
      }
    },
    setCoinTypeName(coin) {
      if (coin === "BCH") return "BCC";
      else if (coin === "SCC") return "SC";
      else if (coin === "DASH") return "DAS";
      else if (coin === "XMC") return "XMR";
      return coin;
    }
  }
}
</script>
<style lang="less">
@import '../index';
@import './index';
@import '../index-m';
@import './index-m';
</style>