<template>
  <div id="app">
    <Header />
    <transition name="fade" mode="out-in"> <router-view /> </transition>
    <BackTop />
    <Footer />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Header from 'src/views/layout/header.vue'
import Footer from 'src/views/layout/footer-new.vue'
import { testLoginUrl, loginPath } from 'src/libs/config'
export default {
  name: 'App',
  components: { Header, Footer },
  computed: {
    ...mapGetters(['currentCoin', 'ssoUrl'])
  },
  async created() {
    if (process.env.VUE_ENV === 'server') return;
    const userId = this.$U.getQueryString('userId') || localStorage.getItem('userId') || '',
      coinType = this.$U.getQueryString('coinType') || localStorage.getItem('currentCoin') || '',
      tokenId = localStorage.getItem('tokenId');
    this.$store.commit('setUserId', userId);
    this.$store.commit('setCurrentCoin', coinType);
    try {
      if (tokenId) {
        if (coinType) this.$store.dispatch('statsSetCoinType', {coinType});
        if (userId) await this.$store.dispatch('statsSetUser', {userId, coinType});
        this.onLogincb(coinType);
      } else {
        const ticket = this.$U.getQueryString('ticket');
        if (ticket) {
          let data = await this.$store.dispatch('statsCheck', {ticket, coinType, userId});
          if (data) localStorage.setItem('tokenId', data);
          this.onLogincb(coinType);
        } else {
          let pthName = this.$U.getPathName();
          this.$store.commit('setLoginStatus', 'noLogin');
          if (loginPath.indexOf(pthName) !== -1) {
            if (this.ssoUrl) location.href = `${this.ssoUrl}/login?service=${this.$U.getOrigin()}/dashboard`
            else location.href = `${testLoginUrl}/login?service=${this.$U.getOrigin()}/dashboard`;
          } else this.$router.push({path: '/home'});
        }
      }
    } catch(e) {
      console.error('e', e);
      this.$store.commit('setLoginStatus', 'noLogin');
    }
    this.$Message.config({ duration: 5 });
    window.addEventListener('resize', () => { this.onSetPcVar() });
    this.onSetPcVar();
  },
  methods: {
    async onLogincb(coinType) {
      this.$store.commit('setGotToken', true);
      this.$store.commit('setLoginStatus', 'login');
      await this.$store.dispatch('workerRemind');
      await this.$store.dispatch('statsUserList', {coinType});
      this.$nextTick(() => {this.$store.commit('setInitData', true)});
    },
    onSetPcVar() {
      if (window.document.body.clientWidth > 768) this.$store.commit('setPcVar', true);
      else this.$store.commit('setPcVar', false);
    }
  }
}
</script>
<style lang="less">
@import './styles/variable.less';
@import './styles/common.less';
@import './styles/reset-ivu';
@import './styles/adaption.less';
</style>
