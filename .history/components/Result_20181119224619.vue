<template>
  <div class="result">
    <div class="wrap">
      <div class="tab" ref="tab">
        <a href="javascript:;" class="focus" @click="tab(0)">{{$t('Result.AllBets')}}</a>
        <a href="javascript:;" @click="tab(1)">{{$t('Result.MyBets')}}</a>
        <!--<a href="javascript:;" @click="tab(2)">{{$t('LuckyPrize')}}</a>-->
      </div>
      <div class="output" ref="output">
        <table style="display: table" cellspacing="0">
          <thead>
          <tr>
            <th>
              {{$t('Result.Time')}}
            </th>
            <th>
              {{$t('Result.Player')}}
            </th>
            <th>
              {{$t('Result.Input')}}
            </th>
            <th>
              {{$t('Result.Select')}}
            </th>
            <th>
              {{$t('Result.Result')}}
            </th>
            <th>
              {{$t('Result.Output')}}
            </th>
          </tr>
          </thead>
          <tbody v-if="all.length!=0">
            <tr v-for="item of all" :class="item.output ? 'win':'lose'">
              <td>{{item.time}}</td>
              <td>{{item.player | hiddenAddress}}</td>
              <td>{{item.input}} {{item.token==0?'TRX':'BET'}}</td>
              <td>{{item.select}}</td>
              <td class="result">{{item.result}}</td>
              <td class="prize">{{item.output?Math.floor(item.output * 1000)/1000+' '+(item.token==0?'TRX':'BET'):'-'}}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="!address.base58">
              <td style="text-align: center;color:#C53028" colspan="6">
                {{$t('NoDataForLogin')}}
              </td>
            </tr>
            <tr v-else>
              <td colspan="5" class="spin" v-if="isLoading">
                <i></i>
              </td>
              <td colspan="5" style="text-align: center" v-else>
                {{$t('NoData')}}
              </td>
          </tr>
          </tbody>
        </table>
        <table cellspacing="0">
          <thead>
          <tr>
            <th>
              {{$t('Result.Time')}}
            </th>
            <th>
              {{$t('Result.Player')}}
            </th>
            <th>
              {{$t('Result.Input')}}
            </th>
            <th>
              {{$t('Result.Select')}}
            </th>
            
            <th>
              {{$t('Result.Result')}}
            </th>
            <th>
              {{$t('Result.Output')}}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item of my" :class="item.output ? 'win':'lose'">
            <td>{{item.time}}</td>
            <td>{{item.player | hiddenAddress}}</td>
            <td>{{item.input}} {{item.token==0?'TRX':'BET'}}</td>
            <td>{{item.select}}</td>
            <td class="result">{{item.result}}</td>
            <td class="prize">{{item.output?Math.floor(item.output * 1000)/1000+' '+(item.token==0?'TRX':'BET'):'-'}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getPoint, formatTime } from "@/static/js/Util";
