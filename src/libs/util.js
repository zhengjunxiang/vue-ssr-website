/* eslint-disable */
import miment from 'miment';
import { lans, regxArr } from 'src/libs/config';

let util = {};
const pattern = new RegExp("[`~!#$^&*()=|{}':;'.,\\[\\]<>/\\\\?~！#￥……&*（）——|{}【】‘；：”“'。，、？ @%+-]");
const patternRemark = new RegExp("[`~!#$^&*()=|{}':;'.,\\[\\]<>/\\\\?~！#￥……&*（）——|{}【】‘；：”“'。，、？@%+-]");
const patternSearch = new RegExp("[`~!#$^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
const number = new RegExp("^[0-9]+([.]{1}[0-9]+){0,1}$");
const userId = new RegExp("^[A-Za-z0-9@+#/$*|-]+$");
const email = new RegExp("^[0-9A-Za-z+#/.$*|-]+@[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$");
const emailPattern = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
const telPattern = new RegExp(/^1[345789]\d{9}$/)

util.mapScript = str => pattern.test(str);
util.mapScriptRemark= str => patternRemark.test(str);
util.mapScriptSearch = str => patternSearch.test(str);
util.mapNumber = n => number.test(n);
util.mapUserId = str => str.match(userId) === null;
util.mapEmail = str => email.test(str);
util.emailScript = str => emailPattern.test(str);
util.telScript = str => telPattern.test(str);

util.title = title => {
  if (title) window.document.title = title;
};

util.checkLan = () => {
  const naLan = navigator.language, loLan = localStorage.getItem('language'),
  queryLan = util.getQueryString('lang');
  if (queryLan) return util.switchLan(queryLan);
  if (loLan) {
    if (lans.map(lan => lan.value).indexOf(loLan) === -1) {
      localStorage.removeItem('language');
      return util.switchLan(naLan);
    } else return loLan;
  } else if (naLan) return util.switchLan(naLan);
  return 'en';
}

util.switchLan = (value) => {
  if (value.indexOf('zh') !== -1) return 'zh';
  else if (value.indexOf('en') !== -1) return 'en';
  // else if (value.indexOf('ru') !== -1) return 'ru';
  return 'en';
}

util.getQueryString = name => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURI(unescape(r[2]));
  return null;
}

util.store = {
  add: (key, value) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([value]));
    else {
      const walletAddrStr = localStorage.getItem(key);
      let walletAddrArr = [];
      try {
        walletAddrArr = JSON.parse(walletAddrStr);
        if (!walletAddrArr.some(addr => addr === value)) {
          walletAddrArr.unshift(value);
          if (walletAddrArr.length > 10) walletAddrArr.pop();
          localStorage.setItem(key, JSON.stringify(walletAddrArr))
        }
      } catch (e) { localStorage.setItem(key, JSON.stringify([])) }
    }
  },
  get: key => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [],
  remove: (key, value) => {
    const str = localStorage.getItem(key);
    let index, arr;
    if (!str) return null;
    arr = JSON.parse(str);
    index = arr.indexOf(value);
    if (index !== -1) {
      arr.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(arr));
    }
    return null;
  }
}

util.timeAgo = time => {
  const between = Date.now() / 1000 - Number(time);
  if (between < 60) return pluralize(~~between, 's');
  else if (between < 3600) return pluralize(~~(between / 60), 'm');
  else if (between < 86400) return pluralize(~~(between / 3600), 'h');
  else return pluralize(~~(between / 86400), 'D');
}

function pluralize (time, label) {
  if (time === 1) return time + label;
  return time + label
}

util.getYear = (time) => {
  let date = time ? new Date(time) : new Date(), year = date.getFullYear();
  return year;
}

util.fNum = (s, n) => {
  // 参数说明：s：要格式化的数字，n：保留几位小数
  let isMinus = false
  if (!s && s !== 0) return 0;
  if (s < 0) {
    isMinus = true
    s *= -1;
  }
  if (s < Math.pow(10, -6)) s = 0;
  n = n > -1 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1] || '', t = "";
  for (var i = 0; i < l.length; i++) t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  return (isMinus ? '-' : '') + (t.split("").reverse().join("") + (r ? ("." + r) : ''));
}

util.fDate = (date, f) => {
  if (date) return miment(date).format(f || 'YYYY-MM-DD hh:mm:ss');
  else if (date === null || date === 'null') return '--';
  else return miment().format(f || 'YYYY-MM-DD hh:mm:ss');
}

util.deepCopy = source => {
  if (!source || typeof source !== 'object')
    throw new Error('error arguments', 'shallowClone');
  var targetObj = source.constructor === Array ? [] : {};
  for (var keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = util.deepCopy(source[keys]);
      } else targetObj[keys] = source[keys];
    }
  }
  return targetObj;
}

