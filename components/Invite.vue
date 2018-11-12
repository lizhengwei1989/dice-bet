<template>

  <el-dialog
    :title="$t('invite.title')"
    :visible.sync="inviteDialog.visible"
    :modal-append-to-body='false'
    center class="inviteDialog"
    top="10vh"
    >
    <p class="center">{{$t('invite.desc')}}</p>
    <el-row class="invite-url">
      <p class="url">{{inviteUrl}}</p>
      <el-button @click="copy" class="copyContent" :data-clipboard-text="inviteUrl">
            {{$t('invite.copyButton')}}
      </el-button>
    </el-row>
    <!-- <el-row class="message">
      <el-input placeholder="请输入内容" v-model="inviteUrl" >
        <template slot="append"   >
          <el-button @click="copy" class="copyContent" :data-clipboard-text="inviteUrl">
            {{$t('invite.copyButton')}}
          </el-button>
        </template>
      </el-input>
    </el-row> -->
    <!-- <el-row>
      <div class="title">{{$t('invite.prize')}}

        <el-tooltip placement="right" effect="light">
          <div slot="content">
              <p style="font-size: 14px;" v-for="(item,index) in $t('invite.prizeRule')" :key="index">
                {{item}}
              </p>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="textCenter">
        <p class="">{{prize/1000000}} TRX</p>
        <el-button @click="extract" type="primary" :loading="extractLoading">{{$t('extract')}}</el-button>
      </div>

    </el-row> -->
    <el-row class="table">
      <!-- <p class="title">{{$t('invite.record')}}</p> -->
      <!-- <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      border
      height="150"
      v-loading="tableLoading"
          element-loading-background="rgba(0, 0, 0, 0.9)"
      >
        <el-table-column prop="statisticTime" :label="$t('invite.table.time')">
          <template slot-scope="scope">
            {{moment(scope.row.statisticTime).format('YYYY-MM-DD')}}
            
          </template>
        </el-table-column>
        <el-table-column prop="inviteeAddress" :label="$t('invite.table.address')" width="220px">
          <template slot-scope="scope">
            {{scope.row.address | hiddenAddress}}
            <el-button type="success" :data-clipboard-text="scope.row.address" size="mini" style="float: right" class="copyContent" @click="copy">
              {{$t('invite.copyButton')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="returnAmount" :label="$t('invite.table.bet')">
          <template slot-scope="scope">
            {{scope.row.bet | fromSun}} TRX
          </template>
        </el-table-column>
        <el-table-column prop="returnAmount" :label="$t('invite.table.prize')">
          <template slot-scope="scope">
            {{scope.row.prize | fromSun}} TRX
          </template>
        </el-table-column>
      </el-table> -->
      
    </el-row>
    <!-- <el-row style="text-align:center;" small>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="page.size"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    </el-row> -->
    <el-row class="record">
        <p>{{$t('invite.result.number')}}：{{page.total}}</p>
        <p>{{$t('invite.result.prize')}}：{{prize/1000000}} TRX <el-button>{{$t('extract')}}</el-button> </p>
    </el-row>
    <el-row>
      {{$t('vip.copyRight')}}
    </el-row>
  </el-dialog>
</template>
<script>
import Clipboard from "clipboard";
// import { getInviteList } from "~/api/vip";
import moment from "moment";

export default {
  props: {
    inviteDialog: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      currentGrade: 1,
      emaining: 15000,
      url: null,
      tableData: [],
      extractLoading: false,
      activityAddress: "", //合约地址
      contractInstance: {}, //合约对象
      page: {
        start: 0,
        limit: 10,
        size: [10, 50, 100],
        total: 0,
        current: 1
      },
      prize: 0,
      tableLoading: true
    };
  },

  async mounted() {
    this.activityAddress = this.$store.state.activityAddress;
    let tronWeb = window.tronWeb;
    this.contractInstance = await tronWeb.contract().at(this.activityAddress);
    await this.getBalance();
    // this.getTableData();

    this.url = window.location.origin;

    // this.contractInstance.setInvitationBalance('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc',200).send();
  },
  computed: {
    inviteUrl() {
      let address = this.$store.state.address || {};
      let finalUrl = `${this.url}?from=${address.base58}`;
      return finalUrl;
    },
    postData() {
      this.page.start = (this.page.current - 1) * this.page.limit;
      let data = {
        contractAddress: this.activityAddress,
        inviterAddress: this.$store.state.address.base58 || "",
        dappid: 1,
        start: this.page.start,
        limit: this.page.limit
      };

      return data;
    }
  },
  methods: {
    async getBalance() {
      let banlance = await this.contractInstance.getInvitationBalance().call();
      banlance = banlance.toString();
      this.prize = banlance;
    },
    copy() {
      let clipboard = new Clipboard(".copyContent");
      clipboard.on("success", e => {
        this.$message({
          showClose: true,
          message: "Copy success",
          type: "success"
        });

        clipboard.destroy();
      });

      clipboard.on("error", e => {
        this.$message.success("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    async extract() {
      if (this.prize == 0) {
        return;
      }

      this.extractLoading = true;

      const txId = await this.contractInstance.withDraw(1).send();
      let checkBalance = setInterval(async () => {
        const res = await tronWeb.getEventByTransacionID(txId);
        if (res.length > 0) {
          res.every(v => {
            if (v.name === "InvitationWithDraw") {
              clearInterval(checkBalance);

              this.extractLoading = false;
              this.prize = 0;
              this.tableData = [];
            }
          });
        }
      }, 2000);
    },
    handleSizeChange(val) {
      this.page.limit = val;
      // this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      // this.getTableData();
    },
    // async getTableData() {
    //   let data = this.postData;
    //   let response = await getInviteList(data);

    //   this.tableData = response.data;
    //   this.page.total = response.total;

    //   this.tableLoading = false;
    // }
  }
};
</script>
<style lang="scss">
.inviteDialog {
  .el-dialog {
    background: #fff;
    color: #0a0a30;
    width: 5.6rem;
    border-radius: 0.1rem;
  }
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 0.2755rem;
    font-weight: normal;
    font-stretch: normal;
    color: #0a0a30;
  }
  .center {
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 0.18rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 0.48rem;
    color: #0a0a30;
  }
  .invite-url {
    height: 1.61rem;
    background-color: #eaebed;
    border-radius: 0.1rem;
    padding: 0.23rem;
    box-sizing: border-box;
    text-align: center;
    position: relative;

    .url {
      height: 36px;
      font-family: PingFangSC-Regular;
      font-size: 0.17rem;
      font-weight: normal;
      font-stretch: normal;
      height: 0.595rem;
      letter-spacing: -0.4px;
      color: #7f8084;
      word-break: break-all;
      text-align: left;
    }
    .copyContent {
      margin-top: 0.2rem;
      position: absolute;
      bottom: 0.15rem;
      left: 0;
      right: 0;
      margin: auto;
      color: #fff;
      padding: 0.1rem 0.15rem;
      width: 2.23rem;
      height: 0.41rem;
      background-image: linear-gradient(
          -25deg,
          #7341ca 0%,
          #7854e5 50%,
          #7c67ff 100%
        ),
        linear-gradient(#4648bf, #4648bf);
      background-blend-mode: normal, normal;
      border-radius: 0.1rem;
    }
  }

  .message {
    height: 60px;
    line-height: 60px;
  }

  .textRight {
    text-align: right;
  }
  .vipProgress {
    margin-top: 20px;
  }
  .table {
    margin-top: 40px;
    .el-table th,
    .el-table tr {
      background: #000;
      color: #fff;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #212e3e !important;
    }
  }

  .el-input-group__append {
    background-color: #409eff;
    color: #fff;
  }

  .title {
    margin-bottom: 10px;
  }

  .textCenter {
    p {
      text-align: center;
      font-size: 20px;
      color: #5bd4d7;
      font-weight: bold;
    }

    .el-button {
      margin-top: 10px;
      background: #5bd4d7;
      border-color: #fff;
    }

    text-align: center;
  }

  .el-row {
    margin-top: 20px;
  }

  .el-table__empty-block {
    background-color: #000;
  }
  .el-table__empty-text {
    color: #fff;
  }

  .el-pagination__total,
  .el-pagination__jump {
    color: #fff;
  }

  .record {
    height: 0.87rem;
    margin: 0 auto;
    background-image: linear-gradient(
        -25deg,
        #7341ca 0%,
        #7854e5 50%,
        #7c67ff 100%
      ),
      linear-gradient(#eaebed, #eaebed);
    background-blend-mode: normal, normal;
    border-radius: 0.1rem;
    padding: 0.2rem;
    box-sizing: border-box;
    color: #fff;
    line-height: 0.25rem;
    .el-button {
      float: right;
      width: 0.65rem;
      height: 0.28rem;
      background-color: #ffffff;
      border-radius: 0.08rem;
      padding: 0;
    }
  }
}
@media (max-width: 750px) {
  .inviteDialog {
    .el-dialog {
      width: 7rem;
    }
    .record {
      position: relative;
      height: 1.4rem;
      .el-button {
        width: auto;
        height: 0.38rem;
        padding: 0 0.2rem;
        position: absolute;
        left: 50%;
        bottom: 0.2rem;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
