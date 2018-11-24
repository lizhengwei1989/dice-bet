<template>
  <div class="play">
    <div ref="light" class="light light1"></div>
    <div class="row-1" ref="select">
      <div class="tab focus" @click="tab(0)">
        <img src="../assets/images/icons/icon-trx.png" alt="">
        <span>TRX</span>
      </div>
      <div class="tab" @click="tab(1)">
        <img src="../assets/images/icons/icon-bet.png" alt="">
        <span>BET</span>
      </div>
    </div>
    <div class="row-2">
      <div class="txt" style="color:#af1a1a">
          {{$t('select.t2')}}
          <el-tooltip placement="right">
            <div slot="content" v-html="$t('Resource.Explain')"></div>
            <i class="el-icon-question el-tooltip"></i>
          </el-tooltip>
      </div>
      <div class="bar">
        <div><span>{{$t('Resource.BandWidth')}}</span><span>{{address.base58?bindWidth:'-'}}</span></div>
        <div><span>{{$t('Resource.Energy')}}</span><span>{{address.base58?energy:'-'}}</span></div>
      </div>
    </div>
    <div class="row-3">
      <div class="available">
        {{$t('Play.Bet.Left')}}
      </div>
      <div class="balance-trx">
        <span ref="balance">{{balance}}</span> TRX
      </div>
      <span>&nbsp;/&nbsp;</span>
      <div class="balance-dice">
        <span ref="diceBalance">{{diceBalance}}</span> BET
      </div>
    </div>
    <div class="row-4">
      <div class="input bet" :data-after="unit" :data-before="$t('Play.Bet.Title')">
        <input type="text" :value="stake" @input="handleInput" @blur="handleBlur" />
      </div>
      <div class="input percentage" ref="percentage">
        <span @click="handlePercentage('half',0)">1/2</span>
        <span @click="handlePercentage('double',1)">2X</span>
        <span @click="handlePercentage('all',2)">MAX</span>
      </div>
    </div>
    <div class="row-5">
      <div class="input" :data-before="$t('Play.WinTitle')" :data-after="unit">
        <input type="text" :value="Math.ceil(stake * odds * 1000)/1000" readonly />
      </div>
      <div class="input" v-show="dbToken==0" :data-before="$t('Play.MinTitle')" data-after="BET">
        <input type="text" :value="stake/minStage.rate" readonly />
      </div>
    </div>
    <div class="row-6">
      <el-slider :show-tooltip="false" v-model="number"></el-slider>
      <div class="line">
        <div class="cell" data-after="1"></div>
        <div class="cell" style="display: none" data-after="25"></div>
        <div class="cell" data-after="50"></div>
        <div class="cell" style="display: none" data-after="75"></div>
        <div class="cell" data-after="100"></div>
        <div class="win" ref="win">{{random}}</div>
        <div class="lose" ref="lose">{{random}}</div>
      </div>
    </div>
    <div class="row-7">
      <div class="cell">
        <div class="t">
          {{$t('Play.Less')}}
        </div>
        <div class="c">
          <{{number}}
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
          {{number-1}}%
        </div>
      </div>
    </div>
    <div class="row-8">
      <div class="gap" ref="gap">{{gap}}</div>
      <a href="javascript:;" class="roll" @click="roll" :disabled="disabled">
        {{r?r:$t('Play.Roll')}}
      </a>
      <div class="auto-bet" style="display:block">
        <el-switch v-model="isAuto" active-color="#C53028" @change="handleAutoBet">
        </el-switch>
        <span>{{$t('AutoBet.txt')}}</span>
        <el-tooltip placement="right">
          <div slot="content" v-html="$t('AutoBet.explain')"></div>
          <i class="el-icon-question el-tooltip"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getOdds, getBalance, formatTime } from "@/static/js/Util";
