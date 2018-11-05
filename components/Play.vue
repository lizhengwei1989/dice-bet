<template>
  <div class="play">
    <div class="bet">
      <div class="tit green">
        {{$t('Play.Bet.Title')}}
      </div>
      <div class="input-group">
        <div class="input">
          <input type="text" :value="stake" @input="handleInput" name="" id="" />
        </div>
        <div class="percentage" ref="percentage">
          <span @click="handlePercentage(0.25,0)">25%</span>
          <span @click="handlePercentage(0.5,1)">50%</span>
          <span @click="handlePercentage(1,2)">100%</span>
        </div>
      </div>
      <div class="desc">
        {{$t('Play.Bet.Left')}}&nbsp;<span ref="balance"></span>&nbsp;TRX
      </div>
    </div>
    <div class="win">
      <div class="tit pink">
        {{$t('Play.WinTitle')}}
      </div>
      <div class="input-group">
        <div class="input">
          <input type="text" name="" :value="Math.floor(stake * odds * 100)/100" readonly />
        </div>
      </div>
    </div>
    <div class="show">
      <div class="row-1">
        <div class="cell">
          <div class="t">
            {{$t('Play.Less')}}
          </div>
          <div class="c">
            < {{number}}
          </div>
        </div>
        <div class="cell">
          <div class="t">
            {{$t('Play.PayOut')}}
          </div>
          <div class="c">
            {{odds}}X
          </div>
        </div>
        <div class="cell">
          <div class="t">
            {{$t('Play.WinRate')}}
          </div>
          <div class="c">
            {{number-1}}
          </div>
        </div>
      </div>
      <div class="row-2">
        <el-slider  :show-tooltip="false" v-model="number"></el-slider>
        <div class="line">
          <div class="cell" data-after="1"></div>
          <div class="cell" data-after="25"></div>
          <div class="cell" data-after="50"></div>
          <div class="cell" data-after="75"></div>
          <div class="cell" data-after="100"></div>
        </div>
      </div>
      <div class="row-3">
        <button class="roll" @click="roll" :disabled="disabled">
          {{r?r:$t('Play.Roll')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getOdds, getBalance, formatTime } from "@/static/js/Util";
import { addInviteUser, addTransition } from "~/api/user";
export default {
  name: "Play",
  data() {
    return {
      number: 50,
      disabled: false,
      stake: 10,
      odds: 2,
      limit: {
        min: 10,
        max: 10000
      },
      r: "",
      rolling: null,
      timer: null
    };
  },
  watch: {
    number(newVal, oldVal) {
      const tip = document.querySelector(".el-slider__button-wrapper");
      if (newVal <= 2) {
        oldVal = 3;
        this.number = 2;
      } else if (newVal >= 96) {
        this.number = 96;
        oldVal = 96;
      } else {
        this.number = newVal;
      }
      tip.setAttribute("data-before", this.number);
      this.changeState(this.number);
    },
    balance(n, o) {
      this.animate("balance", n, o);
    },
    myBetsLength(n, o) {
      if (o != 0) {
        clearInterval(this.timer);
        clearInterval(this.rolling);
        this.disabled = false;
        this.r = this.$store.state.random;
        setTimeout(() => {
          this.r = "";
        }, 3000);
        this.watchBalance();
      }
    }
  },
  computed: {
    ...mapState([
      "address",
      "balance",
      "contractInstance",
      "random",
      "myBetsLength",
      "contractAddress",
      "dapp"
    ])
  },
  mounted() {
    this.my = localStorage.my ? JSON.parse(localStorage.my) : [];
    const tip = document.querySelector(".el-slider__button-wrapper");
    tip.setAttribute("data-before", this.number);
    this.odds = getOdds(this.number);
  },
  methods: {
    changeState(num) {
      const odds = getOdds(num);
      this.odds = Math.floor(odds * 100) / 100;
    },
    handleInput(e) {
      let v = e.target.value;
      v = v.replace(/\D/g, "");
      v = Math.min(v, Math.ceil(this.balance), this.limit.max);
      v = v < 10 ? 10 : v;
      e.target.value = v;
      this.stake = v;
    },
    handlePercentage(p, index) {
      const cells = this.$refs["percentage"].getElementsByTagName("span");
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("green");
      }
      cells[index].classList.add("green");
      let v = Math.floor(this.balance * p);
      v = Math.min(v, this.limit.max);
      this.stake = v;
    },
    async roll() {
      if (this.stake == 0) {
        this.dialogPleaseInput = true;
        return false;
      }
      if (this.balance < 10) {
        this.dialogNotEnough = true;
        return false;
      }
      if (this.disabled) return false;
      this.disabled = true;
      let transactionId = await this.contractInstance
        .bet(this.number)
        .send({
          callValue: window.tronWeb.toSun(this.stake), //投注金额
          shouldPollResponse: false //是否等待响应
        })
        .catch(err => {
          this.disabled = false;
        });
      if (!transactionId) return;
      let tmp = 0;
      this.rolling = setInterval(_ => {
        this.r = Math.ceil(Math.random() * 100);
      }, 50);
      if (!transactionId) return;
      this.timer = setInterval(async _ => {
        const res = await window.tronWeb.getEventByTransacionID(transactionId);
        if (res.length > 0) {
          //添加交易
          let data = {
            dappId: this.dapp,
            contractAddress: this.contractAddress,
            trxHash: transactionId,
            amount: Number(window.tronWeb.toSun(this.stake)),
            userAddress: this.address.base58 || "",
            status: 1
          };
          addTransition(data);
          // const random = res2[3].toString();
          // clearInterval(rolling);
          // clearInterval(timer);
          //this.saveMyBets(res[0],res2);
        } else {
          tmp++;
          if (tmp == 10) {
            clearInterval(this.timer);
            clearInterval(this.rolling);
            this.disabled = false;
            this.r = "";
            window.alert("Timeout ! You can try again.");
          }
        }
      }, 1000);
    },
    saveMyBets(obj, obj2) {
      const time = formatTime(obj.timestamp);
      const player = window.tronWeb.address.fromHex(
        obj.result["_addr"].replace(/^0x/, "41")
      );
      const select = obj2[2].toString();
      const result = obj2[3].toString();
      const input = window.tronWeb.fromSun(obj.result["_amount"]);
      const output =
        obj2[4].toString() > 0
          ? window.tronWeb.fromSun(obj2[4].toString())
          : "";
      this.my.unshift({ time, player, select, result, input, output });
      const my = this.my.concat([]);
      this.$store.commit("SET_MY_BETS", my);
      localStorage.my = JSON.stringify(my);
    },
    async watchBalance() {
      const balance = await getBalance(this.address.hex);
      this.$store.commit("SET_BALANCE", window.tronWeb.fromSun(balance));
    },
    animate(ref, newVal, oldVal) {
      const dom = this.$refs[ref];
      if (ref == "luckyPoint") {
        const item = dom.getElementsByClassName("leaf");
        for (let i = 0; i < item.length; i++) {
          if (i < newVal) {
            item[i].classList.add("active");
          } else {
            item[i].classList.remove("active");
          }
        }
      } else {
        newVal = parseFloat(newVal);
        oldVal = parseFloat(oldVal);
        const t = setInterval(() => {
          oldVal = oldVal + (newVal - oldVal) / 5;
          oldVal = Math.floor(oldVal * 100) / 100;
          this.$refs[ref].innerHTML = oldVal;
          if (Math.abs(oldVal - newVal) < 0.4) {
            clearInterval(t);
            this.$refs[ref].innerHTML = newVal;
          }
        }, 30);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.green {
  color: #0ff;
}
.pink {
  color: #de5cff;
}
.play {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.2rem 0.25rem 0;
  .tit {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.18rem;
    padding-left: 0.04rem;
  }
  .input-group {
    height: 0.6rem;
    border-radius: 0.1rem;
    border: 0.03rem solid #262c7f;
    .input {
      position: relative;
      padding: 0 0.68rem 0 0.76rem;
      input {
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.22rem;
        text-align: right;
      }
      &:after {
        content: "TRX";
        position: absolute;
        width: 0.68rem;
        height: 100%;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .bet {
    display: flex;
    flex-direction: column;
    .input-group {
      display: flex;
      .input {
        width: 3.74rem;
        background-color: #262c7f;
        background-image: url("../assets/images/icon-bet.png");
        background-repeat: no-repeat;
        background-position: 0.12rem center;
        background-size: auto 70%;
        &:after {
          @extend .green;
        }
      }
      .percentage {
        flex: 1;
        display: flex;
        padding: 0 0.14rem;
        align-items: center;
        justify-content: space-between;
        font-size: 0.18rem;
        span {
          cursor: pointer;
        }
      }
    }
    .desc {
      height: 0.3rem;
      display: flex;
      align-items: center;
      font-size: 0.14rem;
      color: #787ab7;
    }
  }
  .win {
    margin-top: 0.2rem;
    .input-group {
      .input {
        height: 100%;
        background-color: #262c7f;
        background-image: url("../assets/images/icon-win.png");
        background-repeat: no-repeat;
        background-position: 0.12rem center;
        background-size: auto 70%;
        &:after {
          @extend .pink;
        }
      }
    }
  }
  .show {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0.17rem -0.25rem 0;
    .row-1 {
      flex: 1;
      border-top: 0.01rem solid #383a90;
      border-bottom: 0.01rem solid #383a90;
      display: flex;
      .cell {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 0.01rem solid #383a90;
        &:first-child {
          border: none;
        }
        .t {
          font-size: 0.18rem;
          color: #a8abe4;
        }
        .c {
          font-size: 0.32rem;
        }
      }
    }
    .row-2 {
      flex: 1;
      display: flex;
      position: relative;
      border-bottom: 0.01rem solid #383a90;
      padding: 0 0.25rem;
      align-items: center;
      .line {
        position: absolute;
        height: 0.2rem;
        width: 5.68rem;
        top: 0.74rem;
        .cell {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 30px;
          font-size: 0.16rem;
          &:nth-child(1) {
            left: -5px;
          }
          &:nth-child(2) {
            left: calc(25% - 0.15rem);
          }
          &:nth-child(3) {
            left: calc(50% - 0.15rem);
          }
          &:nth-child(4) {
            left: calc(75% - 0.15rem);
          }
          &:nth-child(5) {
            left: calc(100% - 0.2rem);
          }
          &:before {
            font-size: 0.12rem;
            color: #979797;
            content: "";
          }
          &:after {
            color: #fff;
            margin-top: 4px;
            content: attr(data-after);
          }
        }
      }
    }
    .row-3 {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        width: 3rem;
        height: 0.65rem;
        font-size: 0.24rem;
        background-color: #4648bf;
        border-radius: 0.32rem;
        border: none;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