util.getByteLen = str => str.replace(/[^\u0000-\u00ff]/g, "aa").length;

util.getColor = () => 'hsla('+ Math.floor(Math.random()*360)+',100%,'+(Math.random()*20+30)+'%,1)';

util.getFullNum = num => {
  if(isNaN(num)) return num;
  var str = ''+num;
  if(!/e/i.test(str)) return num;
  return (num).toFixed(18).replace(/\.?0+$/, "")-0;
}
util.regWalletAddress = value => {
  return Object.keys(regxArr).find(key => {
    if (RegExp('^' + regxArr[key] + '$').test(value)) return true;
    else return false;
  });
}
util.requireIcon = name => {
  try { return require(`../assets/images/icons/${name}`) }
  catch (e) { 
    console.log('e', e)
    return '' }
}
util.requireCoinsIcon = name => {
  try { 
    if (name.indexOf('GRIN') !== -1) return require('../assets/images/currency/GRIN.png'); 
    else if (name.indexOf('DGB') !== -1) return require('../assets/images/currency/DGB.png');
    return require(`../assets/images/currency/${name}`) 
  } catch (e) { 
    console.log('e', e)
    return '' }
}
util.requireIcon0 = name => {
  try { return require(`../assets/images/icon/${name}`) }
  catch (e) { 
    console.log('e', e)
    return '' }
}
util.requireImg = name => {
  try {
    return require(`../assets/images/${name}`);
  } catch (e) {
    return ''
  }
}
util.requireImgAuto = (name, lan, format) => {
  try {
    const w = document.body.clientWidth, arr = name.split('.');
    let ext = '';
    if (lan === 'en') ext += '-en';
    if (w <= 768) {
      ext += '-m';
      if (format) arr[1] = format;
    }
    return require(`../assets/images/${arr[0]}${ext}.${arr[1]}`)
  } catch (e) {
    console.log('e', e)
    return require(`../assets/images/${name}`) || '';
  }
}
util.requireCurrencyImg = name => {
  try {
    if (name.indexOf('GRIN') !== -1) return require('../assets/images/currency/GRIN.png');
    else if (name.indexOf('DGB') !== -1) return require('../assets/images/currency/DGB.png'); 
    return require(`../assets/images/currency/${name}`) 
  } catch (e) { return '' }
}

util.getUrl = () => {
  const pathname = window.location.pathname;
  if (pathname === '/') return window.location.origin;
  else return window.location.origin + pathname
}

util.getPathName = () => {
  const pathname = window.location.pathname;
  if (pathname) return pathname;
}

util.getOrigin= () => window.location.origin;

util.setExportFileName = (name, that) => {
  let time = util.fDate(new Date().getTime(), 'YYYYMMDD');
  let userId = that.$store.getters.userId;
  let coin = that.$store.getters.currentCoin
  return `${name} ${time} ${userId}-${coin}`;
}

util.selectUnit = num => {
  if (!num) return '';
  const len = (num+'').length;
  if (len === 13) return 'T';
  else if (len === 16) return 'P'
  else if (len === 10) return 'G'
  else if (len === 7) return 'M'
  else if (len === 4) return 'K'
  else if (len === 19) return 'E' 
  else if (len === 1) return 'g' 
  else return '';
}

util.selectUnitReverse = num => {
  if (!num) return 0;
  if (num === 'T') return 1000000000000;
  else if (num === 'P') return 1000000000000000
  else if (num === 'G') return 1000000000
  else if (num === 'M') return 1000000
  else if (num === 'K') return 1000
  else if (num === 'E') return 1000000000000000000
  else if (num === 'g') return 1
}

//头部算力排序
util.order = arry => {
  var len = arry.length, i, j, tmp, result;
  // 设置数组副本
  result = arry.slice(0);
  for(i=1; i < len; i++){
    tmp = result[i];
    j = i - 1;
    while(j>=0 && tmp.hashRate > result[j].hashRate){
      result[j+1] = result[j];
      j--;
    }
    result[j+1] = tmp;
  }
  return result;
}

//头部算力排序
util.orderHashTime = arry => {
  if(arry){
    var len = arry.length, i, j, tmp, result;
    // 设置数组副本
    result = arry.slice(0);
    for(i=1; i < len; i++){
      tmp = result[i];
      j = i - 1;
      while(j>=0 && tmp.timestamp < result[j].timestamp){
        result[j+1] = result[j];
        j--;
      }
      result[j+1] = tmp;
    }
    return result;
  }
}

export default util;
