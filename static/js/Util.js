import xhr from "axios";

//计算赔率（与区块链算法保持一致）
const getOdds = point => {
  let r = 98; //返现率
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
    const yi = 100000000,precision=1000000;
    if (t < 5 * yi * precision) {
        rate = 1;
        left = t;
        stage = 1;
        diceCount = 5 * yi;
    } else if (t < 10 * yi * precision) {
        rate = 2;
        left = (t - 5 * yi)/rate;
        stage = 2;
        diceCount = 5 * yi / rate;
    } else if (t < 20 * yi * precision) {
        rate = 4;
        left = (t - 10 * yi * precision)/rate;
        stage = 3;
        diceCount = 5 * yi / rate;
    } else if (t < 40 * yi * precision) {
        rate = 8;
        left = (t - 20 * yi * precision)/rate;
        stage = 4;
        diceCount = 5 * yi / rate;
    } else if (t < 120 * yi * precision) {
        rate = 12;
        left = (t - 40 * yi * precision)/rate;
        stage = 5;
        diceCount = 10 * yi / rate;
    } else if (t < 160 * yi * precision) {
        rate = 16;
        left = (t - 120 * yi * precision)/rate;
        stage = 6;
        diceCount = 10 * yi / rate;
    } else if (t < 200 * yi * precision) {
        rate = 20;
        left = (t - 160 * yi * precision)/rate;
        stage = 7;
        diceCount = 10 * yi / rate;
    }
    return {
        rate,
        left:window.tronWeb.fromSun(left),
        stage,
        diceCount
    }
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

export { getOdds, formatTime, getPoint, getBalance, getRanks, noDebug,getMinStage };
