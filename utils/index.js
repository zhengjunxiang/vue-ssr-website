const util = {
  switchLan: (value) => {
    if (value.indexOf('zh') !== -1) return 'zh';
    else if (value.indexOf('en') !== -1) return 'en';
    // else if (value.indexOf('ru') !== -1) return 'ru';
    return 'zh';
  }
}

module.exports = util;