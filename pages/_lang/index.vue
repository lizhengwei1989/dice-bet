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
import {mapState} from 'vuex';
import MyNav from '~/components/MyNav.vue'
import Select from '~/components/Select.vue'
import Rank from '~/components/Rank.vue'
import OtherPrize from '~/components/OtherPrize.vue'
import Play from '~/components/Play.vue'
import Result from '~/components/Result.vue'
import Loading from'~/components/loading.vue'
import { getBalance ,noDebug, getWeeklyRank} from '~/assets/js/common'



let contractAddress = ''; //测试网
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
  async asyncData(){
    return {
    }
  },
  data(){
    return {
      tronWeb:null,
      rollBtnDisabled:false,
      lastRollNum:null,
      contractInstance:null,
      contractAddress:'',
      languageGroup:[{lng:"en",txt:"English"},{lng:"ch",txt:"Chinese"}],
    }
  },
  computed:{
      ...mapState(['showLoading'])
  },
  async mounted(){
      noDebug();
      this.limit = this.$store.state.limit;
      let isLoadTronWeb = await this.isHasTronWeb();
      if(isLoadTronWeb){
        await this.timeout(500);
        this.tronWeb = window.tronWeb;
        if(!this.checkLogin())return;
        this.checkEnv();
        this.$store.commit('SET_ADDRESS',this.tronWeb.defaultAddress);
        const balance = await getBalance(this.$store.state.address.hex);
        this.$store.commit('SET_BALANCE',this.tronWeb.fromSun(balance));
        const contractInstance = await this.tronWeb.contract().at(contractAddress);
        this.contractInstance = contractInstance;
        this.$store.commit('SET_CONTRACT_INSTANCE',contractInstance);
        //const myBets = localStorage.my ? JSON.parse(localStorage.my): [];
        //this.$store.commit('SET_MY_BETS',myBets);
     }else{
        this.checkLogin();
     }
  },
  methods:{
      isHasTronWeb(){
        this.isLoading = true;
        let isTronWebLoaded = false;
        return new Promise((resolve)=>{
            let oTimer = setInterval(()=>{
              if(window.tronWeb){
                this.$store.commit('SET_SHOW_LOADING',false)
                isTronWebLoaded = true;
                clearInterval(oTimer);
                resolve(isTronWebLoaded)
              }else{
                setTimeout(()=>{
                    this.$store.commit('SET_SHOW_LOADING',false)
                    isTronWebLoaded = false;
                    resolve(isTronWebLoaded)
                    clearInterval(oTimer);
                },3000)
              }
            },500)
        })
    },
    checkLogin(){
      if(!window.tronWeb && !window.tronWeb.defaultAddress.base58) {
        this.$store.commit('SET_DIALOG_LOGIN',true);
        return false;
      }else{
        return true;
      }
    },
    checkEnv(){
      if(window.tronWeb.eventServer=='https://api.shasta.trongrid.io'){
        contractAddress = 'TWhEuRncFxDfBxQcSyf96aEqWvYUduUTKP';
      }else{
        contractAddress = 'TDVJZ53EowTzWnyknSeDqRGSJjoibExZWh';
      }
      this.$store.commit('SET_CONTRACT_ADDRESS',contractAddress);
    },
    timeout(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color:#131258;
  color:#fff;
  a{color:#B3A6FF;}
  .main{
    width: 12.8rem;
    flex:1;
    margin:auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &>.cell{
      &:nth-child(2){
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .col{
          width: 6.2rem;
          height: 6.6rem;
        }
        .col.col-1{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .col.col-2{
          background-image: linear-gradient(142deg,
                  #28297c 0%,
                  #21236e 50%,
                  #191c60 100%),
          linear-gradient(
                          #242572,
                          #242572);
          background-blend-mode: normal,
          normal;
          border-radius: 10px;
          border: solid 1px #64e1f5;
        }
      }
      &:nth-child(3){
        margin-top: .35rem;
      }
    }
  }
}
@media screen and (max-width:1280px){
  .container{
    .main{
      padding:0 .32rem;
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
