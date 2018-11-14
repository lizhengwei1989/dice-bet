<template>
    <div class="other-prize" v-if="dbToken==0">
        <div class="desc">
            <div class="r1">
                {{$t('OtherPrize.Txt1')}}{{stake * (1/minStage.rate)}} DICE
            </div>
            <div class="r2">
                {{$t('OtherPrize.Txt2')}} {{minStage.rate==1?minStage.rate:'1/'+minStage.rate}}x DICE
            </div>
        </div>
        <img :src="require('../assets/images/other-prize.png')" alt="" />
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
        width: 6.2rem;
        height: .8rem;
        margin-top: .1rem;
        background-image: linear-gradient(91deg,
                #5b60d6 0%,
                #5b37b6 100%),
        linear-gradient(
                        #a8abe4,
                        #a8abe4);
        background-blend-mode: normal,
        normal;
        border-radius: .1rem;
        display: flex;
        flex-direction: row;
        padding:0 .3rem 0 .26rem;
        justify-content: space-between;
        align-items: center;
        .desc{
            flex:1;
            display: flex;
            flex-direction: column;
            .r1{
                font-size: .18rem;
            }
            .r2{
                font-size: .14rem;
                color: #64e1f6;
            }
        }
        img{
            width: .53rem;
            height: .55rem;
        }
    }
    @media screen and (max-width:1280px){
        .other-prize{
            width: 100%;
        }
    }
</style>