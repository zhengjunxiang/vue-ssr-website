const version = "v1.0.0";

const lans = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  // { value: "ru", label: "русский" }
];

const baseUrl = ''
const helpUrl = 'https://XXX.kf5.com'
const testLoginUrl = 'http://47.106.151.197:9999'
const loginPath = ['/dashboard', '/recvAndPay', '/worker', '/setting'];

const helpUrlArr = {
  RVN:{
    zh:'/hc/kb/article/1248907/',
    en:'/hc/kb/article/1248910/'
  },
  DCR:{
    zh:'/hc/kb/article/1228518/',
    en:'/hc/kb/article/1235024/'
  },
  ETN:{
    zh:'/hc/kb/article/1253801/',
    en:'/hc/kb/article/1253832/'
  },
  HC:{
    zh:'/hc/kb/article/1228519/',
    en:'/hc/kb/article/1238182/'
  },
  XMR:{
    zh:'/hc/kb/article/1288673/',
    en:'/hc/kb/article/1288918/'
  },
  BTC:{
    zh:'/hc/kb/article/1275138/',
    en:'/hc/kb/article/1277519/'
  },
  BCH:{
    zh:'/hc/kb/article/1275138/',
    en:'/hc/kb/article/1277519/'
  },
  LTC:{
    zh:'/hc/kb/article/1275163/',
    en:'/hc/kb/article/1277563/'
  },
  ETC:{
    zh:'/hc/kb/article/1275271/',
    en:'/hc/kb/article/1281448/'
  },
  ETH:{
    zh:'/hc/kb/article/1275271/',
    en:'/hc/kb/article/1281448/'
  },
  ZEC:{
    zh:'/hc/kb/article/1276566/',
    en:'/hc/kb/article/1281500/'
  },
  DASH:{
    zh:'/hc/kb/article/1277211/',
    en:'/hc/kb/article/1281526/'
  },
  SCC:{
    zh:'/hc/kb/article/1277250/',
    en:'/hc/kb/article/1281538/'
  },
  BTM:{
    zh:'/hc/kb/article/1277343/',
    en:'/hc/kb/article/1282222/'
  },
  XMC:{
    zh:'/hc/kb/article/1277291/',
    en:'/hc/kb/article/1282210/'
  },
  BEAM:{
    zh:'/hc/kb/article/1295681/',
    en:'/hc/kb/article/1296369/'
  },
  AXE:{
    zh:'/hc/kb/article/1297267/',
    en:'/hc/kb/article/1297268/'
  },
  DERO:{
    zh:'/hc/kb/article/1295690/',
    en:'/hc/kb/article/1295691/'
  },
  GRIN29:{
    zh:'/hc/kb/article/1308421/',
    en:'/hc/kb/article/1308422/'
  },
  GRIN31:{
    zh:'/hc/kb/article/1308421/',
    en:'/hc/kb/article/1308422/'
  },
  'DGB_SHA256D':{
    zh:'/hc/kb/article/1313075/',
    en:'/hc/kb/article/1313076/'
  },
  'DGB_SCRYPT':{
    zh:'/hc/kb/article/1313075/',
    en:'/hc/kb/article/1313076/'
  }
}

