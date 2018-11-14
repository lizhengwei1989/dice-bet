<template>
    <div class="select" ref="select">
        <div class="resource" v-if="address.base58">
            <div>
                {{$t('Resource.BandWidth')}}<span>{{bindWidth}}</span>
            </div>
            <div>
                {{$t('Resource.Energy')}}<span>{{energy}}</span>
            </div>
        </div>

        <div class="min-stage">
            当前为第{{minStage.stage}}阶段：
            <span class="process" :style="'width:'+Math.ceil((minStage.left/minStage.diceCount)*100)/100+'%'"></span>
            {{minStage.left}}/{{minStage.diceCount}}
        </div>
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
            return {}
        },
        watch:{
            address(n){
              this.watchResource(n);
            }
        },
        computed:{
            ...mapState(["dbToken","diceAddress","address","diceContractInstance","bindWidth","energy","minStage"])
        },
        async mounted(){

        },
        methods:{
            watchResource(address){
                setInterval(async _=>{
                    const resource = await window.tronWeb.trx.getAccountResources(address.base58);
                    const energy = resource.EnergyUsed?(resource.EnergyLimit - resource.EnergyUsed):0;
                    const bindWidth = await window.tronWeb.trx.getBandwidth(this.address.base58);
                    this.$store.commit('SET_BAND_WIDTH',bindWidth);
                    this.$store.commit('SET_ENERGY',energy);
                },3000)
            },
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
        position: relative;
        .resource{
            position: absolute;
            width: 2rem;
            height: 100%;
            display: flex;
            left:0;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            div{
                &:last-child{
                    margin-top: .1rem;
                }
            }
        }
        .min-stage{
            position: absolute;
            right:0;
            width: 4.8rem;
            height: .4rem;
            text-align: center;
            line-height:.4rem;
            border-radius:.4rem;
            border:.02rem solid aliceblue;
            span{
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                border-radius:.4rem 0 0 .4rem;
                background-color: #64e1f6;
            }

        }
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