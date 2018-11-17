<template>
    <div class="other-prize" v-if="dbToken==0">
            <div class="r1">
                {{$t('OtherPrize.Txt1')}}<span>{{stake * (1/minStage.rate)}} BET</span>
            </div>
            <div class="r2">
                {{$t('OtherPrize.Txt2')}} <span>{{minStage.rate==1?minStage.rate:'1/'+minStage.rate}}x </span>BET
            </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";
    export default {
        name: "OtherPrize",
        computed: {
            ...mapState(["stake","dbToken","minStage"])
        },
    }
</script>

<style scoped lang="scss">
    .other-prize{
        font-size: .14rem;
        flex:1;
        width: 4.58rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color:#35781B;
        span{
            color: #FF7D00;
        }
        .r1{
            font-size: .18rem;
            span{
                font-size: .2rem;
            }
        }
        .r2{
            margin-top: .1rem;
            font-size: .14rem;
        }
    }
    @media screen and (max-width:1100px){
        .other-prize{
            width: 100%;
            font-size: .24rem;
            .r1,.r2{
                font-size: .24rem;
            }
        }
    }
</style>