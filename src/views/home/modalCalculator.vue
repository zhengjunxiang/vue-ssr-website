<template>
  <Modal v-model="isShow" class="modal" :title="$t('home.earningsCal')">
  	<p class="modalCalc-tip">{{$t('home.calInfo')}}<span class="clr-f95050">{{$t('home.calInfo2')}}</span>{{$t('home.calInfo3')}}</p>
  	<div class="">
  		<Form ref="formCalc" :model="formCalcModel" :rules="ruleCalc" class="formCalc" inline>
  			<FormItem prop="coins" :label="$t('home.table.th1')" class="calcCoin-form-item">
          <Select v-model="formCalcModel.coinSlt" class="coins-ivu-select" @on-change="v => handleChangeV(v,'coinSlt')">
            <Option v-for="(item, index) in allCoinList" :value="item.coinType" :key="item.coinTypeindex">
              <img :src="$U.requireCurrencyImg(`${item.coinType}.png`)" :alt="item.coinType" class="calc-coins">{{item.coinType}}</Option>
	        </Select>
        </FormItem>
        <FormItem prop="networkDiff" :label="$t('home.networkDiff')" class="networkDiff-form-item">
          <Input 
            v-model="formCalcModel.networkDiff" 
            ref="networkDiff" class="calcHash-ivu-input" 
            :placeholder="$t('home.networkDiff')" 
            :maxlength="20" 
            @on-change="calcResult">
          </Input>
        </FormItem>
        <FormItem prop="hashIpt" :label="$t('home.hashRate')" class="calcHash-form-item">
	        <Input 
            v-model="formCalcModel.hashIpt" 
            ref="hashIpt" class="calcHash-ivu-input" 
            :placeholder="$t('home.enterValidCal')" 
            :maxlength="14" 
            @on-change="calcResult">
		        <Select v-model="formCalcModel.calcUnit" slot="append" style="width: 100px" @on-change="v => handleChangeV(v,'calcUnit')">
		          <Option v-for="(value, key, index) in calcUnitArrNew" :value="key" :key="key">{{value}}</Option>
		        </Select>
		    	</Input>
        </FormItem>
        <FormItem prop="feePcnt" :label="$t('home.feePercent')" class="calcFee-form-item">
        	<Input v-model="formCalcModel.feePcnt" @on-change="calcResult">
			      <span slot="append" style="padding:0 10px">%</span>
			    </Input>
        </FormItem>
  		</Form>
  		<div class="table-calcResult" cellpadding="0" cellspacing="0">
        <div class="table-calcResult-col">
          <div class="th">{{$t('home.calcResultDay')}}</div>
          <div class="td">
            <div>
              {{this.caleResultArr.coinMountDay}}
              <span class="clr-9e9f9f">{{calcResultCoin}}</span>
            </div>
            <div>
              {{calcResultSettle}} {{this.caleResultArr.coinMountDaySettle}}
            </div>
          </div>
        </div>
        <div class="table-calcResult-col">
          <div class="th">{{$t('home.calcResultWeek')}}</div>
          <div class="td">
            <div>
              {{this.caleResultArr.coinMountWeek}}
              <span class="clr-9e9f9f">{{calcResultCoin}}</span>
            </div>
            <div>
              {{calcResultSettle}} {{this.caleResultArr.coinMountWeekSettle}}
            </div>
          </div>
        </div>
        <div class="table-calcResult-col">
          <div class="th">{{$t('home.calcResultMonth')}}</div>
          <div class="td">
            <div>
              {{this.caleResultArr.coinMountMonth}}
              <span class="clr-9e9f9f">{{calcResultCoin}}</span>
            </div>
            <div>
              {{calcResultSettle}} {{this.caleResultArr.coinMountMonthSettle}}
            </div>
          </div>
        </div>
        <div class="table-calcResult-col">
          <div class="th">{{$t('home.calcResultYear')}}</div>
          <div class="td">
            <div>
              {{this.caleResultArr.coinMountYear}}
              <span class="clr-9e9f9f">{{calcResultCoin}}</span>
            </div>
            <div>
              {{calcResultSettle}} {{this.caleResultArr.coinMountYearSettle}}
            </div>
          </div>
        </div>
  		</div>
  		<div class="pps-calcResult" v-show="calcResultCoin === 'BTC' ">
  			<h3>{{$t('home.ppsTitle')}}</h3>
  			<div class="pps-calcRslt-item-box">
  				<span class="pps-calcRslt-item">
  					<span class="f-40 clr-63a92a">{{ppsPlusavgBlockReward}} BTC</span>
  					<span>{{$t('home.ppsTtl1')}}</span>
  				</span>
  				<span class="pps-calcRslt-item">
  					<span  class="f-40 clr-f5904c">{{ppsPlusPpsPercent}}</span>
  					<span>{{$t('home.ppsTtl2')}}</span>
  				</span>
  				<span class="pps-calcRslt-item">
  					<span class="f-40 clr-21ae9c">{{ppsPlusPpsReward}} BTC</span>
  					<span>{{$t('home.ppsTtl3')}}</span>
  				</span>
  			</div>
  		</div>
  	</div>
  </Modal>
