<template>

  <el-dialog
    :modal-append-to-body='false'
    :visible.sync="vipDialog.visible"
     center class="vipDialog">
    <!-- <p class="center">{{$t('vip.desc')}}</p> -->
    <div class="card">
        <el-row class="message" :gutter="20">
          <el-col class="vip-logo" :span="6" >
            <img :src="require('../assets/images/vip.png')" class="vip-img"/>
          </el-col>
          <el-col :span="18" class="vip-level">
            <span class="level">VIP等级</span>
            <span class="grade">{{$t('vip.prize')}}：{{prize/1000000}} TRX <el-button type="primary" size="mini" @click="extract" :loading="extractLoading" style="float:right;">{{$t('extract')}}</el-button></span>  
          </el-col>
        </el-row>
        <el-row class="vipProgress" >
          <el-row :gutter="10" class="text">
            <el-col :span="2">
              <img class="vip-img"  :src="require('../assets/images/vip'+vipInfo.level+'.png')">
            </el-col>
            <el-col :span="20" style="text-align:center;line-height:0.26rem;color:#fff;">
                {{emainingText}}
            </el-col>
            <el-col :span="2">
              <img class="vip-img" :src="require('../assets/images/vip'+(vipInfo.level+1)+'.png')">
            </el-col>
          </el-row>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="vipInfo.expBar"></el-progress>
        <!-- <el-tooltip class="item" effect="light" :content="emainingText" placement="top">
            
        </el-tooltip> -->
        </el-row>
    </div>
    
    <el-row class="table">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%"
          size="mini"
          v-loading="tableLoading"
          element-loading-background="rgba(0, 0, 0, 0.9)"
          class="table-content"
        >
          <el-table-column prop="grade" :label="$t('vip.table.level')">
            <template slot-scope="scope">
              
              <img class="vip-img" :src="require('../assets/images/vip'+scope.row.level+'.png')">
            </template>

          </el-table-column>
          <el-table-column prop="allBets" :label="$t('vip.table.amount')" width="150px">
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

    <el-row style="margin-top:0.2rem;color:#fff">
      {{$t('vip.copyRight')}}
    </el-row>

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
      this.tableData = await getVipList();
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
        const res = await tronWeb.getEventByTransacionID(txId);
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
    width: 0.26rem;
    height: 0.26rem;
  }
  .el-dialog {
    width: 4.83rem;
    background-color: #454545;
    border-radius: 0.2rem;
  }
  .el-dialog--center .el-dialog__body {
    padding: 0.2rem;
  }
  .card {
    width: 100%;
    height: 2.05rem;
    background-image: linear-gradient(-4deg, #9e6e33 0%, #d8b274 100%),
      linear-gradient(#ffffff, #ffffff);
    background-blend-mode: normal, normal;
    border-radius: 0.2rem;
    padding: 0.2rem 0.3rem;
    box-sizing: border-box;

    .vip-img {
      width: 0.61rem;
      height: 0.62rem;
    }
    .vip-level {
      .level {
        font-family: MicrosoftYaHeiUI-Bold;
        font-size: 0.192rem;
        font-weight: normal;
        font-stretch: normal;
        line-height: 0.38rem;
        color: #4b351c;
        display: block;
      }
      .grade {
        font-family: MicrosoftYaHeiUI;
        font-size: 0.14rem;
        font-weight: normal;
        font-stretch: normal;
        color: #4b351c;
        height: 0.6rem;
        display: inline-block;
        width: 100%;
        .el-button {
          float: right;
          font-family: MicrosoftYaHeiUI;
          font-size: 0.14rem;
          font-weight: normal;
          font-stretch: normal;
          color: #4b351c;
        }
      }
      .el-button {
        height: 0.28rem;
        background-image: linear-gradient(-16deg, #b5b4b4 0%, #ffffff 100%),
          linear-gradient(#cfcfcf, #cfcfcf);
        background-blend-mode: normal, normal;
        border-radius: 0.08rem;
        width: auto;
      }
    }
    .vipProgress {
      .el-progress-bar__outer {
        height: 0.07rem;
        background-color: #4b351c;
        border-radius: 0.0323rem;
      }
      .el-progress-bar__inner {
        background-color: #ffffff;
        border-radius: 0.0323rem;
      }
      .el-progress-bar__innerText {
        color: #4b351c;
      }
      .vip-img {
        width: 0.26rem;
        height: 0.26rem;
      }
      .text {
        margin-bottom: 0.08rem;
      }
    }
  }
  .table {
    width: 100%;
    height: 5.63rem;
    border-radius: 0.2rem;
    border: solid 1px #c49b5e;
    margin-top: 0.1rem;
    background-color: #454545;
    .table-content {
      margin: 0.2rem 0;
    }
    .el-table th {
      font-family: MicrosoftYaHeiUI;
      font-size: 0.1293rem;
      font-weight: normal;
      font-stretch: normal;
      color: #b49d78;
      background-color: #454545;
    }
    .el-table tr {
      background-color: #454545;
      height: 0.17;
      font-family: MicrosoftYaHeiUI;
      font-size: 0.16rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 0.48;
      color: #ffdba2;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #212e3e !important;
    }

    .el-table td,
    .el-table th.is-leaf {
      border-bottom: none;
    }
  }
}
@media (max-width: 750px) {
  .vipDialog {
    .el-dialog {
      width: 6.6rem;
    }
    .card {
      height: 2.4rem;
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
    }
    .table {
      height: 6rem;
      .el-table::before {
        height: 0px;
      }
      .table-content {
        margin: 0.1rem 0;
      }
      td {
        padding: 0;
      }
    }
  }
}
</style>
