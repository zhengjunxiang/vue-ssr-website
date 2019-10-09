<template>
  <div class='antPlTable'>
    <client-only>
      <Table v-if="isPc === true" :columns="columns($root, isEpd)" 
        :data="dataList" :loading="isloading" ref="tableAntPl" 
        class="table-large clearfix" @on-row-click="toggleTableExpand" 
        :class="{'no-data':dataList && dataList.length === 0}" />
    </client-only>
    <client-only>
      <Table v-if="isPc === false" :columns="columns($root, isEpd, true)" 
        :data="dataList" :loading="isloading" ref="tableAntPlMini" 
        @on-row-click="toggleTableExpandMini" class="table-mini clearfix" 
        :class="{'no-data': dataList && dataList.length === 0}">
        <template slot-scope="{ row, index }" slot="action1">
          <Dropdown class="opt-h5" trigger="custom" :visible="stopDrop[row.coinType]" :stop-propagation="true" @on-clickoutside="e=>{closeOptH5Drop(e, row)}">
            <span class="opt-h5-icon" :ref="row.coinType+index+'icon'" @click.stop="e=>{openOptH5Drop(e,row)}"></span>
            <DropdownMenu :id="'drop-'+row.coinType" :ref="'drop-'+row.coinType" slot="list">
              <DropdownItem>
                <a :href="helpHref(row.coinType)" target='_black' @click.stop="">{{$t('home.minghlp')}}</a>
              </DropdownItem>
              <DropdownItem>
                <span @click="e=>{onShowModalCal(e, row)}">{{$t('home.calc')}}</span>
              </DropdownItem>
              <DropdownItem>
                <span @click="e=>{closeOptH5Drop(e, row)}">{{$t('home.closeDrop')}}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </Table>
    </client-only>
  </div>
</template>

<script>
import columns from './columnAntPl'
import { mapGetters } from 'vuex'
import {helpUrl, helpUrlArr} from '../../libs/config'
import ClientOnly from 'vue-client-only'
export default {
  name: 'antPlTable',
  data () {
    return {
      dataList:[], isloading: true, columns: columns(this), total: 0,
      nmcType: '',
      isEpd:true,
      stopDrop:{}
    }
  },
  components:{ ClientOnly },
  props: ['dateQuery', 'settleAccount','data'],
  computed: {
    ...mapGetters(['currentCoin', 'lan', 'isPc']),
  },
  methods: {
    toggleTableExpand(row, index) {
      this.$refs.tableAntPl.toggleExpand(index);
    },
    toggleTableExpandMini(row, index) {
      this.$refs.tableAntPlMini.toggleExpand(index);
    },
    fetchDataList(data) {
      this.dataList = Object.freeze(data);
      this.isloading = false;
    },
    onShowModalCal(e, data) {
      if(e) e.stopPropagation();
      this.$emit("onShowModalCal", data);
    },
    helpHref(coinType){
      let hrefStr = helpUrlArr[coinType] ? `${helpUrl}${helpUrlArr[coinType][this.lan]}` : '';
      return hrefStr;
    },
    openOptH5Drop(e, row){
      e.stopPropagation();
      this.$set(this.stopDrop, row.coinType, true);
    },
    closeOptH5Drop(e, row){
      e.stopPropagation();
      this.$set(this.stopDrop, row.coinType, false);
    },
  }
}
</script>

<style lang='less'>

</style>
