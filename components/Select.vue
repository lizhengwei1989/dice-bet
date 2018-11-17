<template>
    <div class="select" ref="select">
        <div class="info">
            <div class="resource" v-if="address.base58">
                <span>{{$t('select.t2')}}</span>
                <div class="bar">
                    <div>
                        <span>{{$t('Resource.BandWidth')}}</span><span>{{bindWidth}}</span>
                    </div>
                    <div>
                        <span>{{$t('Resource.Energy')}}</span><span>{{energy}}</span>
                    </div>
                </div>

            </div>

            <div class="min-stage">
                <span>{{$t('select.t1')}}</span>
                <div class="min">
                    <span class="process" :style="'width:'+Math.ceil((minStage.left/minStage.diceCount)*100)/100+'%'"></span>
                    <span>{{$t('select.number')}} {{minStage.stage}}/7 {{$t('select.stage')}}</span>
                    <span>{{minStage.left}}/{{minStage.diceCount}}</span>
                </div>

            </div>
        </div>
        <div class="tab focus" @click="tab(0)">
            <img :src="require('../assets/images/icons/icon-trx.png')" alt="">
            <span>TRX</span>
        </div>
        <div class="tab" @click="tab(1)">
            <img :src="require('../assets/images/icons/icon-bet.png')" alt="">
            <span>BET</span>
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
            async getResource(address){
                const resource = await window.tronWeb.trx.getAccountResources(address.base58);
                const energy = resource.EnergyUsed?(resource.EnergyLimit - resource.EnergyUsed):0;
                const bindWidth = await window.tronWeb.trx.getBandwidth(this.address.base58);
                this.$store.commit('SET_BAND_WIDTH',bindWidth);
                this.$store.commit('SET_ENERGY',energy);
            },
            watchResource(address){
                this.getResource(address);
                setInterval(async _=>{
                    this.getResource(address);
                },3000)
            },
            async tab(dbToken){
                if(dbToken == this.dbToken){
                    return false;
                }else{
                    //let balance;
                    //balance = dbToken == 0 ? await getBalance(this.address.hex):(await this.diceContractInstance.getBalanceOf(this.address.hex.replace('/^41/','0x')).call()).toString();
                    //this.$store.commit('SET_BALANCE',window.tronWeb.fromSun(balance));
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
        height: .8rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index:2;
        &>div.info{
            position: absolute;
            z-index:-1;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-size: .15rem;
            color: #F7D008;
            .bar{
                position: relative;
                width: 2.6rem;
                height: .2rem;
                background: #FFEAC7;
                border-radius: .06rem;
                display: flex;
                justify-content: space-between;
                padding:0 .08rem;
                color: #8F6300;
                font-size: .12rem;
                align-items: center;
                margin-left: 0.05rem;
                &>div{
                    flex: 1;
                    &:last-child{
                        padding-left: .1rem;
                        height: .1rem;
                        display: flex;
                        align-items: center;
                    }
                }
            }
            .min-stage{
                position: relative;
                display: flex;
                order:1;
                width: 4.8rem;
                height: .4rem;
                align-items: center;
                .min{
                    height: 0.28rem;
                    @extend .bar;
                    span.process{
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        border-radius:.06rem;
                        background-image: linear-gradient(-180deg, #F9D255 0%, #FFC049 100%);
                    }
                }
            }
            .resource{
                order:2;
                height: 100%;
                display: flex;
                left:0;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                .bar {
                    height: 0.28rem;
                }
            }
        }
        .tab{
            cursor: pointer;
            font-size: .15rem;
            width: 1.23rem;
            height: .38rem;
            background: #FFEAC7;
            border: .02rem solid #F7D008;
            box-shadow: 0 2px 4px 0 rgba(117,4,0,0.20);
            border-radius: .06rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #C53028;
            img{
                width: .16rem;
            }
            span{
                margin-left: .06rem;
            }
            &:last-child{
                margin-left: .4rem;
            }
        }
        .tab.focus{
            background-image: linear-gradient(-180deg, #F9D255 0%, #FFC049 100%);
            border: 3px solid #F7D008;
            box-shadow: 0 2px 4px 0 rgba(117,4,0,0.20);
        }
    }
    @media screen and (max-width:1100px){
        .select{
            height: .8rem;
            margin-bottom: 1.8rem;
            div.info{
                height: 1.8rem;
                padding:.2rem 0;
                top:100%;
                flex-direction: column;
                .bar{
                    height:.4rem;
                    div{
                        display: flex;
                        align-items: center;
                        &:last-child{
                            height: .2rem;
                        }
                    }
                }
                .min-stage{
                    .min{
                        height:.4rem;
                    }
                }
                & > div{
                    width: 100% !important;
                    flex: 1;
                    &>span{
                        width: 1.6rem;
                    }
                    &>div{
                        flex:1;
                        padding:0 .2rem !important;
                    }
                }
            }
            .tab{
                width: 1.65rem;
                height: .57rem;
                font-size: .26rem;
                img{
                    width: .24rem;
                }
                span{
                    margin-left: .1rem;
                }
            }
        }
    }
</style>