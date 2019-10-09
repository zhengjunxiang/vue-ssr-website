<template>
  <div class="search-box">
  	<p class="search-box-tip">{{$t('home.addrSearchTip')}}</p>
    <Input 
      v-model="search" 
      size="large" 
      :placeholder="$t('home.walletAddr')" 
      autocomplete="on" 
      ref="inp"
      @on-enter="handleSearch" 
      @on-focus="handleFocus" 
      @on-blur="handleBlur" 
      @on-change="handleChange" 
      :class="{'isFocus':isFocus == true}">
      <Dropdown 
        slot="prepend" 
        trigger="custom" 
        @on-click="handleSelectCoin"
        :visible="searchVisible" 
        @on-clickoutside="handleSelectCoinOutClick">
        <Button type="primary" class="search-coins-slt-btn" @click="showSearchCoins">{{selectedCoin ? selectedCoin : $t('home.table.th1')}}
          <Icon type="ios-arrow-down" />
        </Button>
        <DropdownMenu slot="list" class="search-coinsMenu">
          <DropdownItem v-for="(coin, index) in coins" :name="coin.coinType" :key="index" @on-click="e=>{closeSearchCoins(e)}">
            <img :src="coin ? $U.requireCoinsIcon(`${coin.coinType}.png`) : ''" :alt="coin.coinType" class="search-coinsImg"> 
            <span class="coin-text">{{coin.coinType}}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div slot="append">
        <Icon v-show="selectedCoin || search" type="ios-close-circle" @click="handleDelCoin" class="icon-close"/>
        <Button @click="handleSearch" class="search-box-searchBtn">{{$t('home.check')}}</Button>
      </div>
    </Input>
    <div class="his-wall-addr" v-show="walletAddr.length">
      <div class="addr-item" v-for="(item, index) in walletAddr" :key="index">
        <div @click="handleAddrClick(item)">
          <img v-if="onGetCoin(item)" :src="$U.requireCoinsIcon(`${onGetCoin(item)}.png`)" alt=""> {{item}}
        </div>
        <Icon class="icon-close" @click="handleDelAddrItem(item)"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'searchbox',
  data () {
    return {
      search: '', selectedCoin: '', walletAddr: [], originWalletAddr: [], isloading: false, antPlData: [], labData: [],
      isFocus: false, searchVisible: false
    }
  },
  computed: {
    ...mapGetters(['siteUrl', 'isShowCoinSearch']),
    coins(){
      return this.antPlData.concat(this.labData)
    }
  },
  watch: {
    isShowCoinSearch(vNew,vOld){
      if(vNew === true){
        this.initData();
      }
    }
  },
  methods: {
    initLabData(data){
      this.labData = Object.freeze(data);
    },
  	initAntData(data) {
      let antPlData = [];
  		if(data){
        if (data && data.length > 0) {
          antPlData = data.filter(item => item.supportAnonymous && item.supportAnonymous == true)
        }
        this.antPlData = Object.freeze(data);
      }
  	},
    async initData(){
      await this.fetchaAntPlData();
      await this.fetchLabData();
    },
    async fetchaAntPlData() {
      let antPlData = [];
      try {
        const data = await this.$store.dispatch('coinListQuery');
        if (data.items && data.items.length > 0) {
          antPlData = data.items.filter(item => item.supportAnonymous && item.supportAnonymous == true)
        }
        this.antPlData = antPlData;
      } catch (e) { console.log('e', e) }
    },
    async fetchLabData(){
      try {
        const data = await this.$store.dispatch('labCoinListQuery');
        this.labData = data.items;
      } catch (e) {  }
    },
    onGetCoin(addr) {
      if( this.$U.regWalletAddress(addr) ){
        return this.$U.regWalletAddress(addr).toUpperCase();
      }
    },
    handleFocus() {
      if (this.search) return this.handleChange()
      const walletAddr = this.$U.store.get('walletAddr');
      this.originWalletAddr = this.$U.store.get('walletAddr');
      if (walletAddr && walletAddr.length) this.walletAddr = walletAddr;
      this.isFocus = true;
    },
    handleBlur() {
      setTimeout(() => { this.walletAddr = [] }, 160);
      this.isFocus = false;
    },
    handleChange() {
      const search = this.search;
      if (search === '') return this.walletAddr = this.$U.deepCopy(this.originWalletAddr);
      const coin = this.$U.regWalletAddress(search);
      if (coin) {
        this.selectedCoin = coin.toUpperCase();
        this.searchVisible = false;//地址不匹配币种时关闭币种选择列表
      }else{ 
        this.selectedCoin = '';
        this.searchVisible = true;//地址不匹配币种时默认展开币种选择列表
        this.walletAddr = this.originWalletAddr.filter(item => item.indexOf(search) !== -1);
      }
    },
    async handleSearch() {
      if (this.search) {
        let coin = this.selectedCoin ? this.selectedCoin : this.$U.regWalletAddress(this.search);
        if(coin == 'ZEC' || coin == 'ETH' || coin == 'ETC'){
          this.$U.store.add('walletAddr', this.search);
          this.$emit('cd', false);
          window.open(`${this.siteUrl}/${coin.toLowerCase()}.htm?wallet=${this.search}`);
          //清空选中数据
          this.search = '';
          this.selectedCoin = '';
          document.querySelector('body').removeAttribute("style");
        }else{
          if (!coin) return this.$Message.warning(this.$t('warn.noCoinAddress'));
          coin = coin.toUpperCase();
          this.$U.store.add('walletAddr', this.search);
          this.$emit('cd', false);
          window.open(`https://lab.XXX.com/hashrate/${this.search}?coin=${coin}`);
          //清空选中数据
          this.search = '';
          this.selectedCoin = '';
          document.querySelector('body').removeAttribute("style");
        }
      } else this.$Message.warning(this.$t('warn.pleaseEnter'));
    },
    handleAddrClick(addr) {
      this.search = addr;
      setTimeout(() => {
      	this.$refs.inp.$el.children[2].focus();
      	this.isFocus = true; 
      }, 60);
      this.$nextTick(() => { this.handleChange() })
    },
    handleDelAddrItem(addr) {
      this.$U.store.remove('walletAddr', addr);
      const walletAddr = this.$U.store.get('walletAddr');
      this.originWalletAddr = this.$U.store.get('walletAddr');
      if (walletAddr && walletAddr.length) this.walletAddr = walletAddr;
    },
    handleSelectCoin(name) {
      this.selectedCoin = name;
      this.searchVisible = false;
    },
    handleDelCoin() {
      this.selectedCoin = '';
      this.search = '';
    },
    showSearchCoins(){
      this.searchVisible = !this.searchVisible;
    },
    handleSelectCoinOutClick(){
      this.searchVisible = false;
    }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
@import './searchbox';
</style>