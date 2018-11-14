<template>
    <div class="other-prize" v-if="dbToken==0">
        <div class="r1">
            {{$t('OtherPrize.Txt1')}}{{stake * (1/minStage.rate)}} DICE
        </div>
        <div class="r2">
            {{$t('OtherPrize.Txt2')}} {{minStage.rate==1?minStage.rate:'1/'+minStage.rate}}x DICE
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
        width: 5.1rem;
        height: .98rem;
        background-color: #ffd83e;
        box-shadow: inset -0.3px 4px 1.8px 6.2px rgba(103, 56, 28, 0.2);
        border-radius: .5rem .5rem 0 0;
        display: flex;
        flex-direction: column;
        margin:0.8rem auto 0;
        padding:0 .3rem 0 .26rem;
        align-items: center;
        justify-content: center;

        .r1{
            font-size: .22rem;
            color: #eb2c21;
        }
        .r2{
            font-size: .16rem;
            color: #eb2c21;
        }
    }
    @media screen and (max-width:1280px){
        .other-prize{
            width: 100%;
        }
    }
</style>