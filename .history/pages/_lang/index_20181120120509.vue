<template>
  <div class="total-wrap" style="position: relative;overflow-x:hidden">
    <marquee scrollamount="3" class="marquee-box">
      <span v-if="v.output && v.output > 1000" v-for="(v, i) in allBetList" :key="i">
        <span>🚀 {{$t('marquee.congratulation')}} 🚀 </span>
        <!-- 地址 -->
        <span>{{v.player | hiddenAddress}}</span>
        <span>{{$t('marquee.win')}}</span>
        <!-- 金额 -->
        <span class="t-shadow">{{v.output}} TRX,</span>
        <span>{{$t('marquee.odds')}}</span>
        <span class="t-shadow">x{{(v.output/v.input).toFixed(4)}}</span>!
      </span>
    </marquee>
    <div class="container">
      <my-nav :languageGroup="languageGroup" />
      <Loading :isLoading="showLoading"/>
      <div class="main">
        <div class="">
          <!-- <Select /> -->
        </div>
        <div class="cell">
          <div class="col col-1">
            <Rank :contractAddress="contractAddress" />
          </div>
          <div class="col col-2">
            <Play />
          </div>
        </div>
        <div class="cell">
          <Result :contractAddress="contractAddress" />
        </div>

      </div>
      <!--<Footer />-->
    </div>
  </div>

</template>

<script>
import { mapState } from "vuex";
import MyNav from "~/components/MyNav.vue";
import Select from "~/components/Select.vue";
import Rank from "~/components/Rank.vue";

import Play from "~/components/Play.vue";
import Result from "~/components/Result.vue";
import Loading from "~/components/loading.vue";
import {
  getBalance,
  noDebug,
  getWeeklyRank,
  getMinStage,
  isMobile
} from "~/static/js/Util";
import { addInviteUser } from "~/api/user";
import { getVipInfo } from "~/api/vip";

let contractAddress = ""; //测试网
let activityAddress = "";
let diceAddress = "";
export default {
  components: {
    MyNav,
    Loading,
    Select,
    Rank,
    Play,
    Result
  },
  async asyncData() {
    return {};
  },
  data() {
    return {
      rollBtnDisabled: false,
      lastRollNum: null,
      languageGroup: [
        { lng: "en", txt: "English", icon: "england" },
        { lng: "ch", txt: "Chinese", icon: "china" }
        // { lng: "rus", txt: "Russian",icon:'russia' },
        // { lng: "kor", txt: "Korean",icon:'korea' },
      ]
    };
  },
  created() {
    //this.$store.dispatch("getToken");
  },
  computed: {
    ...mapState([
      "showLoading",
      "address",
      "contractInstance",
      "contractAddress",
      "allBetList"
    ])
  },
  async mounted() {
    noDebug();
    this.limit = this.$store.state.limit;
    if (isMobile() && window.iTron) {
      require("~/static/js/mTronWeb");
    }
    let isLoadTronWeb = await this.isHasTronWeb();
    if (isLoadTronWeb) {
      await this.timeout(500);
      //if (!this.checkLogin()) return;
      this.checkEnv();
      if (window.tronWeb) {
        if (window.tronWeb.defaultAddress) {
          this.$store.commit("SET_ADDRESS", window.tronWeb.defaultAddress);
        }
        if (this.address.base58) {
          const vip = await getVipInfo(this.address.base58);
          this.$store.commit("SET_VIP_LEVEL", vip.level);
          const balance = await getBalance(this.address.hex);
          this.$store.commit("SET_BALANCE", window.tronWeb.fromSun(balance));
        }
        const contractInstance = await window.tronWeb
          .contract()
          .at(contractAddress);
        const diceContractInstance = await window.tronWeb
          .contract()
          .at(diceAddress);
        const diceBalance = this.address.hex
          ? (await diceContractInstance
              .getBalanceOf(this.address.hex.replace("/^41/", "0x"))
              .call()).toString()
          : 0;
        this.$store.commit(
          "SET_DICE_BALANCE",
          window.tronWeb.fromSun(diceBalance)
        );
        this.$store.commit("SET_CONTRACT_INSTANCE", contractInstance);
        this.$store.commit("SET_DICE_CONTRACT_INSTANCE", diceContractInstance);
        this.watchMinStage();
        this.addInviteUser();
      }
    } else {
      //this.checkLogin();
    }
  },
  methods: {
    async watchMinStage() {
      const payInTotal = await this.contractInstance.payInTotal().call();
      const o = getMinStage(payInTotal.toString());
      this.$store.commit("SET_MIN_STAGE", o);
      setInterval(async _ => {
        const payInTotal = await this.contractInstance.payInTotal().call();
        const o = getMinStage(payInTotal.toString());
        this.$store.commit("SET_MIN_STAGE", o);
      }, 5000);
    },
    // 添加邀请人
    addInviteUser() {
      let queryArr = /\?from=(\S+)/.exec(location.search);
      if (queryArr) {
        addInviteUser({
          dappId: 1,
          contractAddress: this.contractAddress,
          inviterAddress: queryArr[1],
          inviteeAddress: this.address.base58
        }).then(res => {
          console.log(res);
        });
      }
    },
    isHasTronWeb() {
      this.isLoading = true;
      let isTronWebLoaded = false;
      return new Promise(resolve => {
        let oTimer = setInterval(() => {
          if (window.tronWeb) {
            this.$store.commit("SET_SHOW_LOADING", false);
            isTronWebLoaded = true;
            clearInterval(oTimer);
            resolve(isTronWebLoaded);
          } else {
            setTimeout(() => {
              this.$store.commit("SET_SHOW_LOADING", false);
              isTronWebLoaded = true;
              resolve(isTronWebLoaded);
              clearInterval(oTimer);
            }, 3000);
          }
        }, 1200);
      });
    },
    checkLogin() {
      if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
        this.$store.commit("SET_DIALOG_LOGIN", true);
        return false;
      } else {
        return true;
      }
    },
    checkEnv() {
      const server = window.tronWeb
        ? (typeof window.tronWeb.eventServer).toUpperCase() === "OBJECT"
          ? window.tronWeb.eventServer.host
          : window.tronWeb.eventServer
        : "https://api.shasta.trongrid.io";
      if (server === "https://api.shasta.trongrid.io") {
        contractAddress = "TZGe3dYuVoTfsGYiFVbCSJWwFeUE2LVqKp";
        activityAddress = "TAxMGX9RvKGdZ4w8YBbeLhAhaL75qGBz2n";
        diceAddress = "THZP41aUockHon7n8vmSjcr55z1q9Ye7Gx";
      } else {
        contractAddress = "TPUZherbdW4CQi9t4RbzvJmsoSzgTgBQRQ";
        activityAddress = "";
        diceAddress = "";
      }
      this.$store.commit("SET_CONTRACT_ADDRESS", contractAddress);
      this.$store.commit("SET_ACTIVITY_ADDRESS", activityAddress);
      this.$store.commit("SET_DICE_ADDRESS", diceAddress);
    },
    timeout(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
  }
};
</script>

