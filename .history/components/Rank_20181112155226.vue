<template>
    <div class="rank">
        <table border="0" cellspacing="0" cellpadding="0">
            <!-- <caption class="title"><span style="text-align: left"> {{$t('RankTitle')}} <i class="el-icon-question" @click="ruleDialog.visible=true"></i></span></caption> -->
            <caption class="title">
              <el-row :gutter="20">
                <el-col :span="12" style="text-align:left;">
                  {{$t('RankTitle')}} <i class="el-icon-question" @click="ruleDialog.visible=true"></i>
                </el-col>
                <el-col :span="12" style="text-align:right;">
                  <div class="dateTime">
                    <i class="iconfont icon-jiantou-zuo-cuxiantiao" @click="changeTime('-')" :class="{grey:(!isPreClick || isLoading)}"></i>
                    <span style="width:1rem;display:inline-block;font-size:0.18rem;text-align:center">{{date}}</span> 
                    <i class="iconfont icon-jiantou-zuo-cuxiantiao right" :class="{grey:(!isClick||isLoading)}" @click="changeTime('+')"></i>
                  </div>    
                </el-col>
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
            <tbody :style="'height:'+(dbToken==0?'3.4':'4.3')+'rem'">
                <tr v-for="(item,index) of ranks">
                    <td><img v-if="index < 3" :src="require('../assets/images/order'+(index+1)+'.png')"><span v-else>{{index+1}}</span></td>
                    <td>{{item.player|hiddenAddress}}</td>
                    <td>{{item.total}} TRX</td>
                    <td>{{item.prize}} TRX</td>
                </tr>
            </tbody>
        </table>
        <div v-if="ranks.length>0" class="last">
            <div class="cell">
                <span>{{ranks.length}}</span>
            </div>
            <div class="cell">
                {{ranks[ranks.length-1].player|hiddenAddress}}
            </div>
            <div class="cell">
                {{ranks[ranks.length-1].total}} TRX
            </div>
            <div class="cell">
                {{ranks[ranks.length-1].prize}} TRX
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getRanks } from "@/static/js/Util";
import moment from "moment";
export default {
  name: "Rank",
  data() {
    return {
      ranks: [],
      date: moment().format("YYYYMMDD"),
      isLoading: true,
      ruleDialog: {
        visible: false
      },
      date: moment().format("YYYY.MM.DD"),
      isClick: false,
      isPreClick: true
    };
  },
  computed: {
    ...mapState(["contractAddress", "dbToken"])
  },
  watch: {
    async contractAddress(n) {
      let ranks = [];
      //const data = await getRanks(this.contractAddress,20181031);
      //console.log(data);
      const data = [
        {
          Addr: "TZ6PEYsY7YRafycpZbsifMvSFC1wrZCiro",
          Val: 2515962000000,
          TrxCnt: 653,
          Rank: 1,
          LatestRoll: 1540311261000,
          OldestRoll: 1540301484000,
          AvgRollVal: 0
        },
        {
          Addr: "TQeMzLq1iUFTWLcgK4RvNAEGMgyPJxpnjC",
          Val: 1594764000000,
          TrxCnt: 428,
          Rank: 2,
          LatestRoll: 1540217256000,
          OldestRoll: 1540202877000,
          AvgRollVal: 0
        },
        {
          Addr: "TGy527xjraKG4kHhiMjNbP5uDuC5Ku1ULb",
          Val: 967545000000,
          TrxCnt: 6450,
          Rank: 3,
          LatestRoll: 1540367409000,
          OldestRoll: 1540166409000,
          AvgRollVal: 0
        },
        {
          Addr: "TMjvuSzzV5H8BbiQewHkvcpQYHKUXPUN3Q",
          Val: 892635000000,
          TrxCnt: 156,
          Rank: 4,
          LatestRoll: 1540286517000,
          OldestRoll: 1540197366000,
          AvgRollVal: 0
        },
        {
          Addr: "TVQcRMbpxKHGphQ1GghU6LwXzoVRaSD3f3",
          Val: 576264000000,
          TrxCnt: 474,
          Rank: 5,
          LatestRoll: 1540202124000,
          OldestRoll: 1540194555000,
          AvgRollVal: 0
        },
        {
          Addr: "TLRXhr4cvYr6j4FMM8iGUTh119zqwQiSkW",
          Val: 422433000000,
          TrxCnt: 111,
          Rank: 6,
          LatestRoll: 1540223286000,
          OldestRoll: 1540214535000,
          AvgRollVal: 0
        },
        {
          Addr: "TWX4bFLyiMW6K5GFDdfBtU3LxvMi98NcXT",
          Val: 312500000000,
          TrxCnt: 625,
          Rank: 7,
          LatestRoll: 1540307892000,
          OldestRoll: 1540171335000,
          AvgRollVal: 0
        },
        {
          Addr: "TERG6kGZbHyWNGVwte7RMh6Pjktmor6kY5",
          Val: 297297000000,
          TrxCnt: 87,
          Rank: 8,
          LatestRoll: 1540359252000,
          OldestRoll: 1540214664000,
          AvgRollVal: 0
        },
        {
          Addr: "TAm6Bbxw6F5RiZmKdEaqxFctiq2Cku8S5w",
          Val: 193474876000,
          TrxCnt: 671,
          Rank: 9,
          LatestRoll: 1540374831000,
          OldestRoll: 1540311213000,
          AvgRollVal: 0
        },
        {
          Addr: "TG3n7EBHV85z2UspkQ33hyQgqKPAjLTYZg",
          Val: 184243000000,
          TrxCnt: 1607,
          Rank: 10,
          LatestRoll: 1540360065000,
          OldestRoll: 1540265349000,
          AvgRollVal: 0
        },
        {
          Addr: "TZAM4BQcgYqgcwwXspj2tpaqhxif3qC58m",
          Val: 153735000000,
          TrxCnt: 212,
          Rank: 11,
          LatestRoll: 1540374396000,
          OldestRoll: 1540282518000,
          AvgRollVal: 0
        },
        {
          Addr: "TXaE1RKBGcSW5saX15FzDAb5enXJr5gWa7",
          Val: 121816000000,
          TrxCnt: 905,
          Rank: 12,
          LatestRoll: 1540278453000,
          OldestRoll: 1540224510000,
          AvgRollVal: 0
        },
        {
          Addr: "THrjj7sDFa5c7RLSHs1Hb2Q4ZukUNp1cuu",
          Val: 119777000000,
          TrxCnt: 44,
          Rank: 13,
          LatestRoll: 1540202289000,
          OldestRoll: 1540201395000,
          AvgRollVal: 0
        },
        {
          Addr: "TY6vxRFx2865vQkiJ6nmzM2qu7Nqeikk3F",
          Val: 77832000000,
          TrxCnt: 333,
          Rank: 14,
          LatestRoll: 1540189530000,
          OldestRoll: 1540177707000,
          AvgRollVal: 0
        },
        {
          Addr: "TE2cz5maxXY6KdCZxqtWFRVtrj1QkEUU4Z",
          Val: 70561000000,
          TrxCnt: 322,
          Rank: 15,
          LatestRoll: 1540297167000,
          OldestRoll: 1540287345000,
          AvgRollVal: 0
        },
        {
          Addr: "TKUmTX123uuszGyXKaiWQ89fnaCABbMWUY",
          Val: 56184000000,
          TrxCnt: 323,
          Rank: 16,
          LatestRoll: 1540316970000,
          OldestRoll: 1540223955000,
          AvgRollVal: 0
        },
        {
          Addr: "TMaSok6E9SWcYoUVv8xMMk1MkRjVpnLJzB",
          Val: 48233000000,
          TrxCnt: 315,
          Rank: 17,
          LatestRoll: 1540322034000,
          OldestRoll: 1540316997000,
          AvgRollVal: 0
        },
        {
          Addr: "TCWAobTJGMX7Ybed6YqxbHCuHLCaniwMJ2",
          Val: 46708000000,
          TrxCnt: 32,
          Rank: 18,
          LatestRoll: 1540263315000,
          OldestRoll: 1540177488000,
          AvgRollVal: 0
        },
        {
          Addr: "TVgWFcq8MPeb3PKfFvM8bhWZ3QEPPnR3nW",
          Val: 35062000000,
          TrxCnt: 466,
          Rank: 19,
          LatestRoll: 1540332474000,
          OldestRoll: 1540328412000,
          AvgRollVal: 0
        },
        {
          Addr: "TS8fyGssAxgBttmezCis9o3zz3jir5ysp9",
          Val: 25861000000,
          TrxCnt: 1074,
          Rank: 20,
          LatestRoll: 1540366449000,
          OldestRoll: 1540176363000,
          AvgRollVal: 0
        },
        {
          Addr: "TUyTrACxUtdGFJLavoHwp6o6zzoJD6aEaK",
          Val: 24340000000,
          TrxCnt: 270,
          Rank: 21,
          LatestRoll: 1540177293000,
          OldestRoll: 1540172121000,
          AvgRollVal: 0
        },
        {
          Addr: "TKDMcxbg2aMnHQoTdd649Pomyupo6DhTft",
          Val: 22454000000,
          TrxCnt: 151,
          Rank: 22,
          LatestRoll: 1540219248000,
          OldestRoll: 1540217469000,
          AvgRollVal: 0
        },
        {
          Addr: "TPXXPgzEWFKy1bQStAm8n9NCUqQD8FsmGX",
          Val: 19382000000,
          TrxCnt: 66,
          Rank: 23,
          LatestRoll: 1540265844000,
          OldestRoll: 1540207716000,
          AvgRollVal: 0
        },
        {
          Addr: "TXaRivhiVDg4m45PZHbgwvNczVbfNxvDii",
          Val: 16523000000,
          TrxCnt: 1388,
          Rank: 24,
          LatestRoll: 1540348989000,
          OldestRoll: 1540170852000,
          AvgRollVal: 0
        },
        {
          Addr: "TKvbUrVQSYcfnibcqUsgFNyuEzDu4U3e5V",
          Val: 14400000000,
          TrxCnt: 18,
          Rank: 25,
          LatestRoll: 1540311132000,
          OldestRoll: 1540308297000,
          AvgRollVal: 0
        }
      ];
      data.forEach(v => {
        ranks.push({
          player: v.Addr,
          total: window.tronWeb.fromSun(v.Val),
          prize: v.TrxCnt
        });
      });
      this.ranks = ranks;
    }
  },
  changeTime(type) {
    //如果数据没回来，就不可点击
    if (this.isLoading) {
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
    let previsousDate = moment("2018.11.07", "YYYY.MM.DD").format("x");

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
};
</script>
<style scoped lang="scss">
.rank {
  width: 100%;
  /*height: 5.7rem;*/
  flex: 1;
  background-image: linear-gradient(
      142deg,
      #2b2c80 0%,
      #222470 62%,
      #191c60 100%
    ),
    linear-gradient(#242572, #242572);
  background-blend-mode: normal, normal;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .title {
    height: 0.72rem;
    line-height: 0.72rem;
    font-size: 0.2rem;
    border-bottom: 0.02rem solid #383a90;
    padding: 0 0.2rem;
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
      th {
        height: 0.4rem;
        color: #a8abe4;
        font-size: 0.12rem;
      }
    }
    tbody {
      tr {
        td {
          height: 0.8rem;
          font-size: 0.15rem;
          border-bottom: 0.02rem solid #262778;
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
      }
      display: block;
      height: 3.4rem;
      overflow: auto;
      border-radius: 0.1rem;
      background-color: #131258;
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
    width: 6.04rem;
    height: 0.85rem;
    background-color: #363995;
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