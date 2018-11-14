<template>
    <div class="rank">
        <table border="0" cellspacing="0" cellpadding="0">
            <!-- <caption class="title"><span style="text-align: left"> {{$t('RankTitle')}} <i class="el-icon-question" @click="ruleDialog.visible=true"></i></span></caption> -->
            <caption class="title">
              <el-row :gutter="20">
                <el-col :span="24" style="text-align:center;">
                    {{$t('RankTitle')}}
                    <i class="el-icon-question" @click="ruleDialog.visible=true"></i>
                </el-col>
                <!--<el-col :span="12" style="text-align:right;">-->
                  <!--<div class="dateTime">-->
                    <!--<i class="iconfont icon-jiantou-zuo-cuxiantiao" @click="changeTime('-')" :class="{grey:(!isPreClick || isLoading)}"></i>-->
                    <!--<span style="width:1rem;display:inline-block;font-size:0.18rem;text-align:center">{{date}}</span> -->
                    <!--<i class="iconfont icon-jiantou-zuo-cuxiantiao right" :class="{grey:(!isClick||isLoading)}" @click="changeTime('+')"></i>-->
                  <!--</div>    -->
                <!--</el-col>-->
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
              </el-row>
            </caption>
            <thead>
            <tr>
                <th>
                    {{$t('Order')}}
                </th>
                <th>
                    {{$t('Player')}}
                </th>
                <th>
                    {{$t('TotalMount')}}
                </th>
                <th>
                    {{$t('Prize')}}
                </th>
            </tr>
            </thead>
            <tbody :style="'height:'+(dbToken==0?'2.6':'4.4')+'rem'">
                <tr v-for="(item,index) of ranks" v-if="ranks.length > 0">
                    <td><img v-if="index < 3" :src="require('../assets/images/order'+(index+1)+'.png')"><span v-else>{{index+1}}</span></td>
                    <td>{{item.player|hiddenAddress}}</td>
                    <td>{{item.total|fromSun}} TRX</td>
                    <td>{{item.prize}} TRX</td>
                </tr>
                <tr v-if="ranks.length === 0">
                  <td colspan="5" class="span" v-if="isLoading">
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                    <div class="cell"></div>
                  </td>
                  <td v-else>
                       {{$t('NoData')}}
                  </td>
                </tr>
            </tbody>
        </table>
        <div v-if="ranks.length>0" class="last">
            <div class="cell">
                <span>{{ownerData.ranking}}</span>
            </div>
            <div class="cell">
                {{ownerData.userAddress|hiddenAddress}}
            </div>
            <div class="cell">
                {{ownerData.totalBet|fromSun}} TRX
            </div>
            <div class="cell">
                {{ranks[ranks.length-1].prize}} TRX
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getRankList } from "@/api/user";
import moment from "moment";
export default {
  name: "Rank",
  data() {
    return {
      ranks: [],
      //date: moment().format("YYYYMMDD"),
      isLoading: true,
      ruleDialog: {
        visible: false
      },
      ownerData:{},
      date: moment().format("YYYY.MM.DD"),
      isClick: false,
      isPreClick: true
    };
  },
  computed: {
    ...mapState(["contractAddress","address" ,"dbToken","dappId"])
  },
  watch: {
    async contractAddress(n) {
      let time = moment(this.date, "YYYY.MM.DD").format("YYYYMMDD");
      this.getData(this.date);
    }
  },
  methods: {
    getData(date) {
      let ranks = [];
      this.isLoading = true;
      this.ranks = [];
      const all = getRankList({dappId:this.dappId,contractAddress:this.contractAddress});
      const my = getRankList({dappId:this.dappId,contractAddress:this.contractAddress,userAddress:this.address.base58});
      Promise.all([all,my]).then((res)=>{
          console.log(res);
          this.isLoading = false;
          res[0].rankingData.forEach((v,i)=>{
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
          });
          this.ownerData=res[1].ownerData;
      });
      this.ranks = ranks;
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
  width: 100%;
  flex: 1;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .title {
    height: 0.72rem;
    line-height: 0.72rem;
    font-size: 0.3rem;
    padding: 0 0.2rem;
      color: #ff4428;
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
    padding: 0 0.08rem;
    tr {
      display: table;
      width: 100%;
      table-layout: fixed;
      padding: 0 0.12rem;
      th,
      td {
        &:first-child {
          width: 0.8rem;
        }
        &:nth-child(2) {
          text-align: left;
        }
        &:nth-child(3),
        &:nth-child(4) {
          text-align: right;
        }
        &:nth-child(4) {
          padding-right: 0.3rem;
        }
      }
    }
    thead {
      background-color: #fff0c0;
      th {
        height: 0.36rem;
        color: #9497a3;
        font-size: 0.12rem;

      }
    }
    tbody {
      tr {
        border-bottom:.02rem solid #f5f6f7;
        td {
          height: 0.78rem;
          font-size: 0.15rem;
          color: #434650;
          &:first-child {
            text-align: center;
            img {
              height: 0.34rem;
              width: 0.34rem;
            }
            span {
              width: 0.34rem;
              height: 0.34rem;
              border-radius: 100%;
              background-color: #262778;
              border: 0.01rem solid #363995;
              display: inline-block;
              line-height: 0.3rem;
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
      display: block;
      height: 3.4rem;
      overflow: auto;
      background-color: #fff0c0;
      border-radius: 10px;
      margin-top: .03rem;
      &::-webkit-scrollbar {
        width: 0.05rem;
        border-radius: 0.04rem;
      }
      &::-webkit-scrollbar-thumb {
        background: #363995;
        border-radius: 0.04rem;
      }
    }
  }
  .last {
    width: 5.92rem;
    height: 0.7rem;
    background-image: linear-gradient(118deg,
          #f98100 0%,
          #ff605a 100%),
    linear-gradient(
                  #ff8400,
                  #ff8400);
    background-blend-mode: normal,
    normal;
    border-radius: 0.1rem;
    margin-bottom: 0.16rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    .cell {
      &:first-child {
        width: 0.8rem;
        display: flex;
        justify-content: center;
        span {
          width: 0.34rem;
          height: 0.34rem;
          border-radius: 100%;
          background-color: #64e1f6;
          border: 0.01rem solid #363995;
          display: inline-block;
          line-height: 0.3rem;
          color: #1e2169;
          text-align: center;
        }
      }
      &:nth-child(2) {
        text-align: left;
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
@media screen and (max-width: 1280px) {
  .rank {
    .last {
      width: 6.66rem;
      padding: 0 0.12rem;
      //width: calc(100% - 0.2rem);
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