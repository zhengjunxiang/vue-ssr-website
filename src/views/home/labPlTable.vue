<template>
  <div class='labPlTable'>
    <client-only>
      <Table v-if="isPc === true" :columns="columns($root, true)" 
        :data="dataList" :loading="isloading" ref="tableLabPl" 
        @on-row-click="toggleTableExpand" class="table-large clearfix" 
        :class="{'no-data': dataList && dataList.length === 0}" />
    </client-only>
    <client-only>
      <Table v-if="isPc === false" :columns="columns($root, true, true)" 
        :data="dataList" :loading="isloading" ref="tableLabPlMini" 
        @on-row-click="toggleTableExpandMini" class="table-mini clearfix" 
        :class="{'no-data': dataList && dataList.length === 0}">
        <template slot-scope="{ row, index }" slot="action">
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
import columns from './columnLabPl'
import { mapGetters } from 'vuex'
import {helpUrl, helpUrlArr} from '../../libs/config'
import ClientOnly from 'vue-client-only'
export default {
  name: 'labPlTable',
  data () {
    return {
      dataList: [], isloading: false, columns: columns(this), total: 0,
      stopDrop:{}
    }
  },
  components:{ ClientOnly },
  props: ['dateQuery', 'settleAccount'],
  computed: {
    ...mapGetters(['currentCoin', 'lan', 'isPc']),
  },
  methods: {
    toggleTableExpand(row, index) {
　　  　this.$refs.tableLabPl.toggleExpand(index);
　  },
    toggleTableExpandMini(row, index) {
　　  　this.$refs.tableLabPlMini.toggleExpand(index);
　  },
    fetchDataList(data) {
      this.dataList = Object.freeze(data);
    },
    onShowModalCal(e, data) {
      e.stopPropagation();
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