const mineAddress = {
  "BTC": ['stratum+tcp://stratum.XXX.com:3333', 'stratum+tcp://stratum.XXX.com:443', 'stratum+tcp://stratum.XXX.com:25'],
  "BCH": ['stratum+tcp://stratum.XXX.com:3333', 'stratum+tcp://stratum.XXX.com:443', 'stratum+tcp://stratum.XXX.com:25'],
  "LTC": ['stratum+tcp://stratum-ltc.XXX.com:8888', 'stratum+tcp://stratum-ltc.XXX.com:443', 'stratum+tcp://stratum-ltc.XXX.com:25'],
  "ETH": ['stratum+tcp://stratum-eth.XXX.com:8008', 'stratum+tcp://stratum-eth.XXX.com:443', 'stratum+tcp://stratum-eth.XXX.com:25'],
  "ETC": ['stratum+tcp://stratum-etc.XXX.com:8008', 'stratum+tcp://stratum-etc.XXX.com:443', 'stratum+tcp://stratum-etc.XXX.com:25'],
  "DASH": ['stratum+tcp://stratum-dash.XXX.com:6099', 'stratum+tcp://stratum-dash.XXX.com:443', 'stratum+tcp://stratum-dash.XXX.com:25'],
  "ZEC": ['stratum+tcp://stratum-zec.XXX.com:8899', 'stratum+tcp://stratum-zec.XXX.com:443', 'stratum+tcp://stratum-zec.XXX.com:25'],
  "SCC": ['stratum+tcp://stratum-sc.XXX.com:7777', 'stratum+tcp://stratum-sc.XXX.com:443', 'stratum+tcp://stratum-sc.XXX.com:25'],
  "XMC": ['stratum+tcp://stratum-xmc.XXX.com:5555', 'stratum+tcp://stratum-xmc.XXX.com:443', 'stratum+tcp://stratum-xmc.XXX.com:25'],
  "BTM": ['stratum+tcp://stratum-btm.XXX.com:6666', 'stratum+tcp://stratum-btm.XXX.com:443', 'stratum+tcp://stratum-btm.XXX.com:25'],
}

const browser = {
  "BTC": 'https://btc.com/',
  "BCH": 'https://bch.btc.com/',
  "LTC": 'https://insight.litecore.io/',
  "ETH": 'https://etherchain.org/',
  "ETC": 'http://gastracker.io/',
  "DASH": 'https://explorer.dash.org/chain/Dash',
  "ZEC": 'https://explorer.zcha.in/',
  "SCC": 'https://scc.tokenview.com/en/',
  "XMC": 'http://explorer.monero-classic.org/',
  "BTM": 'http://www.btmscan.com/',
  "NMC": 'https://namecha.in/',
  "DOC": 'https://dogechain.info/chain/Dogecoin'
}

const regxArr = {
  dcr: "D[1-9A-HJ-NP-Za-km-z]{27,35}",
  hc: "H[1-9A-HJ-NP-Za-km-z]{27,35}",
  beam: "[0-9a-fA-F]{40,90}",
  rvn: "[Rr][1-9A-HJ-NP-Za-km-z]{33}",
  etn: "etn[0-9a-zA-Z]{0,100}(?:\\.[0-9a-fA-F]{16,64})?",
  xmr: "[48][1-9A-HJ-NP-Za-km-z]{94,105}(?:\\.[0-9a-fA-F]{16,64})?",
  dero: "dER[0-9a-zA-Z]+",
  axe: "P[0-9A-Za-z]{33}",
  gin: "[G][0-9a-zA-Z]{33}",
  zec: "[t][0-9a-zA-Z]{0,35}",
  eth: "[0x|0X][0-9a-zA-Z]{0,40}",
  etc: "[0x|0X][0-9a-zA-Z]{0,40}",
  grin29: "^[0-9A-Za-z+#/.$*|-]+@[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$",
  grin31: "^[0-9A-Za-z+#/.$*|-]+@[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+$",
  dgb_scrypt: "[DS][0-9A-Za-z]{27,35}",
  dgb_sha256d: "[DS][0-9A-Za-z]{27,35}"
}

