import { deepCopy } from "../static/js/Util";
// import { getUserInfo } from "~/api/user";
import Cookies from "js-cookie";

export const state = () => ({
  locales: ["en", "ch", "rus" ,"kor"],
  locale: "en",
  address: {},
  balance: 0,
  diceBalance: 0,
  limit: {
    0:{
        min: 10,
        max: 10000
    },
    1:{
        min: 10,
        max: 10000
    }
  },
  contractAddress: "",
  stake:10,
  contractInstance: null,
  diceContractInstance: null,
  dialogLogin: false,
  myBetsLength: 0,
  showLoading: true,
  random: 0,
  activityAddress: "",
  diceAddress:"",
  token: "",
  dapp: 2, //项目的区分
  dappId:1, //项目编号
  dbToken:0,  //代币token  0：trx  1：dice
  //定义trx  与其他代币的兑换比例 key为 dbToken的值
  bindWidth:0,
  energy:0,
  minStage:{
      rate:1, //dice 和 trx 兑换比例
      left:0, //剩余进阶 的 dice
      stage:1, //阶段数
      diceCount: 500000000
  }
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SET_ADDRESS(state, address) {
    state.address = address;
  },
  SET_CONTRACT_ADDRESS(state, address) {
    state.contractAddress = address;
  },
  SET_BALANCE(state, balance) {
    state.balance = balance;
  },
  SET_DICE_BALANCE(state, diceBalance) {
    state.diceBalance = diceBalance;
  },
  SET_CONTRACT_INSTANCE(state, obj) {
    state.contractInstance = { ...state.contractInstance, ...obj };
  },
  SET_DICE_CONTRACT_INSTANCE(state, obj) {
    state.diceContractInstance = { ...state.diceContractInstance, ...obj };
  },
  SET_DIALOG_LOGIN(state, dialogLogin) {
    state.dialogLogin = dialogLogin;
  },
  SET_MY_BETS_LENGTH(state, myBetsLength) {
    state.myBetsLength = myBetsLength;
  },
  SET_RANDOM(state, random) {
    state.random = random;
  },
  SET_SHOW_LOADING(state, showLoading) {
    state.showLoading = showLoading;
  },
  SET_ACTIVITY_ADDRESS(state, activityAddress) {
    state.activityAddress = activityAddress;
  },
  SET_DICE_ADDRESS(state, activityAddress) {
    state.diceAddress = activityAddress;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_STAKE(state, stake){
    state.stake = stake;
  },
  SET_DB_TOKEN(state, dbToken){
    state.dbToken = dbToken;
  },
  SET_BAND_WIDTH(state, bindWidth){
    state.bindWidth = bindWidth;
  },
  SET_ENERGY(state, energy){
    state.energy = energy;
  },
  SET_MIN_STAGE(state, obj) {
    state.minStage = { ...state.minStage, ...obj };
  }
};

// export const actions = {
//   getToken({ commit }) {
//     let user = {
//       name: "dappzy",
//       password: "#$tron@123"
//     };
//     getUserInfo(user).then(response => {
//       commit("SET_TOKEN", response.token);
//       Cookies.set("token", response.token);
//     });
//   }
// };
