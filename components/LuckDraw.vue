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
                    所得奖励：<span>{{balance}} TRX</span>
                </div>
                <button>{{$t('extract')}}</button>
            </div>
            <div>
                <div>余抽奖次数： <span>{{times}}</span></div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer" style="position: relative;">
            <div class="tip" v-if="luckyNumShow">
                <span>{{luckyNum}}</span>
                <span v-if="luckyInfoShow">恭喜中奖 <br /> +{{getReward}} TRX </span>

            </div>
            <el-button type="primary" @click="getLuckyNum">开始抽奖</el-button>
        </div>
    </el-dialog>
  <!--<article  class="root">-->
    <!--<div class="mask">-->
      <!--<div class="content">-->
        <!--<i class="el-icon-close" @click="close" style="color:grey"></i>-->
        <!--&lt;!&ndash; 标题 &ndash;&gt;-->
        <!--<el-row>-->
          <!--<h1 class="title">{{$t('LuckyDraw.title')}}</h1>-->
        <!--</el-row>-->
        <!--&lt;!&ndash; 玩法说明 &ndash;&gt;-->
        <!--&lt;!&ndash; <el-row>-->
          <!--<span class="introduct">{{$t('LuckyDraw.introductions')}}</span>-->
        <!--</el-row> &ndash;&gt;-->
        <!--&lt;!&ndash; 列表 &ndash;&gt;-->
        <!--<el-row>-->
          <!--<table cellspacing="0" cellpadding="0" class="list">-->
            <!--<thead>-->
              <!--<tr>-->
                <!--<td>{{$t('LuckyDraw.number')}}</td>-->
                <!--<td>{{$t('LuckyDraw.reward')}}</td>-->
              <!--</tr>-->
            <!--</thead>-->
            <!--<tbody>-->
              <!--<tr v-for="(item, index) in rewardList" :key="index">-->
                <!--<td>{{item.number}}</td>-->
                <!--<td>{{item.reward}}</td>-->
              <!--</tr>-->
            <!--</tbody>-->
          <!--</table>-->
        <!--</el-row>-->
        <!--<el-row class="record">-->
            <!--<el-col :span="3">-->
                <!--<img :src="require('../assets/images/user-1.png')" class="user-img">-->
            <!--</el-col>-->
            <!--<el-col :span="16" class="prize">-->
                <!--<div>{{$t('LuckyDraw.rewardText')}} <span>{{balance + ' TRX'}}</span></div>-->

            <!--</el-col>-->
            <!--<el-col class="btn-withdraw" :span="5">-->
                <!--<button class="with-draw" @click="withdraw" v-loading="isLoading"-->
            <!--element-loading-text="loading..."-->
            <!--element-loading-spinner="el-icon-loading"-->
            <!--element-loading-background="rgba(0, 0, 0, 0.6)">-->
                  <!--{{$t('LuckyDraw.withdraw')}}-->
                <!--</button>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <!--&lt;!&ndash; 抽奖 &ndash;&gt;-->
        <!--<el-row class="lottery">-->
          <!--&lt;!&ndash; 开奖结果 &ndash;&gt;-->
          <!--&lt;!&ndash; <el-col :span="8">-->
            <!--<div class="t1">-->

            <!--</div>-->
          <!--</el-col> &ndash;&gt;-->
          <!--&lt;!&ndash; 抽奖触发 &ndash;&gt;-->
          <!--<el-col :span="24" style="text-align: center;margin-bottom:0.1rem;position:relative">-->
              <!--<div class="lucky-num" v-show="luckyNumShow">-->
                  <!--{{$t('LuckyDraw.winText') + ' ' + luckyNum}}-->
              <!--</div>-->
              <!--<button @click="getLuckyNum" class="roll">-->
                <!--{{times+' '+ $t('LuckyDraw.times')}}-->
              <!--</button>-->
          <!--</el-col>-->
          <!--&lt;!&ndash; 奖金 &ndash;&gt;-->
          <!--&lt;!&ndash; <el-col-->
            <!--:span="8"-->
            <!--v-loading="isLoading"-->
            <!--element-loading-text="loading..."-->
            <!--element-loading-spinner="el-icon-loading"-->
            <!--element-loading-background="rgba(0, 0, 0, 0.6)"-->
          <!--&gt;-->
            <!--<div>{{$t('LuckyDraw.rewardText')}}</div>-->
            <!--<span>{{balance + ' TRX'}}</span>-->
            <!--<a @click="withdraw" class="withdraw" href="javascript:;">{{$t('LuckyDraw.withdraw')}}</a>-->
          <!--</el-col> &ndash;&gt;-->
        <!--</el-row>-->
        <!--&lt;!&ndash; 补充说明 &ndash;&gt;-->
        <!--<el-row class="supplement">-->
          <!--<p>{{$t('LuckyDraw.supplement.p1')}}</p>-->
          <!--<p>{{$t('LuckyDraw.supplement.p2')}}</p>-->
        <!--</el-row>-->
        <!--&lt;!&ndash; 解释权 &ndash;&gt;-->
        <!--<el-row class="explanation">-->
          <!--<p>{{$t('vip.copyRight')}}</p>-->
        <!--</el-row>-->
      <!--</div>-->
    <!--</div>-->
  <!--</article>-->
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
        let transctionId = await this.contractObj.withDraw(2).send();
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
        .desc{
            width: 3.9rem;
            display: flex;
            flex-direction: column;
            height: 1rem;
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
                    font-size: .16rem;
                    cursor: pointer;
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