export default {
  name: "Result",
  data() {
    return {
      myLen: 0,
      all: [],
      my: [],
      lucky: [],
      isLoading: true,
      localMy: [],
      maxNum: 30
    };
  },
  computed: {
    ...mapState([
      "contractAddress",
      "contractInstance",
      "address",
      "diceAddress"
    ])
  },
  watch: {
    contractAddress(n) {
      if (window.tronWeb) {
        this.getAllBets(n, this.diceAddress);
      }
    },
    my(n, o) {
      this.$store.commit("SET_MY_BETS", n);
    },
    myLen(n, o) {
      //this.$store.commit("SET_MY_BETS_LENGTH", n);
      //this.$store.commit("SET_RANDOM", this.my[0].result);
    },
    address: {
      deep: true,
      handler(val) {
        let localMy = localStorage.getItem(val.base58);
        if (localMy) {
          let myObj = JSON.parse(localMy);
          this.my = myObj;
          this.localMy = myObj;
        }
      }
    }
  },
  mounted() {},
  methods: {
    tab(index) {
      const tables = this.$refs.output.getElementsByTagName("table");
      const tabItem = this.$refs.tab.getElementsByTagName("a");
      for (let i = 0; i < tabItem.length; i++) {
        if (i === index) {
          tabItem[i].classList.add("focus");
          tables[i].style.display = "table";
        } else {
          tabItem[i].classList.remove("focus");
          tables[i].style.display = "none";
        }
      }
    },
    getAllBets(address, diceAddress) {
      let oDate = new Date();
      let timestamp = oDate.getTime() - 6 * 3600 * 1000;
      setInterval(async () => {
        let txid = [];
        const success = window.tronWeb.getEventResult(
          address,
          timestamp,
          "UserWin",
          0
        );
        const fail = window.tronWeb.getEventResult(
          address,
          timestamp,
          "UserLose",
          0
        );
        const dice_success = window.tronWeb.getEventResult(
          diceAddress,
          timestamp,
          "UserWinDice",
          0
        );
        const dice_fail = window.tronWeb.getEventResult(
          diceAddress,
          timestamp,
          "UserLoseDice",
          0
        );

        Promise.all([success, fail, dice_success, dice_fail]).then(logs => {
          this.isLoading = false;
          let trxLogs = [],
            diceLogs = [];
          trxLogs = logs[0].concat(logs[1]);
          diceLogs = logs[2].concat(logs[3]);
          diceLogs.forEach(v => {
            v.token = 1;
          });
          logs = trxLogs.concat(diceLogs);
          logs.sort((o1, o2) => {
            if (o1.timestamp > o2.timestamp) {
              return -1;
            } else {
              return 1;
            }
          });
          logs = logs.filter(v => {
            if (txid.indexOf(v.transaction) == -1) {
              txid.push(v.transaction);
              return v;
            }
          });
          let a = [],
            b = [];
          logs.forEach(v => {
            const player = window.tronWeb.address.fromHex(
              v.result["_addr"].replace(/^0x/, "41")
            );
            const select = v.result["_point"];
            const result = v.result["_random"];
            const input = window.tronWeb.fromSun(v.result["_amount"]);
            const output = v.result["_W"]
              ? window.tronWeb.fromSun(v.result["_W"])
              : "";
            const time = formatTime(v.timestamp);
            const token = v.token ? v.token : 0;
            const transactionId = v.transaction;
            a.push({
              select,
              result,
              player,
              input,
              output,
              time,
              token,
              transactionId
            });
          });
          this.all = a;
          this.$store.commit("SET_ALLBETLIST", a);
          logs = logs.filter(v => {
            const player = window.tronWeb.address.fromHex(
              v.result["_addr"].replace(/^0x/, "41")
            );
            if (this.address.base58 === player) {
              return v;
            }
          });
          logs.forEach(v => {
            const player = window.tronWeb.address.fromHex(
              v.result["_addr"].replace(/^0x/, "41")
            );
            const select = v.result["_point"];
            const result = v.result["_random"];
            const input = window.tronWeb.fromSun(v.result["_amount"]);
            const output = v.result["_W"]
              ? window.tronWeb.fromSun(v.result["_W"])
              : "";
            const time = formatTime(v.timestamp);
            const timestamp = v.timestamp;
            const token = v.token ? v.token : 0;
            const transactionId = v.transaction;
            b.push({
              select,
              result,
              player,
              input,
              output,
              time,
              token,
              timestamp,
              transactionId
            });
          });
          //this.my = b;
          // 本地存储30条
          this.localMy = JSON.parse(localStorage.getItem(this.address.base58));
          if (this.localMy && this.localMy.length != 0) {
            let arr = b.concat(this.localMy);
            arr = arr.length > this.maxNum ? arr.slice(0, this.maxNum) : arr;

            arr = this.deworming(arr, "transactionId");

            this.my = arr;
          } else {
            this.my = b;
          }
          this.my = this.sort(this.my, "timestamp");
          localStorage.setItem(this.address.base58, JSON.stringify(this.my));
        });
      }, 3000);
    },
    deworming(arr, attr) {
      let transactionIds = [];
      arr = arr.filter((item, index) => {
        if (transactionIds.indexOf(item[attr]) === -1) {
          transactionIds.push(item[attr]);
          return item;
        }
      });

      return arr;
    },
    sort(arr, attr) {
      arr = arr.sort((o1, o2) => {
        if (o1[attr] > o2[attr]) {
          return -1;
        } else {
          return 1;
        }
      });

      return arr;
    }
  }
};
</script>

