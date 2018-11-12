import xhr from 'axios'

//计算赔率（与区块链算法保持一致）
const getOdds = point => {
    let r = 98; //返现率
    if(point==1){
        return r;
    }
    return  r/(point-1);
}
const getPoint = (random)=>{
  let r = 1;
  if(random>0 && random< 17){
      r = 1;
  }else if(random>=17 && random<33){
      r = 2;
  }else if(random>=33 && random<50){
      r = 3;
  }else if(random>=50 && random<67){
      r = 4;
  }else if(random>=67 && random<84){
      r = 5;
  }else{
      r = 6;
  }
  return r;
}


const formatTime = (ns) => {
  const d = new Date(ns);
  const  dformat = [ d.getHours(), d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes(), d.getSeconds()<10?'0'+d.getSeconds():d.getSeconds() ].join(':');
  return dformat;
}

const getBalance = async address=>{
    let tronWeb = window.tronWeb;
    const server = (typeof tronWeb.eventServer).toUpperCase() === 'OBJECT'? tronWeb.eventServer.host : tronWeb.eventServer;
    let {data} = await xhr.post(`${server}/wallet/getaccount`,{
        address : address
    })
    if(Object.keys(data).length==0){
        return 0;
    }
    return data.balance;
}

const getRanks = async (address,time) => {
    let {data} = await xhr.get(`http://testwlcyapi.tronscan.org/api/contract/rank/${address}/day?time=${time}`)
    return data;
}



function noDebug(address){
    var threshold=160;
    if(window){
        setInterval(function(){
            if(window.outerWidth-window.innerWidth>threshold || window.outerHeight-window.innerHeight>threshold){
                //throw new Error('error');
            }
        })
    }
}

export { getOdds,formatTime,getPoint,getBalance,getRanks,noDebug}
