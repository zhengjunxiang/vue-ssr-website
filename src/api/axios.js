import axios from 'axios'
import { Message } from 'iview'
import {baseUrl} from '../libs/config'

const instance = axios.create({timeout: 30000});
let lockTimer = null;

const codeError = [
  '001008', '000008', '003006', '000013', '000005',
  '002008', '002009', '000019', '003007', '000003',
  '003013'
];

const codeExpired = ['000403', '000009'];

// 请求统一处理
instance.interceptors.request.use(config => {
  const tokenId = localStorage.getItem('tokenId'),
    lang = window.vm.$store.state.app.lan;
  if (tokenId) config.headers.token = tokenId;
  if (lang) config.headers.lang = lang;
  config.headers.operatorId = 'moreySB';
  if (config.url && config.url.charAt(0) === '/') config.url = `${baseUrl}${config.url}`
  return config
}, error => Promise.reject(error));

// 对返回的内容做统一处理
instance.interceptors.response.use(response => {
  const code = response.data.code, status = response.status;
  if (codeError.indexOf(code) !== -1) {
    response.isCodeError = true;
    let content = '';
    const t = window.vm.$t.bind(window.vm);
    if (code === '001008') content = t('apiErrMes.fErr01');
    if (code === '000008') content = t('apiErrMes.fErr02');
    if (code === '003006') content = t('apiErrMes.fErr03');
    if (code === '000013') content = t('apiErrMes.fErr04');
    if (code === '000005') content = t('apiErrMes.fErr05');
    if (code === '002008') content = t('apiErrMes.fErr06');
    if (code === '002009') content = t('apiErrMes.fErr07');
    if (code === '000019') content = t('apiErrMes.fErr08');
    if (code === '003007') content = t('apiErrMes.fErr09');
    if (code === '000003') content = t('apiErrMes.fErr10');
    if (code === '003013') content = t('apiErrMes.fErr11');
    Message.error({ content, duration: 5 });
    return Promise.reject(response);
  }
  if (typeof response.data.data === 'undefined') response.data.data = null;
  if (status === 200 && code === '000000') {
    const content = response.data.msg
    content && Message.warning({ content, duration: 5 });
    return response.data;
  } else if (status === 200 && codeExpired.indexOf(code) !== -1) {
    response.isCodeError = true;
    if (!lockTimer) {
      const t = window.vm.$t.bind(window.vm);
      lockTimer = setTimeout(() => {
        clearTimeout(lockTimer);
        lockTimer = null;
      }, 5000);
      window.vm.$router.push({path: '/home'});
      window.vm.$store.commit('loginOut');
      Message.error({ content: t('error.loginAgain'), duration: 5 });
    }
  }
  return Promise.reject(response);
}, error => {
  if (error.response && error.response.data && error.response.data.msg) Message.error(error.response.data.msg)
  return Promise.reject(error)
})

export default instance
