<template>
    <div class="rank">
      <el-row :gutter="20">
            <el-col :span="24" class="dice_title">
                {{$t('RankTitle')}} 
            </el-col>
          </el-row>
         <el-row class="dice_progress">
          <el-col :span="6">
              {{$t('select.t1')}}
          </el-col>
          <el-col :span="18">
              <div class="dice_progress_bar">
                <span class="dice_progress_bar_active" :style="'width:'+Math.ceil((minStage.left/minStage.diceCount)*100)/100+'%'"></span>
                <span class="dice_progress_text">{{$t('select.number')}} {{minStage.stage}}/7 {{$t('select.stage')}}</span>
                <span class="dice_progress_right">{{minStage.left}}/{{minStage.diceCount}}</span>
              </div>
          </el-col>   
        </el-row>     
        <table border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
                <th>
                    <span>{{$t('Order')}}</span>
                </th>
                <th>
                    <span>{{$t('Player')}}</span>
                </th>
                <th>
                    <span>{{$t('TotalMount')}}</span>
                </th>
                <!-- <th>
                    <span>{{$t('Prize')}}</span>
                </th> -->
            </tr>
            </thead>
            <tbody :style="'height:'+(dbToken==0?'2.4':'2.9')+'rem'">
                <tr v-for="(item,index) of ranks" v-if="ranks.length > 0">
                    <td>
                        <span v-if="index<3"><img :src="require('../assets/images/new/rank'+(index+1)+'.png')" /></span>
                        <span v-else>
                           {{index+1}}
                        </span>
                    </td>
                    <td>
                        <span>
                            {{item.player|hiddenAddress}}
                        </span>
                    </td>
                    <td>
                        <span>
                            {{item.total|fromSun}} TRX
                        </span>
                    </td>
                    <!-- <td>
                        <span>
                            {{item.prize}} TRX
                        </span>
                    </td> -->
                </tr>
                <tr v-if="ranks.length === 0">
                  <td colspan="5" class="spin" v-if="isLoading">
                      <i></i>
                  </td>
                  <td v-else>
                       {{$t('NoData')}}
                  </td>
                </tr>
            </tbody>
        </table>
        <div v-if="ranks.length>0" class="last">
            <div>
                <div class="cell">
                    <span>{{ownerData.ranking === 0 ? '-' : ownerData.ranking}}</span>
                </div>
                <div class="cell" style="text-align: center;">
                    {{ownerData.userAddress|hiddenAddress}}
                </div>
                <div class="cell" style="text-align: center;">
                    {{ownerData.totalBet|fromSun}} TRX
                </div>
            </div>
            <!-- <div class="cell">
                {{ranks[ranks.length-1].prize}} TRX
            </div> -->
        </div>
        <!--奖励规则-->
        <el-dialog
        :title="$t('PrizeRule.title')"
        :visible.sync="ruleDialog.visible"
        width="30%">
        <div class="ruleDialog">
          <h4>
            {{$t('PrizeRule.header')}}
          </h4>
          <div style="margin-bottom: 20px;">
            <p v-for="(item,index) in $t('PrizeRule.content')" :key="index">
              {{item}}
            </p>
          </div>

          <h4>
            {{$t('PrizeRule.footer')}}
          </h4>
          <h4>
            {{$t('PrizeRule.footer2')}}
          </h4>
          <h5>
            {{$t('PrizeRule.copyright')}}
          </h5>
        </div>
      </el-dialog>
        <!-- <other-prize /> -->
    </div>
</template>

