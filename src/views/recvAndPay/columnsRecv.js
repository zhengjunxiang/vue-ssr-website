import expandRow from './recvTable-expand.vue'

const expand = that => ({
  type: 'expand',
  isExpand: true,
  width: 25,
  render: (h, params) => h(expandRow,
    { props: { data: params.row, that } }
  )
})
const exportColumns = (that, root, isExpand) => {
  const columns = [
    {
      title: root.$t('incomeRecord.incomeTableHeadDate'),
      key: 'creatDate',
      sortable: 'custom',
      isExpand: true,
      width:isExpand == true ? 'auto' : 160,
      sortType: that.sortType['creatDate'],
      render: (h, params) => {
        const {creatDate} = params.row;
        return h('span', that.$U.fDate(creatDate, 'YYYY-MM-DD'))
      }
    },
    {
      title: root.$t('incomeRecord.incomeTableHeadHashRate'),
      key: 'dayHashRate',
      sortable: 'custom',
      isExpand: true,
      sortType: that.sortType['dayHashRate'],
      align:'right',
      render: (h, params) => {
        const {dayHashRate, dayHashRateUnit} = params.row;
        return h('span', [
          h('span', dayHashRate),
          h('span', {class: 'hash-unit'}, dayHashRateUnit)
        ])
      }
    },
    {
      title: root.$t('incomeRecord.incomeTableHeadIncome'),
      key: 'dayRecv',
      align: 'right',
      className:'worker-col',
      isExpand: true,
      render: (h, params) => {
        const {ppaPplnsAmount, ppaPpsAmount, type, plusPercent, dayRecv} = params.row;
        let content = '';
        if (type === 'PPS_PLUS') {
          content = `${ppaPpsAmount} +${ppaPplnsAmount}`;
          return h('Tooltip', { props: { placement: "top", content } }, 
            [
              h('span', {style: {cursor: 'pointer'}}, [
                h('span', dayRecv),
                h('span', {class: 'hash-unit'}, that.currentCoin),
                h('span', {class: 'fee-unit'}, `+${((plusPercent-0)*100).toFixed(2)}%`)
              ])
            ]
          )
        } else {
          return h('span', [ h('span', dayRecv), h('span', {class: 'hash-unit'}, that.currentCoin) ])
        }
      }
    },
    {
      title: root.$t('incomeRecord.incomeTableHeadICType'),
      key: 'type',
      align: 'center',
      render: (h, params) => {
        const {type} = params.row;
        if (type === 'REFUND') return h('span', root.$t('incomeRecord.refund'))
        return h('span', type.replace('_PLUS', '+'))
      }
    },
    {
      title: root.$t('incomeRecord.incomeTableHeadPay'),
      key: 'payStatus',
      sortable: 'custom',
      align: 'right',
      width:160,
      sortType: that.sortType['payStatus'],
      render: (h, params) => {
        const {payStatus} = params.row;
        if(payStatus == 'PAID'){
          var payStatusStyle = 'status-paid';
          var payStatusText = root.$t('incomeRecord.payStatusPaid')
        }else if(payStatus == 'NOTPAID'){
          var payStatusStyle = 'status-unPaid';
          var payStatusText = root.$t('incomeRecord.payStatusUnPaid')
        }else{
          var payStatusStyle = ''
          var payStatusText = root.$t('incomeRecord.payStatusSettled')
        }
        return h('span',{class: payStatusStyle}, payStatusText)
      }
    },
  ];
  if (isExpand) {
    columns.unshift(expand(that));
    return columns.filter(item => item.isExpand)
  }
  return columns;
}

export default (that) => {
  return (root, isExpand) => exportColumns(that, root, isExpand)
}
