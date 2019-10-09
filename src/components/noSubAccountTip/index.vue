<template>
  <div>
    <Card class="card-common card-pad-LR40">
      <div class="no-subAccount-tip">
        <h2>{{$t('noSubAccount.title')}}</h2>
        <p>{{$t('noSubAccount.tip1')}}<span class="create-subAccount-btn" @click="handleShowAdd(true)">{{$t('noSubAccount.tip10')}}</span></p>
      </div>
    </Card>
    <Modal v-model="modalAdd" :mask-closable="false" footer-hide class="ant-modal mini">
      <AddSubAccount :modalAdd="modalAdd" @cd="handleSubmitAdd"/>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddSubAccount from '../../views/setting/addSubAccount'
export default {
  name: 'noSubAccountTip',
  data () {
    return { modalAdd: false }
  },
  computed: {
    ...mapGetters(['siteUrl']),
  },
  components: { AddSubAccount },
  methods: {
    handleShowAdd(bool) {this.modalAdd = bool},
    handleSubmitAdd(){ 
      this.modalAdd = false;
      this.$store.commit('setFetchUserList');
      this.$router.push({path: '/dashboard'});//创建成功后页面跳转到dashboard页面 
      document.body.removeAttribute('style');
    }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
.no-subAccount-tip{
  text-align:center;
  font-size:36/@baseFontRem;
  color:#1c1c1c;
  padding:196/@baseFontRem 0 270/@baseFontRem;
  h2{
    font-weight:normal;
    font-size:60/@baseFontRem;
    color:#63a92a;
    padding:40/@baseFontRem 0;
  }
  p{
    margin:56/@baseFontRem auto;
  }
  .create-subAccount-btn{
    color:#21ae8b;
    text-decoration:underline;
    cursor:pointer;
    &:hover{
      text-decoration:none;
    }
  }
}
</style>