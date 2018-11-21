<template>
  <el-dialog
    :title="$t('Invite.title')"
    :visible.sync="inviteDialog.visible"
    :modal-append-to-body='false'
    center class="inviteDialog"
    top="10vh"
    >
    <p class="center" v-html="$t('Invite.desc')"></p>
    <el-row class="invite-url">
      <p class="url">{{inviteUrl}}</p>
      <el-button @click="copy" class="copyContent" :data-clipboard-text="inviteUrl">
            {{$t('Invite.copyButton')}}
      </el-button>
    </el-row>

    <el-row class="table">

      
    </el-row>

    <el-row class="record">
      <p>{{$t('Invite.result.number')}}：<span>{{page.total}}</span></p>
      <p>
        <b>{{$t('Invite.result.prize')}}：<span>{{prize/1000000}} TRX </span></b>
        <el-tooltip placement="right">
          <div slot="content" v-html="$t('ToolTip.NotWithdraw')"></div>
          <el-button @click="extract" class="disabled" >{{$t('extract')}}</el-button>
        </el-tooltip>
      </p>
    </el-row>
    <el-row>
      {{$t('vip.copyRight')}}
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inviteDialog.visible = false">{{$t('Confirm')}}</el-button>
    </span>
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
      tableLoading: true,
      inviteUrl:  this.$t('Invite.previousUrl')+window.location.origin+'?from='+this.$store.state.address.base58
    };
  },

  async mounted() {
    this.activityAddress = this.$store.state.activityAddress;
    let tronWeb = window.tronWeb;
    this.contractInstance = await tronWeb.contract().at(this.activityAddress);
    await this.getBalance();
    this.getTableData();


    // this.contractInstance.setInvitationBalance('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc',200).send();
  },
  computed: {
    // inviteUrl() {
    //   let address = this.$store.state.address || {};
    //   let finalUrl = `${this.url}?from=${address.base58}`;
    //   return finalUrl;
    // },
    postData() {
      this.page.start = (this.page.current - 1) * this.page.limit;
      let data = {
        contractAddress: this.$store.state.contractAddress,
        userAddress: this.$store.state.address.base58 || "",
        dappId: '1',
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
      return;
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

      // this.tableData = response.data;
      this.page.total = response.total;

      // this.tableLoading = false;
    }
  }
};
</script>
<style lang="scss">
.inviteDialog {
  .el-button{
    &:hover{
      border-color:#C53028 !important;
      color: #C53028 !important;
    }
  }
  .el-dialog {
    color: #0a0a30;
    width: 5.6rem;
    border-radius: 0.1rem;
  }
  .el-dialog__title {
  }
  .center {
    font-size: 0.14rem;
    font-weight: normal;
    padding:.2rem 0 0;
    text-align: left;
  }
  .invite-url {
    background: #FFEAC7;
    border-radius: 0.08rem;
    padding: 0.23rem;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    .url {
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: -0.4px;
      word-break: break-all;
      text-align: left;
      font-size: 14px;
      color: #8F6300;
    }
    .copyContent {
      font-size: .14rem;
      color: #8F6300;
      margin:0.2rem auto 0;
      padding: 0.1rem 0.15rem;
      width: 2.23rem;
      height: 0.41rem;
      border-radius: 0.1rem;
      border: 1px solid #8F6300;
      background: transparent;
      box-shadow: none;
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
    margin-top: 14px;
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
    background:#FFEAC7;
    border-radius: 0.1rem;
    padding: .1rem .2rem;
    box-sizing: border-box;
    color: #fff;
    line-height: 0.25rem;
    display: flex;
    flex-direction: column;
    p{
      font-size: .14rem;
      color: #8F6300;
      flex:1;
      b{
        font-weight: normal;
      }
      & > span{
        font-size: .18rem;
      }
      &:last-child{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .el-button {
          margin: 0;
          border:1px solid #8F6300;
          border-radius: .08rem;
          background: transparent;
          color: #8F6300;
          width: .8rem;
          height: .4rem;
          text-align: center;
          padding:0;
          box-shadow: none;
          font-size: .14rem;
        }
        .el-button.disabled{
          background-color: grey;
          color: #fff;
          cursor::not-allowed;
          &:hover{
            color: #fff !important;
          }
        }
      }
    }

  }
}
@media (max-width: 1100px) {
  .inviteDialog {
    .el-dialog {
      width: 7rem;
      .invite-url{
        height: auto;
      }
      .center{
        font-size: .24rem;
      }
      .copyContent{
        padding:0;
      }
      .record {
        position: relative;
        height: 1.4rem;
        padding:.3rem .2rem;
        margin-bottom:.3rem;
        font-size: .32rem;
        p{
          font-size: .24rem;
          display: flex;
          align-items: center;
          span{
            font-size: .24rem;
          }
          &:last-child{
            flex-direction: row;
            justify-content: space-between;
            .el-button {
              width: auto;
              height: 0.4rem;
              padding:0 .2rem;
            }
          }

        }

      }
    }


  }
}
</style>
