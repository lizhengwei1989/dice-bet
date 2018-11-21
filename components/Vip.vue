<template>

  <el-dialog
    :modal-append-to-body='false'
    :visible.sync="vipDialog.visible"
     center class="vipDialog">
    <div class="close">
      <i class="iconfont icon-close" @click="vipDialog.visible = false"></i>
    </div>
    <!-- <p class="center">{{$t('vip.desc')}}</p> -->
    <div class="golden"></div>
    <div class="el-dialog__body-wrap">
      <div class="card">
        <div class="level">VIP {{vipInfo.level}}</div>
        <div class="prize">
          <!--{{$t("vip.Reward")}}：{{prize/1000000}} TRX-->
          {{$t('vip.Tip')}}
        </div>
        <div class="level-process">
          <div class="process">
            <span :style="'width:'+vipInfo.expBar+'%'"></span>
          </div>
          <div class="desc">
            <span>vip {{vipInfo.level}}</span>
            <span>{{emainingText}} {{vipInfo.level+1}}</span>
          </div>
        </div>
        <button @click="extract" disabled="disabled" :loading="extractLoading">{{$t('extract')}}</button>
      </div>
      <el-row class="table">
        <template>
          <el-table
                  :data="tableData"
                  style="width: 90%;margin:auto;overflow:hidden"
                  size="mini"
                  v-loading="tableLoading"
                  element-loading-background="transparent"
                  class="table-content"
          >
            <el-table-column prop="grade" :label="$t('vip.table.level')" width="60">
              <template slot-scope="scope">

                <img class="vip-img" :src="require('../assets/images/new/vip/vip'+scope.row.level+'.png')">
              </template>

            </el-table-column>
            <el-table-column prop="allBets" :label="$t('vip.table.amount')" width="150" >
              <template slot-scope="scope">
                {{scope.row.totalAmount/1000000}} TRX
              </template>
            </el-table-column>
            <el-table-column prop="prize" :label="$t('vip.table.prize')">
              <template slot-scope="scope">
                {{scope.row.returnRatio*0.01}} %
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>
      <!--<el-row style="margin-top:0.2rem;color:#fff">-->
        <!--{{$t('vip.copyRight')}}-->
      <!--</el-row>-->
    </div>
  </el-dialog>
</template>
<script>
import $t from "vue-i18n";
import { getVipList, getVipInfo } from "~/api/vip";

