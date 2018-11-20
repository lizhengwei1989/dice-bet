import xhr from "axios";

//计算赔率（与区块链算法保持一致）
const getOdds = point => {
  let r = 98.5; //返现率
  if (point == 1) {
    return r;
  }
  return r / (point - 1);
};
const getPoint = random => {
  let r = 1;
  if (random > 0 && random < 17) {
    r = 1;
  } else if (random >= 17 && random < 33) {
    r = 2;
  } else if (random >= 33 && random < 50) {
    r = 3;
  } else if (random >= 50 && random < 67) {
    r = 4;
  } else if (random >= 67 && random < 84) {
    r = 5;
  } else {
    r = 6;
  }
  return r;
};

const formatTime = ns => {
  const d = new Date(ns);
  const dformat = [
    d.getHours(),
    d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
    d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
  ].join(":");
  return dformat;
};

const getBalance = async address => {
  let tronWeb = window.tronWeb;
  const server =
    (typeof tronWeb.eventServer).toUpperCase() === "OBJECT"
      ? tronWeb.eventServer.host
      : tronWeb.eventServer;
  let { data } = await xhr.post(`${server}/wallet/getaccount`, {
    address: address
  });
  if (Object.keys(data).length == 0) {
    return 0;
  }
  return data.balance;
};

const getRanks = async (address, time, type, func) => {
  let { data } = await xhr.get(
    `//testwlcyapi.tronscan.org/api/contract/rank/${address}/${type}?func=${func}&time=${time}`
  );
  return data;
};

const getMinStage = (t)=>{
    let rate = 0,left = 0,stage=0,diceCount = 0;
    const yi = 100000000, precision=1000000;
    if (t < 10 * yi * precision) {
        rate = 1;
        left = t;
        stage = 1;
        diceCount = 10 * yi;
    } else if (t < 30 * yi * precision) {
        rate = 2;
        left = (t - 10 * yi)/rate;
        stage = 2;
        diceCount = 20 * yi / rate;
    } else if (t < 70 * yi * precision) {
        rate = 4;
        left = (t - 30 * yi * precision)/rate;
        stage = 3;
        diceCount = 40 * yi / rate;
    } else if (t < 150 * yi * precision) {
        rate = 8;
        left = (t - 70 * yi * precision)/rate;
        stage = 4;
        diceCount = 80 * yi / rate;
    } else if (t < 390 * yi * precision) {
        rate = 12;
        left = (t - 150 * yi * precision)/rate;
        stage = 5;
        diceCount = 240 * yi / rate;
    } else if (t < 710 * yi * precision) {
        rate = 16;
        left = (t - 390 * yi * precision)/rate;
        stage = 6;
        diceCount = 320 * yi / rate;
    } else if (t < 1110 * yi * precision) {
        rate = 20;
        left = (t - 710 * yi * precision)/rate;
        stage = 7;
        diceCount = 400 * yi / rate;
    }
    return {
        rate,
        left:window.tronWeb.fromSun(left),
        stage,
        diceCount
    }
};


const getLuckyDrawCount = r => {
    let m;
    if(r<=9885){
       m = 0.1;
    }else if(r<=9985){
       m = 1;
    }else if(r<=9993){
       m = 10;
    }else if(r<=9997){
       m = 100;
    }else if(r<=9999){
       m = 1000;
    }else{
       m = 10000;
    }
    return m;
};
function noDebug(address) {
  var threshold = 160;
  if (window) {
    setInterval(function() {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        //throw new Error('error');
      }
    });
  }
}

const isMobile = ()=>{
        const regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
        let u = navigator.userAgent;
        if (null == u) {
            return "mobile";
        }
        var result = regex_match.exec(u);
        let platform = "";
        if (null == result) {
            platform = false;
        } else {
            platform = true;
        }
        return platform;
}
export { getOdds, formatTime, getPoint, getBalance, getRanks, noDebug,getMinStage,getLuckyDrawCount,isMobile };
