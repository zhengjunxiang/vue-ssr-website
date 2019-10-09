import expandRow from './payTable-expand';

export default that => (root, bool, isH5) => {
  const coin = that.activeCoinType;
  var expand = {
    type: 'expand',
    width: 25,
    render: (h, params) => {
      return h(expandRow, {
        props: {
          data: params.row,
          expandData: that.expandDataList,
          coin: coin,
          loading: that.extendLoading,
          expandH5: isH5,
          browser: that.browser
        },
      });
    }
  }
  var columnsArr = [
    {
      title: root.$t('incomeRecord.payTableHeadDate'),
      key: 'creatDate',
      sortable: 'custom',
      width:'150',
      sortType: that.sortType['creatDate'],
      render: (h, params) => {
        const {creatDate} = params.row;
        return h('span', that.$U.fDate(creatDate, 'YYYY-MM-DD'))
      }
    },
    {
      title: root.$t('incomeRecord.payTableHeadAmount'),
      key: 'amount',
      align:'right',
      width:'250',
      render: (h, params) => {
        const {amount} = params.row;
        return h('span', [
          h('span', amount),
          h('span', {
            class: 'hash-unit' },
            that.activeCoinType === 'DOC' ? 'DOGE' : that.activeCoinType
          )
        ])
      }
    },
    {
      title: root.$t('incomeRecord.payTableHeadWalletAddr'),
      key: 'walletAddress',
      align:'center',
      render: (h, params) => {
        const {walletAddress} = params.row;
        let b = that.browser[coin];
        if (b) {
          if (coin === 'ETH') b = `${b}account/`;
          else if (coin === 'ETC') b = `${b}addr/`;
          else if (coin === 'LTC' || coin === 'DASH' || coin === 'SCC' || coin === 'BTM'
          || coin === 'NMC' || coin === 'DOC') b = `${b}address/`;
          else if (coin === 'ZEC') b = `${b}accounts/`;
          else if (coin === 'XMC') b = `${b}search?value=`;
          return h('a', {
            class: 'pay-link',
            attrs: {
              href: b ? `${b}${walletAddress}` : '',
              target: b ? '_black' : ''
            }
          }, walletAddress);
        } else return h('span', walletAddress);
      }
    },
    {
      title: root.$t('incomeRecord.payTableHeadTransaction'),
      key: 'transactionHash',
      align:'right',
      render: (h, params) => {
        const {transactionHash} = params.row;
        let b = that.browser[coin];
        if (transactionHash) {
          if (b) {
            if (coin === 'ETH' || coin === 'ETC' || coin === 'LTC' || coin === 'DASH'
            || coin === 'SCC' || coin === 'XMC' || coin === 'NMC' || coin === 'DOC') b = `${b}tx/`;
            else if (coin === 'ZEC') b = `${b}transactions/`;
            else if (coin === 'BTM') b = `${b}transaction/`;
            return h('a', {
              class: 'transactionHash-link',
              attrs: {
                class: 'pay-link',
                href: b ? `${b}${transactionHash}` : '',
                target: b ? '_black' : ''
              }
            }, transactionHash);
          } else return h('span', transactionHash); 
        } else return h('span', root.$t('common.processing'));
      }
    },
  ];
  var columnsArrH5 = [
    {
      title: root.$t('incomeRecord.payTableHeadDate'),
      key: 'creatDate',
      sortable: 'custom',
      width:'150',
      sortType: that.sortType['creatDate'],
      render: (h, params) => {
        const {creatDate} = params.row;
        return h('span', that.$U.fDate(creatDate, 'YYYY-MM-DD'))
      }
    },
    {
      title: root.$t('incomeRecord.payTableHeadAmount'),
      key: 'amount',
      align:'right',
      //width:'200',
      render: (h, params) => {
        const {amount} = params.row;
        return h('span', [
          h('span', amount),
          h('span', {class: 'hash-unit'}, coin)
        ])
      }
    }
  ];
  let columns = isH5 == true ? columnsArrH5 : columnsArr;
  if (bool) columns = [expand, ...columns];
  return columns;
}