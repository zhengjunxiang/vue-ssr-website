<template>
  <div class='watchMode watchMode-adaption'>
    <h3 class="title"><img :src="$U.requireIcon('minertishi-icon.png')" alt="Miner"> {{$t('user.methodsConf')}}</h3>
    <h4><span>1</span>{{$t('user.connectLocalNet')}}</h4>
    <p class="step">{{$t('user.connectLocalNetTxt')}}</p>
    <h4><span>2</span>{{$t('user.miningConf')}}</h4>
    <p class="step">{{$t('user.miningConfTxt1')}} <span class="clr-21ae8b">{{`${currentCoin}`}}</span> {{$t('user.miningConfTxt2')}}</p>
    <h4><span>3</span>{{$t('user.workerConf')}}</h4>
    <p class="step">{{$t('user.workerConfTxt1')}}<span class="clr-63a92a">{{userId}}</span>.001、<span class="clr-63a92a">{{userId}}</span>.002{{$t('user.workerConfTxt2')}}</p>
    <h4><span>4</span>{{$t('user.completingConf')}}</h4>
    <p class="step">{{$t('user.completingConfTxt')}}</p>

    <h3 class="title-addr">
      <img :src="$U.requireCurrencyImg(`${currentCoin}.png`)" :alt="currentCoin"> {{currentCoin}}{{$t('user.miningAddr')}}
    </h3>
    <div v-for="(item, ind) in mineAddress[currentCoin]" :key="ind" class="addr-item">
      {{$t('user.pool')}}{{ind+1}} <span class="addr-text">{{item}}</span> 
      <Button type="primary"
        v-clipboard:copy="item"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">{{$t('common.copy')}}</Button>
    </div>

    <div class="watch-addr-tip">
      <p>{{$t('user.tipTxt1')}}<a class="tipTxt3" :href="`${redirectUrl}download.htm?m=tools`" target="_blank">{{$t('user.tipTxt5')}}</a>{{$t('user.tipTxt6')}}</p>
      <!-- <p>您添加矿机后，才能开始挖矿。推荐XXX矿池，批量添加、配置、监控矿机软件“<span class="spec1">APMinerTool V1.0.8</span>”，直接点击下载软件;</p> -->
      <p>
        {{$t('user.tipTxt2')}}{{$t('user.tipTxt3')}}{{$t('user.tipTxt4')}}<a :href="`${redirectUrl}${$t('user.tipTxt2LinkUrl')}`" target="_blank">{{$t('user.tipTxt2Link')}}</a>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mineAddress } from '../../libs/config'
export default {
  name: 'watchMode',
  computed: {
    ...mapGetters(['userId', 'currentCoin', 'redirectUrl']),
  },
  data () {
    return { mineAddress }
  },
  methods: {
    onCopy() { this.$Message.success(this.$t('success.copy')) },
    onError() { this.$Message.error(this.$t('error.copy')) }
  }
}
</script>

<style lang='less'>
@import '../../styles/variable.less';
#app{
  .watchMode {
    padding: 60/@baseFontRem 112/@baseFontRem;
    background: #fff;

    h3{
      font-size:56/@baseFontRem;
      font-weight:normal;
      color:#1c1c1c;
      &.title{
        padding:52/@baseFontRem 0 100/@baseFontRem;

        img{
          display:inline-block;
          width:70/@baseFontRem;
          height:68/@baseFontRem;
          vertical-align:top;
          margin-right:10/@baseFontRem;
          margin-top:6/@baseFontRem;
        }
      }
      &.title-addr{
        padding:94/@baseFontRem 0 100/@baseFontRem;

        img{
          display:inline-block;
          width:66/@baseFontRem;
          height:66/@baseFontRem;
          vertical-align:top;
          margin:8/@baseFontRem 10/@baseFontRem 0 0;
        }
      }

    }
    .addr-item{
      font-size:32/@baseFontRem;
      color:#1c1c1c;
      padding-left:100/@baseFontRem;
      margin-bottom:40/@baseFontRem;
      .addr-text{
        display:inline-block;
        vertical-align:middle;
        padding:0 36/@baseFontRem;
        height:84/@baseFontRem;
        line-height:80/@baseFontRem;
        border:2/@baseFontRem solid #e7e7e7;
        border-radius:8/@baseFontRem;
        margin:0 30/@baseFontRem 0 60/@baseFontRem;
      }
      .ivu-btn{
        display:inline-block;
        vertical-align:middle;
        height:84/@baseFontRem;
        border:2/@baseFontRem solid #7aceb9;
        padding:0 48/@baseFontRem 2/@baseFontRem;
        &:hover{
          background:#f3faf7;
        }
        span{
          color:#21ae8b;
        }
        
      }
    }
    .watch-addr-tip{
      border:2/@baseFontRem dashed #7aceb9;
      border-radius:6/@baseFontRem;
      background:#f3faf9;
      padding:20/@baseFontRem 38/@baseFontRem;
      font-size:32/@baseFontRem;
      color:#1c1c1c;
      margin:120/@baseFontRem 100/@baseFontRem 40/@baseFontRem;
      .tipTxt3{
        color:#21ae8b;
        text-decoration:underline;
        font-weight:500;
        
        &:hover{
          text-decoration:none;
        }
      }
      p{
        padding:8/@baseFontRem 0;
      }
      .spec1{
        color:#21ae8b;
        text-decoration:underline;
      }
      a{
        color:#1c1c1c;
        text-decoration:underline;
        &:hover{
          text-decoration:none;
        }
      }
    }
  }
}
</style>