const timeZone = {
  en: [
    {value: 'TIME_ZONE_M12', label: '(GMT -12:00) Eniwetok, Kwajalein'},
    {value: 'TIME_ZONE_M11', label: '(GMT -11:00) Midway Island, Samoa'},
    {value: 'TIME_ZONE_M10', label: '(GMT -10:00) Hawaii'},
    {value: 'TIME_ZONE_M9', label: '(GMT -9:00) Alaska'},
    {value: 'TIME_ZONE_M8', label: '(GMT -8:00) Pacific Time (US &amp; Canada)'},
    {value: 'TIME_ZONE_M7', label: '(GMT -7:00) Mountain Time (US &amp; Canada)'},
    {value: 'TIME_ZONE_M6', label: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City'},
    {value: 'TIME_ZONE_M5', label: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima'},
    {value: 'TIME_ZONE_M4', label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz'},
    {value: 'TIME_ZONE_M3_5', label: '(GMT -3:30) Newfoundland'},
    {value: 'TIME_ZONE_M3', label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown'},
    {value: 'TIME_ZONE_M2', label: '(GMT -2:00) Mid-Atlantic'},
    {value: 'TIME_ZONE_M1', label: '(GMT -1:00 hour) Azores, Cape Verde Islands'},
    {value: 'TIME_ZONE_0', label: '(GMT) Western Europe Time, London, Lisbon, Casablanca'},
    {value: 'TIME_ZONE_1', label: '(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris'},
    {value: 'TIME_ZONE_2', label: '(GMT +2:00) Kaliningrad, South Africa'},
    {value: 'TIME_ZONE_3', label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg'},
    {value: 'TIME_ZONE_3_5', label: '(GMT +3:30) Tehran'},
    {value: 'TIME_ZONE_4', label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi'},
    {value: 'TIME_ZONE_4_5', label: '(GMT +4:30) Kabul'},
    {value: 'TIME_ZONE_5', label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent'},
    {value: 'TIME_ZONE_5_5', label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi'},
    {value: 'TIME_ZONE_6', label: '(GMT +6:00) Almaty, Dhaka, Colombo'},
    {value: 'TIME_ZONE_6_5', label: '(GMT +6:30) Myanmar'},
    {value: 'TIME_ZONE_7', label: '(GMT +7:00) Bangkok, Hanoi, Jakarta'},
    {value: 'TIME_ZONE_8', label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong'},
    {value: 'TIME_ZONE_9', label: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk'},
    {value: 'TIME_ZONE_9_5', label: '(GMT +9:30) Adelaide, Darwin'},
    {value: 'TIME_ZONE_10', label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok'},
    {value: 'TIME_ZONE_11', label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia'},
    {value: 'TIME_ZONE_12', label: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka'},
  ],
  zh: [
    {value: 'TIME_ZONE_M12', label: '(GMT -12:00) 埃尼威托克岛, 夸贾林环礁'},
    {value: 'TIME_ZONE_M11', label: '(GMT -11:00) 萨摩亚, 中途岛'},
    {value: 'TIME_ZONE_M10', label: '(GMT -10:00) 夏威夷'},
    {value: 'TIME_ZONE_M9', label: '(GMT -9:00) 阿拉斯加'},
    {value: 'TIME_ZONE_M8', label: '(GMT -8:00) 太平洋时间 (美国 &amp; 加拿大)'},
    {value: 'TIME_ZONE_M7', label: '(GMT -7:00) 山区标准时间 (美国 &amp; 加拿大)'},
    {value: 'TIME_ZONE_M6', label: '(GMT -6:00) 中部时间 (美国 &amp; 加拿大), 墨西哥城'},
    {value: 'TIME_ZONE_M5', label: '(GMT -5:00) 东部时间 (美国 &amp; 加拿大), 波哥大, 利马'},
    {value: 'TIME_ZONE_M4', label: '(GMT -4:00) 大西洋时间 (加拿大), 加拉加斯, 拉巴斯'},
    {value: 'TIME_ZONE_M3_5', label: '(GMT -3:30) 纽芬兰岛'},
    {value: 'TIME_ZONE_M3', label: '(GMT -3:00) 巴西, 布宜诺斯艾利斯, 乔治敦'},
    {value: 'TIME_ZONE_M2', label: '(GMT -2:00) 中大西洋'},
    {value: 'TIME_ZONE_M1', label: '(GMT -1:00 hour) 亚速尔群岛, 佛得角群岛'},
    {value: 'TIME_ZONE_0', label: '(GMT) 欧洲西部时间, 伦敦, 里斯本, 卡萨布兰卡'},
    {value: 'TIME_ZONE_1', label: '(GMT +1:00 hour) 布鲁塞尔, 哥本哈根, 马德里, 巴黎'},
    {value: 'TIME_ZONE_2', label: '(GMT +2:00) 加里宁格勒, 南非'},
    {value: 'TIME_ZONE_3', label: '(GMT +3:00) 巴格达, 利雅得, 莫斯科, 圣彼得堡'},
    {value: 'TIME_ZONE_3_5', label: '(GMT +3:30) 德黑兰'},
    {value: 'TIME_ZONE_4', label: '(GMT +4:00) 阿布扎比, 马斯喀特, 巴库, 巴库'},
    {value: 'TIME_ZONE_4_5', label: '(GMT +4:30) 喀布尔'},
    {value: 'TIME_ZONE_5', label: '(GMT +5:00) 叶卡捷琳堡, 伊斯兰堡, 卡拉奇, 塔什干'},
    {value: 'TIME_ZONE_5_5', label: '(GMT +5:30) 孟买, 加尔各答, 马德拉斯, 新德里'},
    {value: 'TIME_ZONE_6', label: '(GMT +6:00) 阿拉木图, 达卡, 科伦坡'},
    {value: 'TIME_ZONE_6_5', label: '(GMT +6:30) 缅甸'},
    {value: 'TIME_ZONE_7', label: '(GMT +7:00) 曼谷, 河内, 雅加达'},
    {value: 'TIME_ZONE_8', label: '(GMT +8:00) 北京,珀斯,新加坡,香港'},
    {value: 'TIME_ZONE_9', label: '(GMT +9:00) 东京,汉城,大阪,札幌,雅库茨克'},
    {value: 'TIME_ZONE_9_5', label: '(GMT +9:30) 阿德莱德,达尔文'},
    {value: 'TIME_ZONE_10', label: '(GMT +10:00) 海参崴东部,关岛,澳大利亚'},
    {value: 'TIME_ZONE_11', label: '(GMT +11:00) 马加丹,所罗门群岛,新喀里多尼亚'},
    {value: 'TIME_ZONE_12', label: '(GMT +12:00) 奥克兰,惠灵顿,斐济群岛,堪察加半岛'},
  ]
}

const coinFullName = {
  "BTC": 'Bitcoin',
  "BCH": 'Bitcoin Cash',
  "LTC": 'Litecoin',
  "ETH": 'Ethereum',
  "ETC": 'Ethereum Classic',
  "DASH": 'Dash',
  "ZEC": 'Zcash',
  "SCC": 'Siacoin Classic',
  "XMC": 'Monero Classic',
  "BTM": 'Bytom',
  "RVN": 'Ravencoin',
  "ETN": 'ELECTRONEUM',
  "DCR": 'Decred',
  "XMR": 'Monero',
  "HC": 'HyperCash',
  "BEAM":'BEAM',
  "BSV":'Bitcoin SV',
  "DERO":'Dero',
  "GRIN29":'Grin29',
  "GRIN31":'Grin31',
  "DGB_SHA256D":'DigiByte',
  "DGB_SCRYPT":'DigiByte'
}

const calcUnitArr = {
  "ZEC":{
    "K":"KSol/s",
    "M":"MSol/s",
    "G":"GSol/s",
    "T":"TSol/s",
    "P":"PSol/s",
    "E":"ESol/s",
  },
  "BEAM":{
    "K":"KSol/s",
    "M":"MSol/s",
    "G":"GSol/s",
    "T":"TSol/s",
    "P":"PSol/s",
    "E":"ESol/s",
  },
  "GRIN29":{
    "g":"g/s",
    "K":"Kg/s",
    "M":"Mg/s",
    "G":"Gg/s",
    "T":"Tg/s",
    "P":"Pg/s",
    "E":"Eg/s",
  },
  "GRIN31":{
    "g":"g/s",
    "K":"Kg/s",
    "M":"Mg/s",
    "G":"Gg/s",
    "T":"Tg/s",
    "P":"Pg/s",
    "E":"Eg/s",
  },
  "default":{
    "K":"KH/s",
    "M":"MH/s",
    "G":"GH/s",
    "T":"TH/s",
    "P":"PH/s",
    "E":"EH/s",
  }
}

export { baseUrl, lans, version, mineAddress, browser, timeZone, coinFullName, calcUnitArr, regxArr, helpUrl, helpUrlArr, testLoginUrl, loginPath };
