<template>

  <el-dialog
    :title="$t('invite.title')"
    :visible.sync="inviteDialog.visible"
    center width="760px" class="inviteDialog"
    top="10vh"
    >
    <p class="center">{{$t('invite.desc')}}</p>
    <el-row class="message">
      <el-input placeholder="请输入内容" v-model="inviteUrl" >
        <template slot="append"   >
          <el-button @click="copy" class="copyContent" :data-clipboard-text="inviteUrl">
            {{$t('invite.copyButton')}}
          </el-button>
        </template>
      </el-input>
    </el-row>
    <el-row>
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

    </el-row>
    <el-row class="table">
      <p class="title">{{$t('invite.record')}}</p>
      <el-table
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
      </el-table>
      
    </el-row>
    <el-row style="text-align:center;" small>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="page.size"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    </el-row>
    <el-row>
      {{$t('vip.copyRight')}}
    </el-row>
  </el-dialog>
</template>
<script>
import Clipboard from "clipboard";
import { getInviteList } from "~/api/vip";
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
    this.getTableData();

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
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    async getTableData() {
      let data = this.postData;
      let response = await getInviteList(data);

      this.tableData = response.data;
      this.page.total = response.total;

      this.tableLoading = false;
    }
  }
};
</script>
<style lang="scss">
.inviteDialog {
  .el-dialog {
    background: #000;
    color: #fff;
  }
  .el-dialog__title,
  .el-dialog__body {
    color: #fff;
  }
  .center {
    text-align: center;
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
}
</style>