<style scoped lang="scss">
.result {
  font-size: 0.24rem;
  height: 5.3rem;
  background-image: linear-gradient(0deg, #fad961 0%, #f76b1c 100%);
  box-shadow: 0 4px 24px 0 rgba(52, 7, 7, 0.5);
  border-radius: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  & > .wrap {
    width: 10.68rem;
    height: 4.97rem;
    background: #fffade;
    box-shadow: inset 0 4px 10px 0 rgba(7, 52, 22, 0.2);
    border-radius: 0.1rem;
    .tab {
      position: relative;
      z-index: 1;
      height: 0.6rem;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      font-size: 0.16rem;
      a {
        height: 0.32rem;
        line-height: 0.32rem;
        padding: 0 0.3rem;
        font-size: 0.18rem;
        margin-left: 0.15rem;
        color: #9a6666;
        border-bottom: none;
        border-radius: 1px 0.1rem 0 0;
        transition: all 0.2s ease-in-out;
      }
      a.focus {
        color: #fff;
        background: #c53028;
        border-radius: 0.06rem;
      }
    }
    .output {
      flex: 1;
      overflow: hidden;
      table {
        display: none;
        width: 100%;
        thead {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
        tbody {
          display: block;
          height: 3.7rem;
          overflow-y: scroll;
          &::-webkit-scrollbar {
            width: 0.05rem;
            border-radius: 0.04rem;
          }
          &::-webkit-scrollbar-thumb {
            background: #e2bf81;
            border-radius: 0.04rem;
          }
          tr {
            background: rgba(255, 231, 199, 0.55);
            margin-bottom: 0.05rem;
            &:hover {
              background-color: #ffdea4;
            }
          }
        }
        tr {
          display: table;
          width: 100%;
          table-layout: fixed;
          font-size: 16px;

          td.span {
            height: 2.4rem;
            text-align: center !important;
            .cell {
              display: inline-block;
              width: 0.04rem;
              height: 0.5rem;
              margin-right: 0rem;
              background-color: #b3a6ff;
            }
          }
          th,
          td {
            font-size: 0.14rem;
            color: #310000;
            font-size: 16px;
            height: 0.4rem;
            &:first-child {
              text-align: left;
              width: 2rem;
              padding-left: 0.3rem;
            }
            &:nth-child(2) {
              text-align: left;
            }
            &:last-child,
            &:nth-child(3) {
              //width:.7rem;
            }
            &:last-child {
              padding-right: 0.1rem;
            }
          }
          th {
            height: 0.46rem;
            line-height: 0.46rem;
            font-size: 0.16rem;
            color: #310000;
            font-weight: normal;
          }
          td {
            text-align: center;
            height: 0.36rem;
            line-height: 0.36rem;
          }
          &:last-child {
            td {
              &:first-child {
                border-radius: 0 0 0 0.1rem;
              }
              &:last-child {
                border-radius: 0 0 0.1rem 0;
              }
            }
          }
        }
        .even {
          td {
            //background-color: #3A3366;
          }
        }
      }

      .win {
        td.result {
          // color: #417505;
          background: #fff0df;
          border: 1px solid #417505;
          box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.2);
          border-radius: 0.02rem;
          width: 0.36rem;
          height: 0.25rem;
          font-size: 16px;
          color: #417505;
          margin: 0.07rem auto;
          font-weight: bold;
        }
        td.prize {
          font-size: 16px;
          color: #498701;
        }
      }
      .lose {
        td.result {
          // color: #417505;
          background: #fff0df;
          border: 1px solid #b71c19;
          box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.2);
          border-radius: 0.02rem;
          width: 0.36rem;
          height: 0.25rem;
          font-size: 16px;
          color: #e60815;
          margin: 0.07rem auto;
          font-weight: bold;
        }
        td.prize {
          font-size: 16px;
          color: #e60815;
        }
      }
    }
  }
}
@media screen and (max-width: 1100px) {
  .result {
    .wrap {
      width: 6.5rem;
      height: 4.94rem;
      .tab {
        a {
          font-size: 0.24rem;
        }
      }
      .output {
        table {
          tr {
            th,
            td {
              font-size: 0.24rem;
              &:nth-child(3),
              &:nth-child(4) {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
