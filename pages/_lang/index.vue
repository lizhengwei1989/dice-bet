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
        </div>
        <div class="col col-2">
          <Play />
        </div>
      </div>
      <div class="cell">
        <Result :contractAddress="contractAddress" />
      </div>
      <div class="logo"></div>
    </div>
    <!--<Footer />-->
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
import { getBalance, noDebug, getWeeklyRank,getMinStage } from "~/static/js/Util";
import { addInviteUser } from '~/api/user'

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
      tronWeb: null,
      rollBtnDisabled: false,
      lastRollNum: null,
      languageGroup: [
        { lng: "en", txt: "English",icon:'england' },
        { lng: "ch", txt: "Chinese",icon:'china' },
        { lng: "rus", txt: "Russian",icon:'russia' },
        { lng: "kor", txt: "Korean",icon:'korea' },
      ]
    };
  },
  created() {
    //this.$store.dispatch("getToken");
  },
  computed: {
    ...mapState(["showLoading","address","contractInstance","contractAddress"])
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
      const diceBalance = (await diceContractInstance.getBalanceOf(this.address.hex.replace('/^41/','0x')).call()).toString();
      this.$store.commit("SET_DICE_BALANCE",window.tronWeb.fromSun(diceBalance));
      this.$store.commit("SET_CONTRACT_INSTANCE", contractInstance);
      this.$store.commit("SET_DICE_CONTRACT_INSTANCE", diceContractInstance);
      this.watchMinStage();
      this.addInviteUser();
    } else {
      this.checkLogin();
    }
  },
  methods: {
    async watchMinStage(){
      const payInTotal = await this.contractInstance.payInTotal().call();
      const o = getMinStage(payInTotal.toString());
      this.$store.commit('SET_MIN_STAGE',o);
      setInterval(async _=>{
          const payInTotal = await this.contractInstance.payInTotal().call();
          const o = getMinStage(payInTotal.toString());
          this.$store.commit('SET_MIN_STAGE',o);
      },5000)
    },
    // 添加邀请人
    addInviteUser() {
      let queryArr = /\?from=(\S+)/.exec(location.search)
      if (queryArr) {
        addInviteUser({
          dappId: 1,
          contractAddress: this.contractAddress,
          inviterAddress: queryArr[1],
          inviteeAddress: this.address.base58
        }).then(res => {
          console.log(res)
        })
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
        contractAddress = "TSdKwnD8dhiFuoPsVsVov4FwvK3sL3Fsps";
        activityAddress = "TXd32KL68KrNFtkULgY9Ww5A2xVdhK7rhj";
        //diceAddress = "THrENu48be4VuU1f6688fSbazQwRHkDKKQ";
        diceAddress = "TELzUo7wKhn6SWW9uELzBMrAbWaWh9bYqM";
      } else {
        contractAddress = "TPUZherbdW4CQi9t4RbzvJmsoSzgTgBQRQ";
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
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: -webkit-linear-gradient( top,#530400,#8a1011);
  color: #fff;
  &:before{
     position: absolute;
     width: 100%;
     height: 100%;
     background-image: url("../../assets/images/new/bg.png");
     content:'';
     background-position:center 1rem;
     background-repeat:no-repeat;
     background-size:auto 84%;
   }
  a {
    color: #b3a6ff;
  }
  .main {
    padding-top:1.2rem;
    position: relative;
    z-index:1;
    width: 11rem;
    flex: 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .logo{
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      top:-.7rem;
      left: 0;
      background-image: url("../../assets/images/new/tiaoli.png");
      background-position: center top;
      background-repeat: no-repeat;
      &:before{
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url("../../assets/images/new/decorate.png");
        background-position:  top;
        background-repeat: no-repeat;
      }
      &:after{
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url("../../assets/images/new/logo.png");
        background-position: center top;
        background-repeat: no-repeat;
      }
    }

    & > .cell {
      &:first-child{
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
          background-image: linear-gradient(-180deg, #C71121 0%, #D81734 100%);
          box-shadow: 0 .04rem .24rem 0 rgba(52,7,7,0.50);
          border-radius: .1rem;
        }
        .col.col-1 {
          flex-direction: column;

        }
        .col.col-2 {
          flex-direction: column;
          border-radius: .1rem;
        }
      }
      &:nth-child(3) {
        margin-top: 0.35rem;
      }
    }
  }
}
@media screen and (max-width:1100px){
  .container{
    .main{
      padding:1.2rem .32rem 0;
      width: 100%;
      z-index:1001;
      .logo{
        top:-1rem;
        background-position: center -1rem;
        &:before{
          background-size:100% auto;
          background-position: center 1rem;
        }
        &:after{
          background-size:30% auto;
          background-position: center top;
        }
      }
      .cell{
        &:nth-child(2){
          flex-direction: column;
          .col{
            width: 100%;
            &:last-child{
              margin-top: .35rem;
            }
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
