<template>
<div id="header" class="hearder-adaption isFixed" :class="{' animate':isFixed == true, 'hearder-home': routeName == 'home'}">
  <div class="container-inner">
    <div class="logo-box">
      <router-link to="/home">
        <img :src="$U.requireImg('logo.png')" alt="logo" class="logo">
      </router-link>
    </div>
    <client-only>
      <!--navbar start-->
      <!--登录前 nav-->
      <div class="navbar-old3 navbar showNav" v-if="loginStatus === 'noLogin'">
        <span class="nav-item">
          <router-link to="/home" active-class="active" class="nav-item-a">{{$t('header.apHome')}}</router-link>
        </span>
        <span class="nav-item" id="apAnnoucement">
          <a :href="`${redirectUrl}announcementList.htm?userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_blank">{{$t('header.apAnnoucement')}}</a>
        </span>
        <span class="nav-item" id="apTools">
          <a :href="`${redirectUrl}download.htm?m=tools&userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_blank">{{$t('header.apTools')}}</a>
        </span>
        <span class="nav-item" id="apHelp">
          <a :href="`${redirectUrl}support.htm?userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_blank">{{$t('header.apHelp')}}</a>
        </span>
      </div>
    </client-only>
    <client-only>
      <!--登录后 nav-->
      <div class="navbar-old3 navbar showNav" v-if="loginStatus === 'login'">
        <span class="nav-item">
          <router-link to="/home" active-class="active" class="nav-item-a">{{$t('header.apHome')}}</router-link>
        </span>
        <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('dashboard') !== -1)">
          <router-link to="/dashboard" active-class="active" class="nav-item-a">{{$t('subNav.dashbord')}}</router-link>
        </span>
        <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('worker') !== -1)">
          <router-link to="/worker" active-class="active" class="nav-item-a">{{$t('subNav.worker')}}</router-link>
        </span>
        <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('paymenthistory') !== -1)">
          <router-link to="/recvAndPay" active-class="active" class="nav-item-a">{{$t('subNav.recvAndPay')}}</router-link>
        </span>
        <span class="nav-item">
          <router-link to="/setting" active-class="active" class="nav-item-a">{{$t('subNav.setting')}}</router-link>
        </span>
      </div>
    </client-only>
    
    <!--navbar end-->
    <!--mini navbar start-->
    <client-only>
      <div v-if="isPc === false">
        <Dropdown trigger="custom" :visible="visible" class="mini-navbar-box" placement="bottom-end" @on-clickoutside="handleMiniBarOutClick">
          <Button type="primary" :class="visible == true ? 'close mini-navbar' : 'mini-navbar'" @click="handleOpen"></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Dropdown trigger="click" @on-click="handleChangeLangage" class="change-lan-box">
                <Button type="primary" v-if="lan=='zh'" class="lan-zh">
                  <span class="text"><i class="lan-zh-icon"></i>CN</span>
                </Button>
                <Button type="primary" class="lan-en" v-else>
                  <span class="text"><i class="lan-en-icon"></i>{{lan && lan.toUpperCase()}}</span>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem  v-for="(item, ind) in lans" :name="item.value" :key="ind" :class="{'active':lan==item.value}">
                    <i class="lan-icon" :class="`lan-${item.value}-icon`"></i>{{item.label}}<i class="lan-check"></i>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div class="navbar" v-if="isGotToken==true">
                <span class="nav-item">
                  <router-link to="/home" active-class="active" class="nav-item-a">{{$t('header.apHome')}}</router-link>
                </span>
                <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('dashboard') !== -1)">
                  <router-link to="/dashboard" active-class="active" class="nav-item-a">{{$t('subNav.dashbord')}}</router-link>
                </span>
                <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('worker') !== -1)">
                  <router-link to="/worker" active-class="active" class="nav-item-a">{{$t('subNav.worker')}}</router-link>
                </span>
                <span class="nav-item" v-show="!isWatchMode || (permission.indexOf('paymenthistory') !== -1)">
                    <router-link to="/recvAndPay" active-class="active" class="nav-item-a">{{$t('subNav.recvAndPay')}}</router-link>
                </span>
                <span class="nav-item">
                  <router-link to="/setting" active-class="active" class="nav-item-a">{{$t('subNav.setting')}}</router-link>
                </span>
              </div>
              <div class="navbar-old3 navbar" v-else>
                <span class="nav-item" id="apAnnoucement">
                  <a :href="`${redirectUrl}announcementList.htm?userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_block">{{$t('header.apAnnoucement')}}</a>
                </span>
                <span class="nav-item" id="apTools">
                  <a :href="`${redirectUrl}download.htm?m=tools&userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_block">{{$t('header.apTools')}}</a>
                </span>
                <span class="nav-item" id="apHelp">
                  <a :href="`${redirectUrl}support.htm?userId=${userIdURI}&coinType=${coinUrlName}&lang=${lan}`" class="nav-item-a" target="_block">{{$t('header.apHelp')}}</a>
                </span>
                <div class="user-login-info clearfix">
                  <div class="user-login-btns">
                    <a class="login-btn" @click="handleLoginBtn">{{$t('header.user.login')}}</a>
                    <a class="register-btn" @click="handleRegisterBtn">{{$t('header.user.register')}}</a>
                  </div>
                </div>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </client-only>
    
    <!--mini navbar end-->
    <!--navbar end-->
    <div class="fr fr-adaption">
      <!--语言切换 开始-->
      <Dropdown trigger="click" @on-click="handleChangeLangage" class="change-lan-box0 change-lan-box">
        <Button type="primary" v-if="lan=='zh'" class="lan-zh">
          <span class="text"><i class="lan-zh-icon"></i>CN</span>
        </Button>
        <Button type="primary" class="lan-en" v-else>
          <span class="text"><i class="lan-en-icon"></i>{{lan && lan.toUpperCase()}}</span>
        </Button>

        <DropdownMenu slot="list">
          <DropdownItem  v-for="(item, ind) in lans" :name="item.value" :key="ind" :class="{'active':lan==item.value}">
            <i class="lan-icon" :class="`lan-${item.value}-icon`"></i>{{item.label}}<i class="lan-check"></i>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!--语言切换 结束-->
      <!--用户信息 开始-->
      <!--子帐户信息 开始-->
      <span v-show="isGotToken === true">
        <Dropdown 
          trigger="custom" :visible="accountDropVisible" 
          class="change-account-box change-lan-box" 
          placement="bottom-end" @on-clickoutside="closeAccountDrop">
          <span class="account-box" @click="openAccountDrop">
            <!-- <i class="account-box-label">{{$t('header.account')}}</i> -->
            <i class="account-name">{{currentUserId}}</i>
            <i class="d-d-icon"></i>
          </span>
          <DropdownMenu slot="list">
            <ul>
              <li 
                class="userList-dropdownItem" 
                :class="{'current':userId == 'item.userId'}" 
                v-for="(item, index) in userIdList" 
                :key="index + item.userId" 
                :name="item.userId" 
                @click="handleChangeSubAccount(item.userId)">
                <div class="item-inline clearfix">
                  <span class="item-inline-uName">{{item.userId}}</span>
                  <span class="user-hash-unit">{{item.hashRate}}<i class="hash-unit">{{item.hashRateUnit}}</i></span>
                </div>
              </li>
              <div v-show="showOtherUserListBtn == true" @click="showUserIdList('u')" class="userList-dropdownItem ivu-dropdown-item">
                <div class="item-inline-more item-inline clearfix">...</div>
              </div>
              <li 
                class="userList-dropdownItem" 
                :class="{'current':userId == 'item.userId', 'showOtherUserList':showOtherUserList}" 
                v-for="(item, index) in userIdList0" 
                :key="index + item.userId" 
                :name="item.userId" 
                v-show="showOtherUserList == true"  
                @click="handleChangeSubAccount(item.userId)">
                <div class="item-inline clearfix">
                  <span class="item-inline-uName">{{item.userId}}</span>
                  <span class="user-hash-unit">{{item.hashRate}}<i class="hash-unit">{{item.hashRateUnit}}</i></span>
                </div>
              </li>
              <div class="divider" v-if="permissionList.length"></div>
              <li 
                class="userList-dropdownItem" 
                :class="{'current':userId == 'item.userId'}"
                v-for="(item, index) in permissionList" 
                :key="index+item.userId" 
                :name="item.userId"  
                @click="handleChangeSubAccount(item.userId)">
                <div class="item-inline clearfix" :class="{'item-inline-divider': index == 0}">
                  <span class="item-inline-uName">{{item.userId}}</span>
                  <span class="user-hash-unit">{{item.hashRate}}<i class="hash-unit">{{item.hashRateUnit}}</i></span>
                </div>
              </li>
              <div v-show="showOtherPermissionListBtn == true" @click="showUserIdList('p')" class="userList-dropdownItem ivu-dropdown-item">
                <div class="item-inline-more item-inline clearfix">...</div>
              </div>
              <li 
                class="userList-dropdownItem" 
                :class="{'current':userId == 'item.userId'}"
                v-for="(item, index) in permissionList0" 
                :key="index+item.userId" 
                :name="item.userId" 
                v-show="showOtherPermissionList == true"  
                @click="handleChangeSubAccount(item.userId)">
                <div class="item-inline clearfix">
                  <span class="item-inline-uName">{{item.userId}}</span>
                  <span class="user-hash-unit">{{item.hashRate}}<i class="hash-unit">{{item.hashRateUnit}}</i></span>
                </div>
              </li>
            </ul>
            <div class="userName-dropdownItem">
              <div>{{$t('header.user.currentUserName')}}{{userName}}</div>
              <div>
                <a @click.stop="handleUserInfoClick('userCenter')">{{$t('header.user.userCenter')}}</a>
                <a @click.stop="handleUserInfoClick('logout')">{{$t('header.user.logout')}}</a>
              </div>
            </div>
          </DropdownMenu>
        </Dropdown>
      </span>
      <!--子帐户信息 结束-->
      <span class="log-rgs-box" v-show="loginStatus === 'noLogin'">
        <button class="login-btn" @click="handleLoginBtn">{{$t('header.user.login')}}</button>
        <button class="register-btn" @click="handleRegisterBtn">{{$t('header.user.register')}}</button>
      </span>
      <!--用户信息 结束-->
      <!--币种下拉 开始-->
      <div class="change-coins-box" v-show="isGotToken === true">
        <Dropdown trigger="click" placement="bottom-end" @on-click="handleChangeCoin" v-show="coinList.length > 0">
          <div class="currency-chose">
            <span class="c-img" :class="currentCoin"></span>
            <span class="c-coin-box">{{currentCoin}}</span>
            <i class="d-d-icon"></i>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(coin, index) in coinList" :key="index" :name="coin.coinType" :class="{'active': currentCoin == coin.coinType}">
              <img :src="$U.requireCurrencyImg(`${coin.coinType}.png`)" :alt="coin.coinType">
              <span>{{coin.coinName}}</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <!--币种下拉 结束-->
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import merge from 'webpack-merge'
import { lans, testLoginUrl } from 'src/libs/config'
import ClientOnly from 'vue-client-only'
export default {
  name: "Ant-Header",
  components: { ClientOnly },
  computed: {
    ...mapGetters(['lan', 'userName', 'currentCoin', 'reFetchApi', 'reFetchUserList', 'loginStatus', 'isPc', 'userIdListData',
      'isGotToken', 'userId', 'siteUrl', 'redirectUrl', 'coinUrlName', 'isWatchMode', 'permission', 'userWebType']),
    userIdURI() {
      if (this.userId) return encodeURI(this.userId).replace(/\+/g, '%2B');
      return '';
    },
    currentUserId(){
      if(this.userId.substr(0, 1) == "*") return '***';
      else return this.userId;
    },
    showUserWebType(){
      if(this.userWebType && this.userWebType.indexOf(-10) === 0) return true;
      else return false;
    }
  },
  watch: {
    isGotToken(value) {
      if (!value) return;
      this.fetchStatsCurrent();
      this.fetchCoinTypeList();
    },
    reFetchUserList() {
      this.fetchStatsCurrent();
      this.fetchStatsUserList();
    },
    userIdListData(data) { this.setUsetList(data) },
    $route(route) {
      this.routeName = route.name == 'home' ? 'home' : '';
      this.handleMiniBarOutClick()
    }
  },
  data(){
    return {
      lans, visible: false, coinList: [], userIdList:[], userIdList0:[], allUserIdList: [], permissionList: [], permissionList0:[], allPermissionList: [],
      showOtherUserList: false, showOtherUserListBtn: false, showOtherPermissionListBtn: false, showOtherPermissionList:false, isFixed:false, routeName:'', accountDropVisible: false
    }
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var offsetTop = document.querySelector('#header').offsetTop
      if (scrollTop > offsetTop) this.isFixed = true;
      else this.isFixed = false;
    },
    async fetchStatsUserList() {
      const data = await this.$store.dispatch('statsUserList', {coinType: this.currentCoin});
      if (data) this.setUsetList(data);
    },
    setUsetList(data) {
      if (data.userIdList) {
        this.doUserLists(data.userIdList, 'u');
        //根据当前userId设置显示与隐藏蚂蚁路由器链接
        data.userIdList.some(item => {
          if (item.userId === this.userId) {
            if (item.userWebType) this.$store.commit('setUserWebType', item.userWebType);
          }
        });
        this.allUserIdList = Object.freeze(data.userIdList);
      }
      if (data.permissionUserModelList) {
        this.doUserLists(data.permissionUserModelList, 'p');
        const isPermission = data.permissionUserModelList.some(item => {
          if (item.userId === this.userId) {
            this.$store.commit('setPermission', item.permission);
            return item;
          }
        });
        if (isPermission) this.$store.commit('setWatchMode', true);
        else this.$store.commit('setWatchMode', false);
        this.allPermissionList = Object.freeze(data.permissionUserModelList);
      }
    },
    /*
    **处理子账户列表
    **params:data, type:u(userList),p(permissionList)
    */
    doUserLists(data, type) {
      //初始化
      this.showOtherUserList = false;
      this.showOtherPermissionListBtn = false
      this.showOtherPermissionList = false
      //取出前三位默认显示
      let listArr = [], listArr0 = [], listArrOrg = [], listArr0Org = [];
      let orderedDataList = data;
      if (orderedDataList.length > 3) {
        orderedDataList.map((item, index)=> {
          if(item.hashRate > 0) listArrOrg.push(item); //算力大于0
          else listArr0Org.push(item);
        });
        if (listArrOrg.length >= 3) {
          listArr = listArrOrg;
          listArr0 = listArr0Org;
        } else { //算力大于0的数据个数小于3个时用0的补齐3个
          let len = 3 - listArrOrg.length;
          let newListArr = listArr0Org.slice(0,len);
          listArr = listArrOrg.concat(newListArr);
          listArr0 = listArr0Org.slice(len);
        }
      } else listArr = orderedDataList;
      //根据类型赋值
      if (type == 'u') {
        this.$set(this,'userIdList', listArr)
        this.$set(this,'userIdList0', listArr0)
        this.showOtherUserListBtn = listArr0.length > 0 ? true : false;
      } else {
        this.$set(this,'permissionList', listArr)
        this.$set(this,'permissionList0', listArr0)
        this.showOtherPermissionListBtn = listArr0.length > 0 ? true : false;
      }
    },
    async fetchStatsCurrent(cd) {
      const data = await this.$store.dispatch('statsCurrent');
      if (data) {
        this.$store.commit('setUserName', data.email)
        this.$store.commit('setUserId', data.userId)
        this.$store.commit('setCurrentCoin', data.coinType)
        if (cd) cd();
      }
    },
    async fetchCoinTypeList() {
      const data = await this.$store.dispatch('coinTypeList');
      if (data) this.coinList = Object.freeze(data.items);
    },
    async handleChangeCoin(coinType) {
      const query = this.$route.query;
      if (query.coinType) this.$router.push({ query: merge(query, {coinType: ''}) });
      try {
        await this.$store.dispatch('statsSetCoinType', {coinType});
        this.fetchStatsCurrent(async () => {
          await this.$store.dispatch('workerRemind');
          this.$store.commit('setReFetchApi', this.reFetchApi + 1)
          //币种切换时 根据币种更新子账户列表
          this.fetchStatsUserList()
          //更新矿工管理页面是否显示预警按钮
          await this.$store.dispatch("workerWarnIsShow");
        });
      } catch(e) { if (!e.isCodeError) this.$Message.error(this.$t('error.switchCoin')) }
    },
    openAccountDrop () { this.accountDropVisible = !this.accountDropVisible },
    closeAccountDrop() { this.accountDropVisible = false },
    async handleChangeSubAccount(userId) {
      if(userId === 'otherItem') return; 
      const query = this.$route.query;
      if (query.userId) this.$router.push({ query: merge(query, {userId: ''}) });
      try {
        await this.$store.dispatch('statsSetUser', {userId, coinType: this.currentCoin})
        this.fetchStatsCurrent(async () => {
          await this.$store.dispatch('workerRemind');
          this.$store.commit('setReFetchApi', this.reFetchApi + 1)
          this.allUserIdList.some(item => {
            if (item.userId === this.userId) this.$store.commit('setUserWebType', item.userWebType);
          })
          const isPermission = this.allPermissionList.some(item => {
          if (item.userId === this.userId) {
              this.$store.commit('setPermission', item.permission);
              return item;
            }
          });
          if (isPermission) this.$store.commit('setWatchMode', true);
          else this.$store.commit('setWatchMode', false);
        });
        //更新矿工管理页面是否显示预警按钮
        await this.$store.dispatch("workerWarnIsShow");
      } catch(e) { if (!e.isCodeError) this.$Message.error(this.$t('error.switchAccount')) }
      this.closeAccountDrop()//关闭下拉框
    },
    async handleUserInfoClick(name) {
      if (name === 'logout') {
        const url = await this.$store.dispatch('statsLogout');
        localStorage.removeItem('tokenId')
        const ssoUrl = this.$store.state.app.ssoUrl;
        if (ssoUrl) window.location.href = `${ssoUrl}/logout?returnUrl=${this.$U.getOrigin()}/home`;
        else window.location.href = `${testLoginUrl}/logout?returnUrl=${this.$U.getOrigin()}/home`;
      } else if (name === 'userCenter') {
        const centerUrl = this.$store.state.app.centerUrl;
        if (centerUrl) window.location.href = centerUrl;
      } else return;
      this.closeAccountDrop()//关闭下拉框
    },
    handleChangeLangage(name) {
      const query = this.$route.query;
      if (query.lang) this.$router.push({ query: merge(query, {lang: ''}) });
      this.$i18n.locale = name;
      this.$store.commit('setLan', name)
      this.visible = false
    },
    handleOpen() { this.visible = !this.visible },
    handleMiniBarOutClick() { this.visible = false },
    handleLoginBtn() {
      const ssoUrl = this.$store.state.app.ssoUrl;
      if (ssoUrl) location.href = `${ssoUrl}/login?service=${this.$U.getOrigin()}/dashboard`
      else location.href = `${testLoginUrl}/login?service=${this.$U.getOrigin()}/dashboard`;
    },
    handleRegisterBtn() { location.href = `https://account.bitmain.com/sign_up` },
    showUserIdList(type){
      if (type === 'u') {
        this.showOtherUserListBtn = false;
        this.showOtherUserList = true;
      } else if(type === 'p') {
        this.showOtherPermissionListBtn = false;
        this.showOtherPermissionList = true;
      }
    }
  }
}
</script>
<style lang="less">
@import '../../styles/variable.less';
@import './header.less';
@import './coins.less';
</style>
