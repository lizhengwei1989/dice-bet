<template>
    <div class="devcon-badge" @click="dialog = true">
        {{text}}
        <el-dialog
                :title="$t('Collect.Title')"
                :visible.sync="dialog"
                :modal-append-to-body='false'
                center class="collectDialog"
                top="10vh"
        >
            <div class="desc">
                {{$t('Collect.Desc')}}
            </div>
            <div class="rate">
                {{$t('Collect.Price')}}
            </div>
            <div class="process-wrap">
                <div class="process">
                    <div class="bar" :data-before="data|numString(' TRX')" :style="'width:'+(data/40000000)*100+'%'"></div>
                    <div class="line">
                        <div class="c"></div>
                        <div class="c"></div>
                        <div class="c"></div>
                        <div class="c"></div>
                        <div class="c"></div>
                        <div class="c"></div>
                    </div>
                </div>
            </div>
            <div class="r">{{$t("Collect.CollectAddress")}}TRVedyDR5EcpfmmUCmyGAHVQp7UoSQn8y3</div>
            <div class="r">
                {{$t('Collect.Warning')}}
            </div>
            <div class="r">
                <span>{{$t("Collect.Q")}}</span>
                <a href="https://twitter.com/DiceBet_TRON" target="_blank"><img :src="require('~/assets/images/new/2.png')" alt=""></a>
                <a href="https://t.me/dicebet" target="_blank"><img :src="require('~/assets/images/new/3.png')" alt=""></a>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="(e)=>{ e.stopPropagation();this.dialog = false}">{{$t('Confirm')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['text'],
        name: "Notice",
        data(){
            return {
                dialog:false,
                data:"23720074"
            }
        }
    }
</script>

<style lang="scss">
    .devcon-badge {
        cursor: pointer;
        width: 100%;
        height: 45px;
        line-height:45px;
        z-index: 100;
        background: linear-gradient(90deg,#fca09a,#fcccd3,#ffcc9d,#98ddad,#81d7ec,#a0aaed);
        background-size: 200%;
        text-align: center;
        -webkit-animation: AnimationName 5s ease infinite;
        -moz-animation: GradientAnimation 5s ease infinite;
        animation: GradientAnimation 5s ease infinite;
        font-size: 16px;
        .collectDialog{
            .el-dialog{
                width: 30%;
                display: flex;
                flex-direction: column;
                align-items: center;
                .desc{
                    font-size: 18px;
                    font-weight: bold;
                }
                .rate{
                    font-size: 22px;
                    color: #c53028;
                    height: .8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .process-wrap{
                    background:#ffe7c7;
                    border:1px solid #eccea8;
                    border-radius:23px;
                    width:500px;
                    height:44px;
                    padding:0 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: .6rem;
                    position: relative;
                    &:before{
                        position: absolute;
                        left: 0px;
                        top: 100%;
                        height: 20px;
                        content:'0 TRX'
                    }
                    &:after{
                        position: absolute;
                        right: 0px;
                        top: 100%;
                        height: 20px;
                        content:'40,000,000 TRX'
                    }
                    .process{
                        background:#ffe7c7;
                        box-shadow:inset 0 1px 6px 0 rgba(0,0,0,0.30);
                        border-radius:12px;
                        width:100%;
                        height:24px;
                        display: flex;
                        justify-content: flex-start;
                        position: relative;
                        .bar{
                            position: absolute;
                            background-image:linear-gradient(-180deg, #c61b1b 3%, #9b1c16 100%);
                            border-radius:12px;
                            width:215px;
                            height:24px;
                            z-index:2;
                            &:before{
                                content:attr(data-before);
                                position: absolute;
                                width: 178px;
                                height: 44px;
                                background-image: url("../assets/images/new/bubble.png");
                                right: -120px;
                                top: -60px;
                                font-size:14px;
                                color:#310000;
                                line-height: 40px;
                                text-align: center;
                            }
                        }
                        .line{
                            z-index: 1;
                            display: flex;
                            width: 100%;
                            height: 12px;
                            position: absolute;
                            top:0;
                            justify-content: space-around;
                            .c{
                                width: 1px;
                                height: 100%;
                                background-color: #e6d4be;
                            }
                        }
                    }
                }
                .r{
                    font-size:18px;
                    color:#310000;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    a{
                        margin-left: 20px;
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
    @keyframes GradientAnimation {
        0%,100% {
            background-position: 0 50%
        }

        50% {
            background-position: 100% 50%
        }
    }
    @media screen and (max-width: 1100px) {
        .devcon-badge{
            .collectDialog{
                .el-dialog{
                    width: 320px;
                    .r{
                        font-size: 12px;
                        line-height:20px;
                    }
                }
                .el-dialog__body{
                    width: 100%;
                    padding:0 20px;
                    .desc{
                        font-size: 14px;
                        line-height: 20px;
                    }
                    .rate{
                        margin-top: 10px;
                        font-size: 14px;
                    }
                    .process-wrap{
                        width: 100%;
                        margin: 60px 0 40px 0;
                    }
                }
            }
        }
    }
</style>