import { deepCopy } from "../static/js/Util";
import { getUserInfo } from "~/api/user";
import Cookies from "js-cookie";

export const state = () => ({
  locales: ["en", "ch", "rus" ,"kor"],
  locale: "en",
  address: {},
  balance: 0,
  limit: 10000,
  contractAddress: "",
  contractInstance: null,
  dialogLogin: false,
  myBetsLength: 0,
  showLoading: true,
  random: 0,
  activityAddress: "",
  token: "",
  dapp: 2 //项目的区分
}); //VIP，邀请，幸运抽奖活动合约

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
  SET_CONTRACT_INSTANCE(state, obj) {
    state.contractInstance = { ...state.contractInstance, ...obj };
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
  SET_ACTIVITYADDRESS(state, activityAddress) {
    state.activityAddress = activityAddress;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  }
};

export const actions = {
  getToken({ commit }) {
    let user = {
      name: "dappzy",
      password: "#$tron@123"
    };
    getUserInfo(user).then(response => {
      commit("SET_TOKEN", response.token);
      Cookies.set("token", response.token);
    });
  }
};