</template>

<script>
import {calcUnitArr} from '../../libs/config'
import { mapGetters } from 'vuex'
export default {
	data () {
    const validateHashIpt = (rule, value, callback) => {
      if (value === '') callback(new Error(this.$t('warn.plInp')));
      else if (this.$U.mapNumber(value) == false) callback(new Error(this.$t('warn.invalidNum')));
      else callback();
    };
    return {
      isShow: false,
      coin:'',
      //allCoinList:[],
      data:{},
      settleAccount:'RMB',
      calcUnitArr:calcUnitArr,
      formCalcModel:{
      	coinSlt:'BTC',
      	calcUnit:'K',
      	hashIpt:'',
        feePcnt:'0',
        networkDiff:'0'
      },
      feePcntVal:'',
      formCalcRules:[],
      calcResultSettle:'¥',
      calcResultCoin:'',
      caleResultArr:{
        coinMountDay:0,
        coinMountDaySettle:0,
        coinMountWeek:0,
        coinMountWeekSettle:0,
        coinMountMonth:0,
        coinMountMonthSettle:0,
        coinMountYear:0,
        coinMountYearSettle:0,
      },
      ppsPlusavgBlockReward:0,
      ppsPlusPpsPercent:'0%',
      ppsPlusPpsReward:0,
      ruleCalc:{
        hashIpt: [
          { required: true,validator: validateHashIpt,trigger: 'blur' },
        ],
        feePcnt: [
          { validator: validateHashIpt, trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['antPlCoinListArr', 'labCoinListArr']),
    allCoinList(){
      let coinSltArr = [];
      coinSltArr = this.antPlCoinListArr.concat(this.labCoinListArr);
      return coinSltArr;
    },
    calcUnitArrNew(){
      if(this.data.coinType){
        if(this.data.coinType === 'ZEC' || this.data.coinType === 'BEAM' || this.data.coinType.indexOf('GRIN') !== -1){
          return this.calcUnitArr[this.data.coinType];
        }else{
          return this.calcUnitArr['default'];
        }
      }
    }
  },
  watch: {
    async calcResultCoin(newV, oldV){
      if(newV === "BTC"){
        var data = await this.$store.dispatch('ppsplusReward',{coinType:newV});
        this.ppsPlusavgBlockReward = data.avgBlockReward;
        this.ppsPlusPpsPercent = data.ppsPercent;
        this.ppsPlusPpsReward = data.ppsReward;
      }
    }
  },
  mounted(){
    //this.initFormCalcModel()
  },
  methods: {
    onShow(dataOrg, settleAccount) {
      let data = [];
      if(dataOrg === 'default'){
        data = this.allCoinList[0]
      }else{
        data = dataOrg
      }
      let {coinPriceCny, coinPriceUsd, blockReward, networkDiff, coinType, calculateUnit, coinUnit, coinCoefficient, miningType} = data;
      this.data = data;
      this.settleAccount = settleAccount;
      this.calcResultSettle = this.settleAccount === "RMB" ? '¥' : '$';
      if(coinType.indexOf("DGB") !== -1){
        this.calcResultCoin = coinType.split("_")[0];
      }else{
        this.calcResultCoin = coinType;
      }

      this.formCalcModel['coinSlt'] = data.coinType;
      this.formCalcModel['hashIpt'] = 0.00000000;
      if(data.networkDiff){
        this.formCalcModel['networkDiff'] = parseInt(data.networkDiff);
      }
      this.getCalcUnit();//设置算力默认单位
      this.getFeePercent();//miningType 获取PPS percent

      this.hashrate = '';
      this.initCaleResult();

      this.isShow = true;
      this.coin = data.coinType;
      
      this.coinUnit = data.coinUnit;
      
      setTimeout(() => { this.$refs.hashIpt.$el.children[1].focus() }, 60);

    },
    initCaleResult(){
      this.caleResultArr.coinMountDay = 0;
      this.caleResultArr.coinMountWeek = 0;
      this.caleResultArr.coinMountMonth = 0;
      this.caleResultArr.coinMountYear = 0;
      this.caleResultArr.coinMountDaySettle = 0;
      this.caleResultArr.coinMountWeekSettle = 0;
      this.caleResultArr.coinMountMonthSettle = 0;
      this.caleResultArr.coinMountYearSettle = 0;
    },
    getFeePercent(){
      if(this.data && this.data.miningType){
        let feePercent = 0, miningType = this.data.miningType;
        if(typeof miningType === 'string'){
          if(miningType === "PPS"){
            this.formCalcModel['feePcnt'] = this.data.feePercent*100;
          }else{
            this.formCalcModel['feePcnt'] = feePercent;
          }
        }else{
          let f = miningType.filter(item => item.payMethod == "PPS");
          if(f.length > 0) feePercent = f[0]['percentStr'].split("%")[0];
          this.formCalcModel['feePcnt'] = feePercent*1;
        }
      }
    },
    getCalcUnit(){//获取calcUnit
      if(this.data && this.data.calculateUnit){
        this.formCalcModel['calcUnit'] = this.$U.selectUnit(this.data.calculateUnit) ? this.$U.selectUnit(this.data.calculateUnit) : 'K';
      }else{
        this.formCalcModel['calcUnit'] = 'K';
      }
    },
    getNetworkDiff(){
      if(this.data && this.data.networkDiff){
        this.formCalcModel['networkDiff'] = parseInt(this.data.networkDiff);
      }else{
        this.formCalcModel['networkDiff'] = 0;
      }
    },
    handleChangeV(v,type){
      if(type == "coinSlt"){
        if(this.allCoinList && this.allCoinList.length > 0){
          var selectCoinData = this.allCoinList.filter(item => {
            if(item.coinType === v){
              this.data = item;
              this.getFeePercent();
              this.getCalcUnit();
              this.getNetworkDiff();
            }
          })
        }
      }
      this.calcResult();
    },
    calcResult(){//计算结果
      this.$refs['formCalc'].validate(async valid => {
        if (valid) {
          try {
            this.funCalcRes()
          } catch (e) {
            console.log(e)
          }
        } else {
          this.initCaleResult();
        }
      })
    },
    funCalcRes(){
      const { coinSlt, calcUnit, hashIpt, feePcnt, networkDiff } = this.formCalcModel;
      const coinSltData = this.allCoinList.filter(item => item.coinType == coinSlt);
      const {coinPriceCny, coinPriceUsd, blockReward, feePercent, calculateUnit, coinCoefficient, miningType} = this.data;
      
      //计算天算力
      let calcUnitNum = this.$U.selectUnitReverse(calcUnit);
      let mount = 0;
      if(coinSlt === 'ETC' || coinSlt === 'ETH'){
        mount = (hashIpt * (calcUnitNum-0) * 86400) / networkDiff * blockReward * (1 - feePcnt/100);
      }else{
        mount = (hashIpt * (calcUnitNum-0) * 86400) / (coinCoefficient * networkDiff) * blockReward * (1 - feePcnt/100);
      }
      /*if (mount < Math.pow(10, -7)) mount = 0;*/
      //判断数值是否溢出 溢出后提示并设置mount为0 
      /*var testNum = new RegExp('^\\d+(\\.\\d+)?$');
      if (testNum.test(mount) == false) {
        mount = 0;
      }*/

      this.caleResultArr.coinMountDay = this.$U.fNum(mount, 8);
      this.caleResultArr.coinMountWeek = this.$U.fNum(mount*7, 8);
      this.caleResultArr.coinMountMonth = this.$U.fNum(mount*30, 8);
      this.caleResultArr.coinMountYear = this.$U.fNum(mount*365, 8);

      if(this.settleAccount === "RMB"){
        this.caleResultArr.coinMountDaySettle = this.$U.fNum(coinPriceCny*mount, 2);
        this.caleResultArr.coinMountWeekSettle = this.$U.fNum(coinPriceCny*mount*7, 2);
        this.caleResultArr.coinMountMonthSettle = this.$U.fNum(coinPriceCny*mount*30, 2);
        this.caleResultArr.coinMountYearSettle = this.$U.fNum(coinPriceCny*mount*365, 2);
      }else if(this.settleAccount === "USD"){
        this.caleResultArr.coinMountDaySettle = this.$U.fNum(coinPriceUsd*mount, 2);
        this.caleResultArr.coinMountWeekSettle = this.$U.fNum(coinPriceUsd*mount*7, 2);
        this.caleResultArr.coinMountMonthSettle = this.$U.fNum(coinPriceUsd*mount*30, 2);
        this.caleResultArr.coinMountYearSettle = this.$U.fNum(coinPriceUsd*mount*365, 2);
      }
      if(coinSlt.indexOf("DGB") !== -1){
        this.calcResultCoin = coinSlt.split("_")[0];
      }else{
        this.calcResultCoin = coinSlt;
      }
    }
  }
}
</script>