import { addInviteUser, addTransition } from "~/api/user";
import { animate } from "~/static/js/Animate";
export default {
  name: "Play",
  data() {
    return {
      isClick:false,
      number: 50,
      disabled: false,
      odds: 2,
      transactionId: "",
      r: "",
      rolling: null,
      timer: null,
      unit: "TRX",
      gap: "0",
      isAuto: false
    };
  },
  watch: {
    myBets: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.disabled) {
          if (oldVal.length == 0 && newVal.length === 1) {
            this.clearRoll(newVal[0].result);
            return;
          }
          if (newVal.length > 1) {
            let newTimeTemp = newVal[0].timestamp;
            let oldTimeTemp = oldVal[0].timestamp;
            if (newTimeTemp > oldTimeTemp) {
              this.clearRoll(newVal[0].result);
            }
          }
        }
      }
    },
    dbToken(n) {
      if (n == 0) {
        this.unit = "TRX";
      } else if (n == 1) {
        this.unit = "BET";
      }
    },
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
      let v = this.stake;
      v = Math.min(v, this.limit[this.dbToken].max, Math.floor(n));
      v = Math.max(v, this.limit[this.dbToken].min);
      this.$store.commit("SET_STAKE", v);
      animate(this.$refs["balance"], Number(n).toFixed(3), o);
    },
    diceBalance(n, o) {
      let v = this.stake;
      v = Math.min(v, this.limit[this.dbToken].max, Math.floor(n));
      v = Math.max(v, this.limit[this.dbToken].min);
      this.$store.commit("SET_STAKE", v);
      animate(this.$refs["diceBalance"], Number(n).toFixed(3), o);
    },
    address(n){
      this.watchResource(n);
    }
  },
  computed: {
    ...mapState([
      "address",
      "balance",
      "contractInstance",
      "random",
      "myBetsLength",
      "myBets",
      "contractAddress",
      "dapp",
      "dbToken",
      "stake",
      "limit",
      "diceContractInstance",
      "diceBalance",
      "bindWidth",
      "energy",
      "minStage"
    ])
  },
  mounted() {
    window.roll = this.roll;
    // 获取邀请人地址
    this.inviteAddress =
      location.search.indexOf("from") !== -1
        ? /\?from=(\S+)/.exec(location.search)[1]
        : "0x00";
    const odds = getOdds(this.number);
    this.my = localStorage.my ? JSON.parse(localStorage.my) : [];
    const tip = document.querySelector(".el-slider__button-wrapper");
    tip.setAttribute("data-before", this.number);
    this.odds = Math.floor(odds * 10000) / 10000;

  },
  methods: {
    async getResource(address) {
      if(address.base58){
          let resource, energy, bindWidth;
          resource = await window.tronWeb.trx.getAccountResources(address.base58);
          energy = resource.EnergyUsed
              ? resource.EnergyLimit - resource.EnergyUsed
              : 0;
          bindWidth = await window.tronWeb.trx.getBandwidth(this.address.base58);
          this.$store.commit("SET_BAND_WIDTH", bindWidth);
          this.$store.commit("SET_ENERGY", energy);
      }
    },
    watchResource(address) {
      setInterval(async _ => {
        this.getResource(address);
      }, 3000);
    },
    async tab(dbToken) {
      if (dbToken == this.dbToken) {
        return false;
      } else {
        const tabs = this.$refs.select.getElementsByClassName("tab");
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove("focus");
        }
        tabs[dbToken].classList.add("focus");
        this.$store.commit("SET_DB_TOKEN", dbToken);
      }
    },
    clearRoll(res) {
      this.watchBalance();
      clearInterval(this.timer);
      clearInterval(this.rolling);
      this.r = res;
      this.$store.commit("SET_RANDOM", res);
      setTimeout(() => {
        this.r = "";
        this.disabled = false;
        if (this.isAuto) {
          this.roll();
        }else{
          //this.disabled = true;
        }
      }, 3000);
      //添加交易
      if (this.transactionId) {
        if (this.r >= this.number) {
          this.$refs.lose.style.display = "block";
        } else {
          this.$refs.win.style.display = "block";
        }
      }
    },
    changeState(num) {
      const odds = getOdds(num);
      this.odds = Math.floor(odds * 10000) / 10000;
    },
    handleInput(e) {
      const balance = this.dbToken == 0 ? this.balance : this.diceBalance;
      let v = e.target.value;
      v = v.replace(/\D/g, "");
      v = Math.min(v, Math.ceil(balance), this.limit[this.dbToken].max);
      v = v ? v : "";
      e.target.value = v;
      this.$store.commit("SET_STAKE", v);
    },
    handleBlur(e) {
      if (e.target.value < this.limit[this.dbToken].min) {
        e.target.value = this.limit[this.dbToken].min;
        this.$store.commit("SET_STAKE", this.limit[this.dbToken].min);
      }
    },
    handlePercentage(p, index) {
      let v;
      const balance = this.dbToken == 0 ? this.balance : this.diceBalance;
      const cells = this.$refs["percentage"].getElementsByTagName("span");
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("green");
      }
      cells[index].classList.add("green");
      if (p === "half") {
        v = this.stake / 2;
      } else if (p === "double") {
        v = this.stake * 2;
      } else {
        v = this.balance;
      }
      v = Math.min(v, this.limit[this.dbToken].max, balance);
      v = Math.max(v, this.limit[this.dbToken].min);
      v = Math.floor(v);
      this.$store.commit("SET_STAKE", v);
    },
    handleAutoBet() {
      if (this.isAuto){
        this.roll();
      }
    },
    async roll() {
      if (!this.address.base58) {
        this.$store.commit("SET_DIALOG_LOGIN", true);
        return false;
      }
      if (
        (this.dbToken == 0 && this.balance < this.limit[0].min) ||
        (this.dbToken == 1 && this.diceBalance < this.limit[1].min)
      ) {
        this.$message({
          message: this.$t("Msg.BalanceNotEnough"),
          type: "warning"
        });
        return false;
      }
      if (this.disabled) return false;
      this.disabled = true;
      let transactionId;
      if (this.dbToken == 0) {
        transactionId = await this.contractInstance
          .bet(this.number)
          .send({
            callValue: window.tronWeb.toSun(this.stake), //投注金额
            shouldPollResponse: false //是否等待响应
          })
          .catch(err => {
            console.log(err);
            this.disabled = false;
          });
      } else {
        const stake = Number(window.tronWeb.toSun(this.stake));
        transactionId = await this.diceContractInstance
          .diceBet(this.number, stake)
          .send()
          .catch(err => {
            console.log(err);
            this.disabled = false;
          });
      }

      if (!transactionId) return;
      this.transactionId = transactionId;
      let tmp = 0;
      this.rolling = setInterval(_ => {
        this.r = Math.ceil(Math.random() * 100);
        const c = this.$refs.light.className;
        this.$refs.light.className = c.match(/1/)
          ? c.replace("1", "2")
          : c.replace("2", "1");
      }, 100);
      this.$refs.win.style.display = "none";
      this.$refs.lose.style.display = "none";
      this.timer = setInterval(async _ => {
        const res = await window.tronWeb.getEventByTransactionID(transactionId);
        //console.log(res);
        if (res.length > 0) {
          // const random = res2[3].toString();
          // clearInterval(rolling);
          // clearInterval(timer);
          //this.saveMyBets(res[0],res2);
        } else {
          tmp++;
          if (tmp == 30) {
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
      let gap;
      const dom = this.$refs["gap"];
      const balance = await getBalance(this.address.hex);
      const diceBalance = this.address.hex ? (await this.diceContractInstance.getBalanceOf(this.address.hex.replace("/^41/", "0x")).call()).toString() : 0;
      if (this.dbToken == 0) {
        gap = window.tronWeb.fromSun(balance) - this.balance;
      } else {
        gap = window.tronWeb.fromSun(diceBalance) - this.diceBalance;
      }
      gap = Math.ceil(gap * 100) / 100;
      this.gap = gap > 0 ? "+" + gap : gap;
      dom.classList.add("animate");
      dom.addEventListener("animationend", () => {
        dom.classList.remove("animate");
      });

      this.$store.commit("SET_BALANCE", window.tronWeb.fromSun(balance));
      this.$store.commit("SET_DICE_BALANCE",window.tronWeb.fromSun(diceBalance));
    },
    animate(ref, newVal, oldVal) {
      const dom = this.$refs[ref];
      newVal = parseFloat(newVal);
      oldVal = parseFloat(oldVal);
      const t = setInterval(() => {
        oldVal = oldVal + (newVal - oldVal) / 3;
        oldVal = Math.floor(oldVal * 100) / 100;
        dom.innerHTML = oldVal;
        if (Math.abs(oldVal - newVal) < 0.4) {
          clearInterval(t);
          dom.innerHTML = newVal;
        }
      }, 30);
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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.25rem 0.4rem;
  z-index: 0;
  font-size: 14px;
  .light {
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    background-position:center center;
    background-size: 97% 98%;
    z-index: -1;
    background-repeat: no-repeat;
  }
  .light1 {
    background-image: url("../assets/images/new/light1.png");
  }
  .light2 {
    background-image: url("../assets/images/new/light2.png");
  }
  .input {
    height: 0.4rem;
    position: relative;
    background: #ffffff;
    border: 1px solid #310000;
    border-radius: 2px;
    font-size: 16px;
    padding: 0 0.1rem;
    input {
      width: 100%;
      height: 100%;
      border: none;
      background: none;
      padding-right: 0.36rem;
      outline: none;
      text-align: right;
      font-size: 16px;
      color: #b71c19;
    }
    &:before {
      width: 0.57rem;
      height: 100%;
      padding-left: 0.24rem;
      content: attr(data-before);
      position: absolute;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content:flex-start;
      background-repeat: no-repeat;
      background-position: left center;
    }
    &:after {
      position: absolute;
      top: 0;
      right: 0.1rem;
      height: 100%;
      display: flex;
      align-items: center;
      z-index: 1;
      content: attr(data-after);
      color: #b71c19;
    }
  }
  .row-1 {
    height: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .tab {
      width: 1.02rem;
      height: 0.32rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #e58700;
      box-shadow: 0 2px 4px 0 rgba(117, 4, 0, 0.2);
      border-radius: 6px;
      margin: 0 0.15rem;
      color: #fff;
      img {
        width: 0.22rem;
        height: 0.22rem;
      }
      span {
        margin-left: 0.04rem;
      }
    }
    .tab.focus {
      background-color: #bc0e05;
    }
  }
  .row-2 {
    width: 100%;
    height: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    .txt {
      color: #310000;
    }
    .bar {
      font-size: 12px;
      margin-left: 0.08rem;
      flex: 1;
      background: #ffe7c7;
      border: 1px solid #310000;
      border-radius: 2px;
      height: 0.2rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      & > div {
        flex: 1;
        display: flex;
        padding: 0 0.1rem;
        height: 0.12rem;
        align-items: center;
        &:last-child {
          border-left: 1px solid #8f6300;
        }
        span {
          color: #310000;
        }
      }
    }
  }
  .row-3 {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: #b71c19;
    .available {
      margin-right: 0.1rem;
    }
    .balance-trx,.balance-dice{
      font-weight: bold;
      color: #498701;
    }
  }
  .row-4 {
    height: 0.52rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    .bet {
      flex: 1;
      &:before {
        background-image: url("../assets/images/icons/icon-input-trx.png");
      }
    }
    .percentage {
      margin-left: 0.06rem;
      width: 1.7rem;
      color: #c53028;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &:before {
        display: none;
      }
      span {
        cursor: pointer;
        border: 1px solid #c53028;
        width: 0.44rem;
        height: 0.26rem;
        border-radius: 0.02rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      span.green {
        background-color: #c53028;
        color: #fff;
      }
    }
  }
  .row-5 {
    height: 0.52rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    & > div {
      flex:1;
      &:first-child {
        &:before {
          background-image: url("../assets/images/icons/icon-input-win.png");
        }
      }
      &:last-child {
        &:before {
          background-image: url("../assets/images/icons/icon-input-min.png");
        }
        margin-left: 0.06rem;
      }
    }
  }
  .row-6 {
    width: 100%;
    display: flex;
    height: 1.2rem;
    position: relative;
    align-items: center;
    .line {
      position: absolute;
      height: 0.2rem;
      width: 100%;
      top: 0.72rem;
      .win,
      .lose {
        position: absolute;
        width: 0.54rem;
        height: 0.24rem;
        color: #fff;
        line-height: 0.24rem;
        background-repeat: no-repeat;
        background-position: -0.02rem center;
        background-size: auto 110%;
        border-radius: 0.11rem;
        padding-left: 0.22rem;
        top: 0.06rem;
        margin-top: 0;
        margin-left: -0.24rem;
        display: none;
        text-align: center;
      }
      .win {
        background-image: url("../assets/images/win.png");
        left: calc(25% - 0.15rem);
        background-color: #64e1f6;
      }
      .lose {
        background-image: url("../assets/images/lose.png");
        background-color: #fc495b;
        left: calc(75% - 0.15rem);
      }
      .cell {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 0.3rem;
        font-size: 0.16rem;
        &:nth-child(1) {
          left: -0.05rem;
        }
        &:nth-child(2) {
          left: calc(25% - 0.15rem);
        }
        &:nth-child(3) {
          left: calc(50% - 0.15rem);
        }
        &:nth-child(4) {
          left: calc(75% - 0.15rem);
          display: none;
        }
        &:nth-child(5) {
          left: calc(100% - 0.3rem);
        }
        &:before {
          font-size: 0.12rem;
          color: #979797;
          content: "";
        }
        &:after {
          font-size: 0.13rem;
          color: #666;
          margin-top: 0.04rem;
          content: attr(data-after);
        }
      }
    }
  }
  .row-7 {
    position: relative;
    z-index: -2;
    width: 100%;
    height: 0.4rem;
    display: flex;
    background: #ffe7c7;
    border: 1px solid #310000;
    border-radius: 2px;
    align-items: center;
    .cell {
      height: 0.2rem;
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #310000;
      border-left: 1px solid #c53028;
      &:first-child {
        border: none;
      }
      .t {
        font-size: 0.12rem;
      }
      .c {
        font-size: 22px;
        color: #b71c19;
        margin-left: 0.04rem;
      }
    }
  }
  .row-8 {
    width: 100%;
    position: relative;
    margin-bottom: 0.1rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .gap {
      position: absolute;
      z-index: -1;
      width: 1.8rem;
      height: 0.5rem;
      text-align: center;
      font-size: 0.3rem;
      font-weight: bold;
      line-height: 0.5rem;
      top: 50%;
      left: 50%;
      margin-left: -0.9rem;
      margin-top: -0.25rem;
      opacity: 0;
      color: #c53028;
    }
    .gap.animate {
      animation: show 1s ease-in-out;
    }
    @keyframes show {
      50% {
        top: 0;
        opacity: 1;
      }
      100% {
        top: -50%;
        opacity: 0;
      }
    }
    a.roll {
      background-image:linear-gradient(-180deg, #faa961 1%, #f7541c 100%);
      box-shadow:0 .04rem .09rem 0 rgba(117,4,0,0.20);
      border-radius:.25rem;
      width:1.56rem;
      height:.50rem;
      color: #fff;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auto-bet {
      position: absolute;
      right: 0;
    }
  }
}
@media screen and (max-width: 1100px) {
  .play {
    width: 100%;
    height: 100%;
    padding:.5rem 0.4rem;
    .light {
      left:0;
      top:0;
      width: 100%;
      height: 100%;
      background-position:center center;
      background-size: 97% 98%;
    }
    .row-1 {
      height: .7rem;
      .tab {
        width: 1.2rem !important;
        height: 0.5rem !important;
      }
    }
    .row-2 {
      height: 0.8rem;
      .bar {
        height: 0.5rem;
      }
    }
    .row-3 {
      height: .48rem;
      font-size: 12px;
      align-items: center;
    }
    .row-4 {
      height: 0.8rem;
      .percentage {
        width: 2.5rem;
        span {
          width: 0.7rem;
          height: 0.4rem;
        }
      }
    }
    .row-5{
      height: 0.8rem;
    }
    .row-6{
      height: 1.6rem;
      .line{
        top:1rem;
        .cell{}
        .lose,.win{
          width: .8rem;
          height: .3rem;
        }
      }
    }
    .row-7{
      font-size: 12px;
      height: 1rem;
      padding:.1rem 0;
      .cell{
        flex-direction: column;
      }
    }
    .row-8{
      flex-direction: column;
      .auto-bet{
        position: relative;
        margin-top: .14rem;
      }
      a.roll{
        font-size: 18px;
        width: 2.8rem;
        height: .8rem;
        border-radius:.75rem;
      }
    }
    .input {
      height: 0.6rem;
      font-size: 14px;
      input {
        font-size: 14px;
        padding-right: 0.6rem;
      }
      &:before {
        width: 1rem;
        padding-left: 0.4rem;
        background-size: auto 60%;
      }
    }
  }
}
</style>
