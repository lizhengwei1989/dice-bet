<template>
  <div class="play">
    <div class="bet">
      <div class="tit green">
        {{$t('Play.Bet.Title')}}
      </div>
      <div class="input-group">
        <div class="input" :data-after="unit">
          <input type="text" :value="stake" @input="handleInput" @blur="handleBlur" name="" id="" />
        </div>
        <div class="percentage" ref="percentage">
          <span @click="handlePercentage('half',0)">1/2</span>
          <span @click="handlePercentage('double',1)">2X</span>
          <span @click="handlePercentage('all',2)">MAX</span>
        </div>
      </div>
      <div class="desc">
        {{$t('Play.Bet.Left')}}&nbsp;<span ref="balance"></span>&nbsp;{{unit}}
      </div>
    </div>
    <div class="win">
      <div class="tit pink">
        {{$t('Play.WinTitle')}}
      </div>
      <div class="input-group">
        <div class="input" :data-after="unit">
          <input type="text" name="" :value="Math.floor(stake * odds * 1000)/1000" readonly />
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
            {{number}}
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
      <div class="row-2">
        <el-slider  :show-tooltip="false" v-model="number"></el-slider>
        <div class="line">
          <div class="cell" data-after="1"></div>
          <div class="cell" data-after="25"></div>
          <div class="cell" data-after="50"></div>
          <div class="cell" data-after="75"></div>
          <div class="cell" data-after="100"></div>
          <div class="win" ref="win">{{random}}</div>
          <div class="lose" ref="lose">{{random}}</div>
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
      odds: 2,
      transactionId:'',
      r: "",
      rolling: null,
      timer: null,
      unit:'TRX'
    };
  },
  watch: {
    dbToken(n){
        if(n==0){
            this.unit = 'TRX';
        }else if(n==1){
            this.unit = 'DICE';
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
        v = Math.min(v, this.limit[this.dbToken].max ,Math.floor(n));
        v = Math.max(v, this.limit[this.dbToken].min);
        this.$store.commit('SET_STAKE',v);
        this.animate("balance", n, o);
    },
    myBetsLength(n, o) {
      console.log(n, o, '------------------')
      if (n != 0) {
        if(o != 0){
            this.r = this.$store.state.random;
        }
        clearInterval(this.timer);
        clearInterval(this.rolling);
        this.disabled = false;
        setTimeout(() => {
          this.r = "";
        }, 3000);
        this.watchBalance();
        //添加交易
        if(this.transactionId){
            if(this.dbToken==0){
                let data = {
                    dappId: this.dapp,
                    contractAddress: this.contractAddress,
                    trxHash: this.transactionId,
                    amount: Number(window.tronWeb.toSun(this.stake)),
                    userAddress: this.address.base58 || "",
                    status: 1
                };
                addTransition(data);
            }
            if(this.r >= this.number){
                this.$refs.lose.style.display="block";
            }else{
                this.$refs.win.style.display="block";
            }
        }
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
      "dapp",
      "dbToken",
      "stake",
      "limit",
      "diceContractInstance"
    ])
  },
  mounted() {
    // 获取邀请人地址
    this.inviteAddress = location.search.indexOf('from') !== -1
                         ? /\?from=(\S+)/.exec(location.search)[1]
                         : '0x00'
    const odds = getOdds(this.number);
    this.my = localStorage.my ? JSON.parse(localStorage.my) : [];
    const tip = document.querySelector(".el-slider__button-wrapper");
    tip.setAttribute("data-before", this.number);
    this.odds = Math.floor(odds * 10000) / 10000;
  },
  methods: {
    changeState(num) {
      const odds = getOdds(num);
      this.odds = Math.floor(odds * 10000) / 10000;
    },
    handleInput(e) {
      let v = e.target.value;
      v = v.replace(/\D/g, "");
      v = Math.min(v, Math.ceil(this.balance), this.limit[this.dbToken].max);
      v = v ? v : '';
      e.target.value = v;
      this.$store.commit('SET_STAKE',v);
    },
    handleBlur(e){
        if(e.target.value < this.limit[this.dbToken].min){
            e.target.value = this.limit[this.dbToken].min;
            this.$store.commit('SET_STAKE',this.limit[this.dbToken].min);
        }
    },
    handlePercentage(p, index) {
      let v;
      const cells = this.$refs["percentage"].getElementsByTagName("span");
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("green");
      }
      cells[index].classList.add("green");
      if(p === 'half'){
          v = this.stake / 2;
      }else if(p ==='double'){
          v = this.stake * 2;
      }else{
          v = this.balance;
      }
      v = Math.min(v, this.limit[this.dbToken].max ,this.balance);
      v = Math.max(v, this.limit[this.dbToken].min);
      v = Math.floor(v);
      this.$store.commit('SET_STAKE',v);
    },
    async roll() {
      if (this.balance < this.limit[this.dbToken].min) {
        this.$message({
            message:this.$t('Msg.BalanceNotEnough'),
            type: 'warning'
        });
        return false;
      }
      if (this.disabled) return false;
      this.disabled = true;
      let transactionId;
      if(this.dbToken==0){
        transactionId = await this.contractInstance
          .bet(this.number, this.inviteAddress)
          .send({
              callValue: window.tronWeb.toSun(this.stake), //投注金额
              shouldPollResponse: false //是否等待响应
          })
          .catch(err => {
              this.disabled = false;
          });
      }else{
        const stake = Number(window.tronWeb.toSun(this.stake));
        console.log(stake);
        transactionId = await this.diceContractInstance
          .diceBet(this.number,stake)
          .send({
            //callValue: window.tronWeb.toSun(this.stake), //投注金额
            shouldPollResponse: false //是否等待响应
          })
          .catch(err => {
            this.disabled = false;
          });
      }

      if (!transactionId) return;
      this.transactionId = transactionId;
      let tmp = 0;
      this.rolling = setInterval(_ => {
        this.r = Math.ceil(Math.random() * 100);
      }, 50);
      this.$refs.win.style.display="none";
      this.$refs.lose.style.display="none";
      this.timer = setInterval(async _ => {
        const res = await window.tronWeb.getEventByTransactionID(transactionId);
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
      let balance = this.dbToken == 0 ? await getBalance(this.address.hex) : (await this.diceContractInstance.getBalanceOf(this.address.hex.replace('/^41/','0x')).call()).toString();
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
          oldVal = oldVal + (newVal - oldVal) / 3;
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
    border: 0.03rem solid #131258;
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
        content:attr(data-after);
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
        background-color: #131258;
        background-image: url("../assets/images/icons/icon-bet.png");
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
        background-color: #131258;
        background-image: url("../assets/images/icons/icon-win.png");
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
    .row-2{
        flex: 1;
        display: flex;
        position: relative;
        border-bottom:0.01rem solid #383a90;
        padding:0 .25rem;
        align-items: center;
        .line {
          position: absolute;
          height: .2rem;
          width: 5.68rem;
          top:.74rem;
          .win,.lose{
            position: absolute;
            width: .54rem;
            height: .24rem;
            line-height: .24rem;
            background-repeat: no-repeat;
            background-position: -0.02rem center;
            background-size:auto 110%;
            border-radius: .11rem;
            padding-left:.22rem;
            top: .06rem;
            margin-top: 0;
            margin-left:-.24rem;
            display: none;
            text-align: center;
          }
          .win{
            background-image: url('../assets/images/win.png');
            left: calc(25% - .15rem);
            background-color: #64e1f6;
          }
          .lose{
            background-image: url('../assets/images/lose.png');
            background-color: #fc495b;
            left: calc(75% - .15rem);
          }
          .cell {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: .3rem;
            font-size: .16rem;
            &:nth-child(1) {
              left: -.05rem;
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
              font-size: .12rem;
              color: #979797;
              content: "";
            }
            &:after {
              color: #fff;
              margin-top: .04rem;
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
@media screen and (max-width:1280px){
  .play{
    .show{
      .row-2{
        .line{
          width: 6.32rem;
        }
      }
    }
  }
}
</style>