export default {
  props: {
    vipDialog: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tableData: [],
      extractLoading: false,
      activityAddress: "", //合约地址
      contractInstance: {}, //合约对象
      prize: 0,
      userAddress: "",
      vipInfo: {
        level: 0,
        gapAmount: 0
      },
      tronWeb: null,
      tableLoading: true
    };
  },
  computed: {
    emainingValue() {
      // let newEmaining = this.tableData[this.vipDialog.data.grade+1].allBets
      // return newEmaining
    },
    emainingText() {
      let text = this.$t("vip.remainingBet", {
        trx: this.vipInfo.gapAmount / 1000000
      });
      return text;
    }
  },

  async created() {
    this.getTableData();
    this.userAddress = this.$store.state.address.base58 || "";
    await this.getVipInfo();
  },
  async mounted() {
    this.activityAddress = this.$store.state.activityAddress;

    this.tronWeb = await window.tronWeb;
    this.contractInstance = await tronWeb.contract().at(this.activityAddress);
    // this.contractInstance.setVipBalance('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc',200).send()
    await this.getBalance();
  },
  watch: {
    "vipDialog.data": {
      deep: true,
      handler: val => {}
    }
  },
  methods: {
    async getTableData() {
      let tableData = await getVipList();
      tableData = tableData.filter((v,i)=>{
          if(v.level!=0){
              return v;
          }
      })
      this.tableData = tableData;
      this.tableLoading = false;
    },
    async getVipInfo() {
      let vip = await getVipInfo(this.userAddress);
      this.vipInfo = vip;
    },
    async getBalance() {
      let banlance = await this.contractInstance.getVipBalance().call();

      banlance = parseInt(banlance, 10);
      this.prize = banlance;
    },
    async extract() {
      if (this.prize == 0) {
        return;
      }

      this.extractLoading = true;
      const txId = await this.contractInstance.withDraw(0).send();
      let checkBalance = setInterval(async () => {
        const res = await window.tronWeb.getEventByTransactionID(txId);
        if (res.length > 0) {
          res.every(v => {
            if (v.name === "VipWithDraw") {
              clearInterval(checkBalance);
              this.extractLoading = false;
              this.prize = 0;
            }
          });
        }
      }, 2000);
    }
  }
};
</script>
<style lang="scss">
.vipDialog {
  .vip-img {
    width: auto;
    height: 0.26rem;
  }

  .el-dialog {
    position: relative;
    z-index:0;
    width: 5.3rem;
    height:8.4rem;
    background-color: #FFFADE;
    box-shadow: 0 4px 24px 0 rgba(52,7,7,0.50);
    border-radius: .04rem;
    border:none;
  }
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body {
    padding:0;
    position: relative;
    .golden{
      width: .78rem;
      height: 1rem;
      left: 50%;
      top:-.1rem;
      z-index:1;
      margin-left:-.39rem;
      position: absolute;
      background-image:url("../assets/images/new/vip/golden.png");
      background-repeat: no-repeat;
      background-size:100%;
    }
    .el-dialog__body-wrap{
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: relative;
      &:before{
        left: -2.35rem;
        top: -7rem;
        content:'';
        position: absolute;
        width: 10rem;
        height: 10rem;
        border-radius:10rem;
        background-image: linear-gradient(120deg, #FFDF97 24%, #D29229 100%);
        //background-position:-5rem -5rem;
      }
      &:after{
        left: 0;
        top: 0;
        width: 5.3rem;
        height:3rem;
        content:'';
        position: absolute;
        background-image: url('../assets/images/new/vip/vip-dot.png');
        background-repeat: no-repeat;
        background-position: center .5rem;
        background-size:80% auto;
      }
    }

    .card {
      position: relative;
      z-index:1;
      width: 100%;
      height: 2.05rem;
      margin-top: .8rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .level{
        height: .6rem;
        line-height: .6rem;
        font-size: .34rem;
        font-weight: bold;
        color: #FFF0D4;
        text-shadow: 2px 2px 4px rgba(0,0,0m,.2);
      }
      .prize{
        width: 80%;
        font-size: .14rem;
        color: #8F6300;
        text-shadow: 0 2px 4px rgba(0,0,0,0.10);
        padding:.1rem 0;
      }
      .level-process{
        display: flex;
        flex-direction: column;
        width: 3.64rem;
        .process{
          position: relative;
          width: 100%;
          height: .06rem;
          background: #C69125;
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          span{
            background: #FCDFA4;
            border-radius: 4px;
            position: relative;
            &:after{
              width: .08rem;
              height:.08rem;
              background-color: rgba(255,255,255,.89);
              position: absolute;
              right: -.04rem;
              content: '';
              border-radius:.08rem;
              top:-.01rem;
            }
          }
          &:before,&:after{
            position: absolute;
            z-index:1;
            content: '';
            width: .14rem;
            height: .14rem;
            background-color: #fff;
            background-clip: content-box;
            border-radius: .14rem;
            border:.03rem solid rgba(255,255,255,.3);
          }
          &:before{
            left:-0.07rem;
            top:-0.05rem;
          }
          &:after{
            right:-0.07rem;
            top:-0.05rem;
          }
        }
        .desc{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          color: #BF7801;
          font-size: .12rem;
          height: .3rem;
          line-height: .3rem;
        }
      }
      button{
        width: .9rem;
        height: .3rem;
        cursor: pointer;
        background-image: linear-gradient(-180deg, #F9D255 0%, #FFC049 100%);
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
        border-radius: .06rem;
        font-size: .14rem;
        color: #8F6300;
        border:none;
        margin-top: .2rem;
        outline: none;
      }
      button[disabled="disabled"]{
        background: grey;
        color: #fff;
      }
    }

  }
  .table {
    width: 3.3rem;
    height: 5.63rem;
    margin: 0.4rem auto;
    .table-content {
      margin: 0.2rem 0;
    }
    .el-table, .el-table__expanded-cell{
      background-color: transparent;
    }
    .el-table th {
      font-size: 0.14rem;
      font-weight: normal;
      font-stretch: normal;
      color: #8F6300;
      background-color: transparent;
      .cell{
        height: .3rem;
        line-height:.3rem;
      }
    }
    .el-table td,.el-table th{
      color: #8F6300;
      border-bottom:.01rem solid rgba(143,99,0,.1);
    }
    .el-table tr {
      background-color: transparent;
      font-size: 0.16rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 0.48;
      color: #ffdba2;
      &:hover{
        background-color:transparent !important;
      }
      &:last-child{
        td{
          border:none
        }
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: transparent !important;
    }

  }
}
@media (max-width: 1100px) {
  .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: hidden !important;
  }
  .vipDialog {
    .el-dialog {
      width: 6.6rem;
      height: 11rem;
    }
    .el-dialog--center .el-dialog__body .el-dialog__body-wrap{
      &:before{
        left:-1.72rem;
        top:-6.6rem;
      }
    }
    .el-table__body{
      width: 100% !important;
    }
    .card {
      height: 2.4rem !important;
      .level-process{
        width: 4.6rem !important;
        margin-top:0.1rem;
        .desc{
          margin-top:0.1rem;
          font-size: .2rem !important;
          flex-wrap: wrap;
        }
      }
      .message {
        .vip-logo {
          width: 15%;
        }
      }
      .vip-level {
        width: 85%;
        .grade {
          .el-button {
            width: 1.1rem;
            font-size: 12px;
            height: auto;
            padding: 0.1rem;
          }
        }
      }
      button{
        margin-top: .2rem !important;
        width: 1.35rem !important;
        height: .48rem !important;
        border:none !important;
        font-size: .24rem !important;
        background-color:transparent;
      }
    }
    .table {
      width: 6rem !important;
      height: 7rem;
      margin-top: .28rem;
      .el-table{
        &:before{
          height: 0px;
        }
        th,td{
          font-size: .24rem;
        }
        th{
          &>div{
            padding:0;
          }
        }
        td {
          &>div{
            padding:0;
          }
          .cell{
            display: flex;
            align-items: center;
            line-height:.6rem;
          }
          img{
            height: .4rem;
            width: auto;
          }
          padding: 0;
        }
      }
      .table-content {
        margin: 0.1rem 0;
      }


    }
  }
}
</style>
