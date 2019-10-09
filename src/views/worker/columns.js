import expandRow from './table-expand.vue'

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
      title: ' ',
      width: 5,
      isExpand: true,
      key: '',
      className:'status-col',
      render: (h, params) => {
        const {workerStatus} = params.row;
        let status = '';
        if (workerStatus === 3) status = 'fail';
        else if (workerStatus === 1) status = 'online';
        else if (workerStatus === 2) status = 'offline';
        return h('div', {class: `table-line ${status}`}, '');
      }
    },
    {
      type: 'selection',
      width: 50,
      className:'check-col'
    },
    {
      title: root.$t('common.worker'),
      key: 'workerId',
      isExpand: true,
      sortable: 'custom',
      maxWidth: 170,
      className:'worker-col',
      sortType: that.sortType['workerId'],
      render: (h, params) => {
        const {workerId, userWorkerId} = params.row;
        return h('Tooltip', {
            props: {
              placement: "top-start",
              content: `${userWorkerId}`
            }
          }, 
          [ h('span', {style: {cursor: 'pointer'}}, workerId) ]
        )
      }
    },
    {
      title: root.$t('common.curTimeHash'),
      key: 'hsLast1H',
      isExpand: true,
      sortable: 'custom',
      sortType: that.sortType['hsLast1H'],
      align:'center',
      className:'curTimeHash-col',
      render: (h, params) => {
        const {hsLast1H} = params.row;
        const arr = hsLast1H.split(' ');
        return h('span', [
          h('span', arr[0]),
          h('span', {class: 'hash-unit'}, arr[1] || '')
        ])
      }
    },
    {
      title: root.$t('common.oneDay'),
      key: 'hsLast1D',
      isExpand: true,
      sortable: 'custom',
      sortType: that.sortType['hsLast1D'],
      align:'center',
      className:'oneDay-col',
      render: (h, params) => {
        const {hsLast1D} = params.row;
        const arr = hsLast1D.split(' ');
        return h('span', [
          h('span', arr[0]),
          h('span', {class: 'hash-unit'}, arr[1] || '')
        ])
      }
    },
    {
      title: root.$t('common.rejectRatio'),
      key: 'rejectRatio',
      align:'center',
      className:'rejectRatio-col',
      renderHeader: (h, params) => {
        return h('div',[
          h('span', root.$t('common.rejectRatio')),
          h('span',{ class:'rejectRatio-icon'}, [
            h('span','i'),
            h('span',{
              class:'rejectRatio-icon-tip'
            }, root.$t('user.rejectRatioTip'))
          ])
        ])
      }
    },
    {
      title: root.$t('common.shareLastTime'),
      key: 'shareLastTime',
      //isExpand: true,
      align:'right',
      sortable: 'custom',
      sortType: that.sortType['shareLastTime'],
      className:'shareLastTime-col',
      render: (h, params) => {
        const {shareLastTime, workerStatus} = params.row;
        let age = '', time, textStatus = '';
        const winScreenW = window.screen.width;
        var dateFormatStr = 'YYYY-MM-DD hh:mm';
        if (workerStatus === 2) {
          textStatus = 'inactive-text',
          time = `${that.$U.fDate(shareLastTime, dateFormatStr)}`
        } else if (workerStatus === 3) {
          textStatus = 'invalid-text',
          time = `${that.$U.fDate(shareLastTime, dateFormatStr)}`
        } else time = that.$U.fDate(shareLastTime, dateFormatStr);
        return h('div',[
          h('span', { class: textStatus }, time)
        ])
      }
    },
    {
      title: ' ',
      key: 'workerStatus',
      isExpand: true,
      align:'right',
      width:20,
      className:'chartIcon-col',
      render: (h, params) => {
        return h('div',[
          h('span', {
            class: 'icon icon-graph',
            on: { click: () => { that.onShowWorkerGraph(params.row, 'line') } }
          }, '')
        ])
      }
    }
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