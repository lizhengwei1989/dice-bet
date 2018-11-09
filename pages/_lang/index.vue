<template>
  <div class="container">
    <my-nav :languageGroup="languageGroup" />
    <Loading :isLoading="showLoading"/>
    <div class="main">
      <div class="cell">
        <Select />
      </div>
      <div class="cell">
        <div class="col col-1">
          <Rank :contractAddress="contractAddress" />
          <other-prize />
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
</template>

<script>
import { mapState } from "vuex";
import MyNav from "~/components/MyNav.vue";
import Select from "~/components/Select.vue";
import Rank from "~/components/Rank.vue";
import OtherPrize from "~/components/OtherPrize.vue";
import Play from "~/components/Play.vue";
import Result from "~/components/Result.vue";
import Loading from "~/components/loading.vue";
import { getBalance, noDebug, getWeeklyRank } from "~/static/js/Util";

let contractAddress = ""; //测试网
let activityAddress = "";
let diceAddress = "";
export default {
  components: {
    MyNav,
    Loading,
    Select,
    Rank,
    OtherPrize,
    Play,
    Result
  },
  async asyncData() {
    return {};
  },
  data() {
    return {
      tronWeb: null,
      rollBtnDisabled: false,
      lastRollNum: null,
      contractAddress: "",
      languageGroup: [
        { lng: "en", txt: "English",icon:'england' },
        { lng: "ch", txt: "Chinese",icon:'china' },
        { lng: "rus", txt: "Russian",icon:'russia' },
        { lng: "kor", txt: "Korean",icon:'korea' },
      ]
    };
  },
  created() {
    this.$store.dispatch("getToken");
  },
  computed: {
    ...mapState(["showLoading","address","contractInstance"])
  },
  async mounted() {
    noDebug();
    this.limit = this.$store.state.limit;
    let isLoadTronWeb = await this.isHasTronWeb();
    if (isLoadTronWeb) {
      await this.timeout(500);
      this.tronWeb = window.tronWeb;
      if (!this.checkLogin()) return;
      this.checkEnv();
      this.$store.commit("SET_ADDRESS", this.tronWeb.defaultAddress);
      const balance = await getBalance(this.address.hex);
      this.$store.commit("SET_BALANCE", this.tronWeb.fromSun(balance));
      const contractInstance = await this.tronWeb
        .contract()
        .at(contractAddress);
      const diceContractInstance = await this.tronWeb
          .contract()
          .at(diceAddress);
      this.$store.commit("SET_CONTRACT_INSTANCE", contractInstance);
      this.$store.commit("SET_DICE_CONTRACT_INSTANCE", diceContractInstance);
    } else {
      this.checkLogin();
    }
  },
  methods: {
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
      if (!window.tronWeb && !window.tronWeb.defaultAddress.base58) {
        this.$store.commit("SET_DIALOG_LOGIN", true);
        return false;
      } else {
        return true;
      }
    },
    checkEnv() {
      const server =  (typeof window.tronWeb.eventServer).toUpperCase() === 'OBJECT'?window.tronWeb.eventServer.host:window.tronWeb.eventServer;
      if (server === "https://api.shasta.trongrid.io") {
        contractAddress = "TT1Y6SAsYsoQfhk666vqcqAttsgMXdPqpQ";
        activityAddress = "TSYuKXyV6pPcxcMJfaqZzt4KUBtncPPPC5";
        diceAddress = "TQJRRMRpGAZEUEjqBZ6UJXvf2DhMYc52fs";
      } else {
        contractAddress = "TDVJZ53EowTzWnyknSeDqRGSJjoibExZWh";
        activityAddress = "";
        diceAddress="";
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
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #131258;
  color: #fff;
  a {
    color: #b3a6ff;
  }
  .main {
    width: 12.8rem;
    flex: 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > .cell {
      &:nth-child(2) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .col {
          width: 6.2rem;
          height: 6.6rem;
        }
        .col.col-1 {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .col.col-2 {
          background-image: linear-gradient(
              142deg,
              #28297c 0%,
              #21236e 50%,
              #191c60 100%
            ),
            linear-gradient(#242572, #242572);
          background-blend-mode: normal, normal;
          border-radius: 10px;
          border: solid 1px #64e1f5;
        }
      }
      &:nth-child(3) {
        margin-top: 0.35rem;
      }
    }
  }
}
@media screen and (max-width:1280px){
  .container{
    .main{
      padding:1rem .32rem 0;
      width: 100%;
      .cell{
        &:nth-child(2){
          flex-direction: column;
          .col{
            width: 100%;
          }
          .col-2{
            margin-top: .12rem;
          }
        }
      }
    }
  }
}
</style>
