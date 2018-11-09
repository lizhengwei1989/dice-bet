<template>
    <div class="select" ref="select">
        <div class="tab focus" @click="tab(0)">
            <img :src="require('../assets/images/logo-trx.png')" alt="">
            <span>TRX</span>
        </div>
        <div class="tab" @click="tab(1)">
            <img :src="require('../assets/images/logo-dice.png')" alt="">
            <span>DICE</span>
        </div>
    </div>
</template>
<script>
    import { mapState } from "vuex";
    import {getBalance} from "~/static/js/Util"
    export default {
        name: "Select",
        data(){
            return {

            }
        },
        computed:{
            ...mapState(["dbToken","diceAddress","address","diceContractInstance"])
        },
        methods:{
            async tab(dbToken){
                if(dbToken == this.dbToken){
                    return false;
                }else{
                    let balance;
                    balance = dbToken == 0 ? await getBalance(this.address.hex):(await this.diceContractInstance.getBalanceOf(this.address.hex.replace('/^41/','0x')).call()).toString();
                    this.$store.commit('SET_BALANCE',window.tronWeb.fromSun(balance));
                    const tabs = this.$refs.select.getElementsByClassName('tab');
                    for(let i=0;i<tabs.length;i++){
                        tabs[i].classList.remove('focus');
                    }
                    tabs[dbToken].classList.add('focus');
                    this.$store.commit('SET_DB_TOKEN',dbToken);


                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .select{
        height: 1.2rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .tab{
            cursor: pointer;
            font-size: .15rem;
            width: 1.23rem;
            height: .38rem;
            background-color: #363995;
            border-radius: .19rem;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width: .16rem;
            }
            span{
                margin-left: .06rem;
            }
            &:last-child{
                margin-left: .3rem;
            }
        }
        .tab.focus{
            background-image: linear-gradient(142deg,
                    #2babf5 0%,
                    #4786f9 50%,
                    #6260fd 100%),
            linear-gradient(
                            #de5cff,
                            #de5cff);
            background-blend-mode: normal,
            normal;
            border-radius: 19px;
        }
    }
    @media screen and (max-width:1280px){
        .select{

        }
    }
</style>