<script>
import { mapState } from "vuex";
import OtherPrize from "~/components/OtherPrize.vue";
import { getRankList } from "@/api/user";
import moment from "moment";
export default {
  name: "Rank",
  components: {
    OtherPrize
  },
  data() {
    return {
      ranks: [],
      //date: moment().format("YYYYMMDD"),
      isLoading: true,
      ruleDialog: {
        visible: false
      },
      ownerData: {},
      date: moment().format("YYYY.MM.DD"),
      isClick: false,
      isPreClick: true
    };
  },
  computed: {
    ...mapState(["contractAddress", "address", "dbToken", "dappId", "minStage"])
  },
  watch: {
    async contractAddress(n) {
      let time = moment(this.date, "YYYY.MM.DD").format("YYYYMMDD");
      this.getData(this.date);
      setInterval(_ => {
        this.getData();
      }, 5000);
    }
  },
  methods: {
    getData() {
      let ranks = [];
      //this.isLoading = true;
      const all = getRankList({
        dappId: this.dappId,
        contractAddress: this.contractAddress
      });
      const my = getRankList({
        dappId: this.dappId,
        contractAddress: this.contractAddress,
        userAddress: this.address.base58
      });
      Promise.all([all, my]).then(res => {
        this.isLoading = false;
        res[0].rankingData.forEach((v, i) => {
          let prize = 0;
          switch (i + 1) {
            case 1:
              prize = 10000;
              break;
            case 2:
              prize = 5000;
              break;
            case 3:
              prize = 3000;
              break;
            default:
              if (i + 1 >= 4 && i + 1 <= 10) {
                prize = 1000;
              } else {
                prize = 100;
              }
              break;
          }
          ranks.push({
            player: v.userAddress,
            total: v.totalBet,
            prize: prize
          });
          this.ranks = ranks;
        });
        this.ownerData = res[1].ownerData;
      });
    },
    changeTime(type) {
      //如果数据没回来，就不可点击
      if (this.isLoading) {
        return;
      }

      if (type === "-" && !this.isPreClick) {
        return;
      }

      if (type === "+" && !this.isClick) {
        return;
      }

      this.isClick = true;
      this.isPreClick = true;
      let dateTimeStemp = moment(this.date, "YYYY.MM.DD").format("x");
      // 当前日期之后都不可点击
      let currentDate = moment()
        .subtract(1, "days")
        .format("YYYY.MM.DD");
      let currentDateTimeStemp = moment(currentDate, "YYYY.MM.DD").format("x");
      // 11.06之前无数据就不可点击
      let previsousDate = moment("2018.11.12", "YYYY.MM.DD").format("x");

      let multiple = 0;
      switch (type) {
        case "+":
          multiple++;
          break;
        case "-":
          multiple--;
          break;
      }
      this.date = moment(this.date, "YYYY.MM.DD")
        .add(multiple, "days")
        .format("YYYY.MM.DD");

      let time = moment(this.date, "YYYY.MM.DD").format("YYYYMMDD");

      this.getData(time);
      if (dateTimeStemp >= currentDateTimeStemp && type === "+") {
        this.isClick = false;
        return;
      }

      if (dateTimeStemp <= previsousDate && type === "-") {
        this.isPreClick = false;
        return;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.dice_title {
  font-family: PingFang-SC-Heavy;
  font-size: 0.2rem;
  color: #9b1d16;
  padding: 0.22rem 0 0.14rem;
  font-weight: bold;
}
.dice_progress {
  width: 100%;
  font-family: PingFang-SC-Bold;
  font-size: 14px;
  color: #310000;
  padding: 0 0.21rem;
  .dice_progress_bar {
    width: 100%;
    height: 0.2rem;
    background: #ffe7c7;
    border: 1px solid #310000;
    border-radius: 6px;
    line-height: 0.2rem;
    position: relative;
    color: #310000;
    .dice_progress_text {
      position: relative;
      z-index: 2;
      font-size: 0.12rem;
      color: #ffffff;
      line-height: 0.2rem;
      display: inline-block;
      height: 100%;
      float: left;
      padding-left: 0.1rem;
    }
    .dice_progress_bar_active {
      background-image: linear-gradient(-180deg, #fd8f4f 8%, #f0330a 100%);
      border-radius: 0.06rem;
      display: inline-block;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .dice_progress_right {
      float: right;
      padding-right: 0.1rem;
      font-size: 0.12rem;
    }
  }
}
.ruleDialog {
  padding: 20px;
  h4 {
    margin-bottom: 20px;
    line-height: 20px;
  }
  p {
    line-height: 20px;
  }
  p:last-child {
    margin-bottom: 20px;
  }
}
.rank {
  width: 4.98rem;
  height: 4.98rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #fffade;
  box-shadow: inset 0 0.04rem 0.1rem 0 rgba(7, 52, 22, 0.2);
  border-radius: 0.1rem;
  .title {
    height: 0.7rem;
    line-height: 0.72rem;
    font-size: 0.2rem;
    padding: 0 0.2rem;
    color: #c53028;
    text-shadow: 0rem 0rem 0.2rem #c53028;
    font-weight: bold;
    .grey {
      color: grey;
    }

    .dateTime {
      .right {
        transform: rotate(180deg);
        display: inline-block;
      }
    }
  }
  table {
    padding: 0 0.2rem;
    tr {
      margin-top: 0.08rem;
      display: table;
      width: 100%;
      table-layout: fixed;
      border: 1px solid #c53028;
      border-radius: 0.1rem;
      th,
      td {
        height: 0.38rem;
        font-size: 0.14rem;
        color: #af1a1a;
        span {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 0.2rem;
          border-right: 1px solid #ffa5aa;
          &:first-child {
            align-items: center;
          }
        }
        &:first-child {
          width: 0.8rem;
        }
        &:last-child {
          span {
            border: none;
          }
        }
      }
    }
    thead {
      tr {
        margin: 0;
      }
    }
    tbody {
      display: block;
      height: 3.4rem;
      overflow: auto;
      border-radius: 0.1rem;
      &::-webkit-scrollbar {
        width: 0.05rem;
        border-radius: 0.04rem;
      }
      &::-webkit-scrollbar-thumb {
        background: #e2bf81;
        border-radius: 0.04rem;
      }
      tr {
        td {
          text-align: center;
          img {
            width: 0.26rem;
            height: 0.26rem;
          }
          &:first-child {
            text-align: center;
            span {
              /*width: 0.34rem;*/
              /*height: 0.34rem;*/
              /*border-radius: 100%;*/
              /*background-color: #262778;*/
              /*border: 0.01rem solid #363995;*/
              /*display: inline-block;*/
              /*line-height: 0.3rem;*/
            }
          }
        }
        &:last-child {
          td {
            border: none;
          }
        }
        .cell {
          display: inline-block;
          width: 0.04rem;
          height: 0.5rem;
          margin-right: 0rem;
          background-color: #b3a6ff;
          animation: animate 1s infinite;
          &:last-child {
            margin-right: 0px;
          }
          &:nth-child(10) {
            -webkit-animation-delay: 0.9s;
            animation-delay: 0.9s;
          }
          &:nth-child(9) {
            -webkit-animation-delay: 0.8s;
            animation-delay: 0.8s;
          }
          &:nth-child(8) {
            -webkit-animation-delay: 0.7s;
            animation-delay: 0.7s;
          }
          &:nth-child(7) {
            -webkit-animation-delay: 0.6s;
            animation-delay: 0.6s;
          }
          &:nth-child(6) {
            -webkit-animation-delay: 0.5s;
            animation-delay: 0.5s;
          }
          &:nth-child(5) {
            -webkit-animation-delay: 0.4s;
            animation-delay: 0.4s;
          }
          &:nth-child(4) {
            -webkit-animation-delay: 0.3s;
            animation-delay: 0.3s;
          }
          &:nth-child(3) {
            -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s;
          }
          &:nth-child(2) {
            -webkit-animation-delay: 0.1s;
            animation-delay: 0.1s;
          }
        }
        @keyframes animate {
          50% {
            transform: scaleY(0);
          }
        }
      }
    }
  }
  .last {
    width: 4.58rem;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #daffcf;
    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 0.4rem;
      background-color: #c53028;
      border-radius: 0.1rem;
      .cell {
        &:first-child {
          width: 0.8rem;
          display: flex;
          justify-content: center;
          span {
            width: 0.34rem;
            height: 0.34rem;
            display: inline-block;
            line-height: 0.3rem;
            text-align: center;
          }
        }
        &:nth-child(2) {
          text-align: left;
          flex: 1;
        }
        &:nth-child(3) {
          flex: 1;
        }
        &:nth-child(3),
        &:nth-child(4) {
          text-align: right;
        }
        &:nth-child(4) {
          padding-right: 0.3rem;
        }
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          width: 1.73rem;
        }
      }
    }
  }
}
@media screen and (max-width: 1100px) {
  .rank {
    width: 6.66rem;
    height: 100%;
    font-size: 0.24rem !important;
    table {
      tr {
        height: 0.52rem;
        td {
          font-size: 0.24rem;
          img {
            height: 0.3rem !important;
            width: auto !important;
          }
        }
        th {
          font-size: 0.24rem;
        }
      }
      td,
      th {
        span {
          margin-top: 0.05rem;
          height: 0.3rem !important;
        }
      }
    }
    .title {
      font-size: 0.28rem;
    }
    .last {
      width: 6.26rem;
      & > div {
        height: 0.52rem;
      }
      .cell {
        &:nth-child(2),
        &:nth-child(3) {
          width: 1.86rem;
        }
      }
    }
  }
}
</style>