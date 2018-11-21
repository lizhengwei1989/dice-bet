<template>
    <el-dialog
            :title="$t('LuckyDraw.title')"
            :visible.sync="luckyDialog.visible"
            :modal-append-to-body='false'
            center
            class="luckyDialog"
            top="10vh"
    >
        <div class="close">
            <i class="iconfont icon-close" @click="luckyDialog.visible = false"></i>
        </div>
        <div class="table">
            <table cellpadding="0" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>{{$t('LuckyDraw.number')}}</th>
                        <th>{{$t('LuckyDraw.reward')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item of rewardList">
                        <td>{{item.number}}</td>
                        <td>{{item.reward}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="desc">
            <div>
                <div>
                    {{$t('LuckyDraw.reward')}}<span>{{balance}} TRX</span>
                </div>
                <button @click="withdraw">{{$t('LuckyDraw.withdraw')}}</button>
            </div>
            <div>
                <div>{{$t('LuckyDraw.times')}} <span>{{times}}</span></div>
            </div>
        </div>
        <div class="rule">
            <p>{{$t('LuckyDraw.supplement.p1')}}</p>
            <p>{{$t('LuckyDraw.supplement.p2')}}</p>
        </div>
        <div slot="footer" class="dialog-footer" style="position: relative;">
            <div class="tip" v-if="luckyNumShow">
                <span>{{luckyNum}}</span>
                <span v-if="luckyInfoShow">{{$t('Congratulation')}} <br /> +{{getReward}} TRX </span>
            </div>
            <el-button type="primary" @click="getLuckyNum">{{$t('LuckyDraw.Draw')}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {getLuckyDrawCount} from '../static/js/Util';
/* 测试网地址 */
let contractAddress = "TSYuKXyV6pPcxcMJfaqZzt4KUBtncPPPC5";

export default {
  props: {
    visible: Boolean,
      luckyDialog: {
          type: Object,
          default: {}
      }
  },
  data() {
    return {
      // 加载层
      isLoading: false,
      // 节流阀，防止用户多次点击
      flagObj: {
        draw: true,
        withdraw: true
      },
      // 幸运数字
      luckyNum: '',
      // 奖金余额
      balance: 0,
      // 抽奖次数
      times: 0,
      // 合约对象
      contractObj: {},
      // 控制是否显示
      load: this.visible,
      // 奖金说明列表
      rewardList: this.getRewardList(),
      luckyNumShow: false,
      getReward:0,
        luckyInfoShow:false
    };
  },
  async created() {
    /* 设置合约对象 */
    this.contractObj = await window.tronWeb.contract().at(this.$store.state.activityAddress);
    this.getTimes();
    this.getBalance();
    // this.contractObj.setLotterNumber('TN7KpFteYkkGUPM4wQ8uKRLCzq2M3ngkmc', 10).send()
    // this.getLuckyNum()
    console.log(this.contractObj);
  },
  methods: {
    /* 提现 */
    async withdraw() {
      if (this.flagObj.withdraw && this.balance !== 0) {
        this.isLoading = true;
        this.flagObj.withdraw = false;
        // 获取交易id
        let transctionId = await this.contractObj.withDraw(2).send().catch(err=>{
            console.log(err);
        });
        console.log(transctionId)
        this.eventServer(
          transctionId,
          res => {
            let isSuccess = false;
            res.every(v => {
              if (v.name === "LuckWithDraw") {
                isSuccess = true;
              }
            });
            // 提现成功
            if (isSuccess) {
              this.balance = 0;
            }
            this.isLoading = false;
            this.flagObj.withdraw = true;
          },
          1000
        );
      }
    },
    /* 获取幸运数字 */
    async getLuckyNum() {
      if (this.flagObj.draw && this.times !== 0) {
        this.flagObj.draw = false;
        // 拿到交易id
        let transctionId = await this.contractObj.roll().send();
        this.luckyNumShow = true;
        // 幸运数字
        let randomTimer = setInterval(() => {
          this.luckyNum = Math.ceil(Math.random() * 10001) - 1;
        }, 60);
        // 查询事件服务器
        this.eventServer(transctionId, res => {
          clearInterval(randomTimer);
          // 设置响应的值
          res.every(v => {
            if (v.name === "GetRandom") {
              this.luckyNum = v.result._random;
              this.getReward = getLuckyDrawCount(this.luckyNum);
              this.luckyInfoShow = true;
              setTimeout(_=>{
                  this.luckyNumShow = false;
                  this.luckyInfoShow = false;
              },3000)

            }
          });
          // 刷新次数和奖金
          this.getTimes();
          this.getBalance();
          // 打开节流阀
          this.flagObj.draw = true;
        });
      }
    },
    /* 获取抽奖次数 */
    async getTimes() {
      let times = await this.contractObj.getLotterNumber().call();
      this.times = parseInt(times, 10);
    },
    /* 获取奖金余额 */
    async getBalance() {
      let balance = await this.contractObj.getLuckBalance().call();
      this.balance = parseInt(balance, 10) / Math.pow(10, 6);
    },
    /* 关闭弹层 */
    close() {
      this.load = false;
      this.$emit("update:visible", this.load);
    },
    /**
     * 事件服务器
     * @param {String} id 交易id
     * @param {Func} callback 回调函数
     * @param {Number} time 循环时间间隔， 默认3000ms
     */
    eventServer(id, callback, time = 3000) {
      // 查询事件服务器，拿到匹配结果
      let eventTimer = setInterval(async () => {
        // 拿到匹配事件返回值
        const res = await window.tronWeb.getEventByTransactionID(id);
        if (res.length !== 0) {
          // 清除定时器
          clearInterval(eventTimer);
          callback(res);
        }
      }, time);
    },
    /* 获取奖金说明列表 */
    getRewardList() {
      return [
        {
          number: "0 - 9885",
          reward: "0.1 TRX"
        },
        {
          number: "9886 - 9985",
          reward: "1 TRX"
        },
        {
          number: "9986 - 9993",
          reward: "10 TRX"
        },
        {
          number: "9994 - 9997",
          reward: "100 TRX"
        },
        {
          number: "9998 - 9999",
          reward: "1000 TRX"
        },
        {
          number: "10000",
          reward: "10000 TRX"
        }
      ];
    }
  }
};
</script>

<style lang="scss">
.luckyDialog{
    .el-dialog{
        width: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .table{
            width: 3.9rem;
            background: #FFEAC7;
            border-radius: .08rem;
            padding:0 .3rem;
            table{
                tr{
                    td,th{
                        color: #8F6300;
                        border-bottom:.01rem solid rgba(143,99,0,0.10);
                        &:first-child{
                            text-align: left;
                        }
                        &:last-child{
                            text-align: right;
                        }
                    }
                    th{
                        height: .36rem;
                    }
                    td{
                        height: .4rem;
                    }
                    &:last-child{
                        td{
                           border:none;
                        }
                    }
                }

            }
        }
        .rule{
            padding:.1rem 0;
        }
        .desc{
            width: 3.9rem;
            display: flex;
            flex-direction: column;
            height: 1rem;
            padding:.1rem 0;
            margin-bottom:-.1rem;
            &>div{
                flex: 1;
                color: #8F6300;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                span{
                    font-size: .18rem;
                }
                button{
                    border: 1px solid #8F6300;
                    border-radius: 8px;
                    width:.7rem;
                    height: .36rem;
                    background-color: transparent;
                    font-size: .14rem;
                    cursor: pointer;
                    color: #8F6300;
                    outline: none;
                    &:hover{
                        border:1px solid #C53028;
                        color: #C53028;
                    }
                }
            }
        }
        .el-button{
            height: .5rem;
            font-size: .24rem;
        }
        .tip{
            position: absolute;
            width: 1.8rem;
            height: 1.1rem;
            background: rgba(0,0,0,0.50);
            border-radius: .1rem;
            top:-260%;
            display: flex;
            flex-direction: column;
            color: #fff;
            font-size: .18rem;
            align-items: center;
            justify-content: center;
        }
        .el-dialog__footer{
            padding-top:.1rem;
        }
    }
}
@media screen and (max-width: 1100px) {
    .luckyDialog{
        .el-dialog{
            width: 6rem;
            .el-dialog__body{
                padding:0;
                .table,.desc,.rule{
                    margin:auto;
                }
                .rule{
                    width: 5rem;
                }
            }
            table{
                width: 5rem;
                tbody{
                    height: 3.3rem;
                }
                tr{
                    th{
                        height: .6rem;
                    }
                    td{
                        height: .64rem;
                    }
                }
            }

            .desc{
                width: 5rem;
                padding:.2rem 0;
                height: 1.4rem;
                line-height: .36rem;
                button{
                    width:auto !important;
                    font-size: .24rem !important;
                    color: #8F6300;
                }
                &>div{
                    span{
                        font-size: .28rem;
                    }
                }
            }
        }
    }

}

/* 打开动画 */
@keyframes dialogOpen {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

</style>