<style lang="scss">
.total-wrap {
  background-image: url("../../assets/images/new/bg.png");
  background-position: center top;
  background-repeat: no-repeat;
  background-color: #7e0909;

  &:before {
    content: "";
    position: absolute;
    background-image: url("../../assets/images/new/logo.png");
    background-repeat: no-repeat;
    background-size: 100%;
    left: 50%;
    top: 0;
    margin-left: -0.71rem;
    width: 1.42rem;
    height: 1.18rem;
  }
}
.container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #af1a1a;
  a {
    color: #bc0e05;
  }
  .main {
    padding-top: 1.3rem;
    position: relative;
    z-index: 1;
    width: 11rem;
    flex: 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > .cell {
      &:first-child {
      }
      &:nth-child(2) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .col {
          width: 5.3rem;
          height: 5.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url("../../assets/images/new/cell-bg.png");
          background-size: 100% 100%;
          box-shadow: 0 0.04rem 0.24rem 0 rgba(52, 7, 7, 0.5);
          border-radius: 0.1rem;
        }
        .col.col-1 {
          flex-direction: column;
        }
        .col.col-2 {
          flex-direction: column;
          border-radius: 0.1rem;
        }
      }
      &:nth-child(3) {
        background-image: url("../../assets/images/new/result-bg.png");
        background-size: 100% 100%;
        margin-top: 0.35rem;
      }
    }
  }
}
.marquee-box {
  position: absolute;
  width: 80%;
  height: 50px;
  line-height: 50px;
  color: #ffde00;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: url("../../assets/images/bg_adspace.png") no-repeat center;
  z-index: 100;
  .t-shadow {
    text-shadow: 0 0 5px hsla(0, 0%, 100%, 0.8);
  }
}
@media screen and (max-width: 1100px) {
  .logo {
    .border {
      background-position: center 0.8rem;
      background-size: auto;
    }
    &:after {
      background-size: 56% auto;
    }
    &:before {
      background-position: left 1.5rem;
      background-size: 120% auto;
    }
  }
  .container {
    overflow-x: hidden;
    .main {
      padding: 2rem 0.32rem 0;
      width: 100%;
      z-index: 1001;
      .cell {
        &:nth-child(2) {
          flex-direction: column;
          .col {
            width: 100%;
          }
          .col-1 {
            height: 5.8rem;
            padding: 0.2rem 0;
            order: 2;
            margin-top: 0.35rem;
          }
          .col-2 {
            height: 6rem;
            padding: 0.2rem 0;
            order: 1;
            margin-top: 0;
          }
        }
      }
    }
  }

  .marquee-box {
    width: 100%;
    height: 40px;
    line-height: 40px;
    top: 9%;
    font-size: 16px;
  }
}
</style>
