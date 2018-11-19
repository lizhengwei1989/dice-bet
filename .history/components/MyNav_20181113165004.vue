<template>
  <div class="my-nav">
    <div class="inner">
      <span class="menu iconfont icon-menu" @click="showMenus"></span>
      <a class="logo" href="javascript:window.location.reload();">
        <img :src="require('../assets/images/logo.png')">
      </a>
      
      <div class="nav" ref="nav">
        <!-- 玩法介绍 -->
        <a class="how" @click="dialogHow = true">{{$t('Nav.Rule')}}</a>

        <!-- 邀请 -->
        <a href="javascript:;" @click="inviteDialog.visible = true">{{$t('Nav.Invite')}}</a>



        <!-- 红利 -->
        <a class="how" style="display: none">{{$t('Nav.HongLi')}}</a>

        <!-- vip等级 -->
        <a href="javascript:;" @click="vipDialog.visible = true">{{$t('Nav.Vip')}}</a>

        <!-- 幸运抽奖触发 -->
        <a class="lucky" href="javascript:;" @click="drawDialog = true">{{$t('Nav.LuckyDraw')}}</a>
        <!-- 幸运抽奖组件 -->

        <div class="language-mobile">
          <div class="cell" :class="item.lng === locale?'focus':''" v-for="item of languageGroup" @click="location(item.lng)">
            <img :src="icon?`/images/icon-${item.icon}.png`:''">
            <span>{{item.txt}}</span>
          </div>
        </div>

        <!--弹层 -->

        <!--邀请-->
        <invite v-if="inviteDialog.visible" :inviteDialog="inviteDialog"></invite>
        <!--玩法介绍-->
        <el-dialog
                :title="$t('Rule.title')"
                :visible.sync="dialogHow"
                width="5.8rem"
                custom-class="how-dialog">
          <p v-html="$t('Rule.p1')"></p>
          <p v-html="$t('Rule.p2')"></p>
          <p v-html="$t('Rule.p3')"></p>
          <p v-html="$t('Rule.p4')"></p>
          <p v-html="$t('Rule.p5')"></p>
          <p v-html="$t('Rule.p6')"></p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogHow = false">{{$t('Confirm')}}</el-button>
          </span>
        </el-dialog>
        <!--vip-->
        <vip v-if="vipDialog.visible" :vipDialog="vipDialog"></vip>
        <!--抽奖-->
        <lucky-draw v-if="drawDialog" :visible.sync="drawDialog"></lucky-draw>

      </div>
      <div v-if="address && address.base58" class="account">
        {{address.base58 | hiddenAddress}}
      </div>
      <el-button v-else class="how" style="margin-left:.3rem" @click="$store.commit('SET_DIALOG_LOGIN',true)">
        {{$t('Login')}}
      </el-button>
      <el-dialog
              :title="$t('LoginTipTitle')"
              :visible.sync="dialogLogin"
              width="3.8rem"
              custom-class="how-dialog">
        <p v-html="$t('LoginTipContent')"></p>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$store.commit('SET_DIALOG_LOGIN',false)">{{$t('Confirm')}}</el-button>
          </span>
      </el-dialog>
      <div class="language">
        <img :src="icon?`/images/icon-${icon}.png`:''">
        <span>{{txt}}</span>
        <div class="group">
          <div v-for="item of languages" class="item" @click="location(item.lng)">
            <img :src="`/images/icon-${item.icon}.png`"><span>{{$t(item.txt)}}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Vip from "./Vip";
import Invite from "./Invite";
/* 幸运抽奖 */
import LuckyDraw from "./LuckDraw.vue";
export default {
  name: "MyNav",
  props: ["languageGroup"],
  components: {
    LuckyDraw,
    Vip,
    Invite
  },
  data() {
    return {
      txt: "",
      icon: "",
      show: false,
      dialogHow: false,
      luckyList: [
        { area: "0-100", prize: 0.2 },
        { area: "101-999", prize: 2 },
        { area: "1000-4999", prize: 20 },
        { area: "5000-9999", prize: 200 },
        { area: "10000", prize: 1000 }
      ],
      vipDialog: {
        visible: false,
        data: {
          grade: 0,
          prize: 0
        }
      },
      inviteDialog: {
        visible: false,
        data: {
          prize: "",
          table: []
        }
      },
      drawDialog: false,
      languages: []
    };
  },
  created() {
    let languageGroup = this.languageGroup.filter(v => {
      if (v.lng !== this.locale) {
        return v;
      }
    });
    this.languages = languageGroup;
    this.languageGroup.forEach(v => {
      if (v.lng === this.locale) {
        this.txt = this.$t(v.txt);
        this.icon = v.icon;
      }
    });
  },
  watch: {
    address: {
      handler(n, o) {
        //window.location.reload()
      },
      deep: true
    }
  },
  mounted() {},
  computed: {
    ...mapState(["address", "locale", "dialogLogin"])
  },
  methods: {
    selectLanguage() {
      this.show = !this.show;
    },
    location(lng) {
      window.location = "/" + lng;
    },
    showMenus() {
      const nav = this.$refs.nav;
      if (nav.className.match(/show/g)) {
        nav.classList.remove("show");
      } else {
        nav.classList.add("show");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.my-nav {
  height: 0.6rem;
  border-bottom: 0.03rem solid #242572;
  .inner {
    .menu {
      display: none;
    }
    width: 12rem;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .logo {
      display: flex;
      justify-content: flex-start;
      img {
        width: 1.76rem;
        height: 0.39rem;
      }
    }
    .nav {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      a {
        color: #fff;
        font-size: 0.16rem;
        margin-left: 0.4rem;
        &:nth-child(5) {
          position: relative;
          padding: 0 0.2rem 0 0.36rem;
          height: 0.31rem;
          line-height: 0.31rem;
          background-color: #2babf5;
          border-radius: 0.08rem;
          &:before {
            content: "";
            position: absolute;
            left: 0.15rem;
            width: 0.3rem;
            height: 0.3rem;
            background-image: url("../assets/images/icons/icon-prize.png");
            background-position: left center;
            background-repeat: no-repeat;
            background-size: auto 60%;
          }
        }
      }
      a.lucky {
      }
    }
    .account {
      margin-left: 0.3rem;
      letter-spacing: 0.01rem;
      font-size: 0.16rem;
      display: flex;
      align-items: center;
      color: #fff;
    }
    .language {
      position: relative;
      z-index: 10;
      margin-left: 0.1rem;
      padding-left: 0.1rem;
      padding-right: 0.2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #b3a6ff;
      transition: opacity 0.2s ease-in-out;
      border: 0.02rem solid #383a90;
      height: 0.3rem;
      border-radius: 0.15rem;
      img {
        width: 0.2rem;
      }
      span {
        margin-left: 0.04rem;
      }
      &:hover {
        & > span {
          opacity: 0.5;
        }
        & > .group {
          display: block;
        }
      }
      &:after {
        content: "";
        position: absolute;
        top: 0.12rem;
        right: 0.05rem;
        width: 0;
        height: 0;
        border-top: 0.04rem solid #b3a6ff;
        border-bottom: 0.04rem solid transparent;
        border-left: 0.04rem solid transparent;
        border-right: 0.04rem solid transparent;
      }
      .group {
        display: none;
        position: absolute;
        right: 0;
        top: 0.3rem;
        width: 1.2rem;
        background: #a8abe4;
        padding: 0.01rem;
        border-radius: 0.08rem;
        &:after {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          border-bottom: 0.06rem solid #a8abe4;
          border-left: 0.06rem solid transparent;
          border-top: 0.06rem solid transparent;
          border-right: 0.06rem solid transparent;
          top: -0.12rem;
          right: 0.1rem;
        }
        .item {
          height: 0.36rem;
          padding: 0 0.2rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #131258;
          &:hover {
            background-color: #9599e1;
          }
          &:first-child {
            border-radius: 0.08rem 0.08rem 0 0;
          }
          &:last-child {
            border-radius: 0 0 0.08rem 0.08rem;
          }
        }
      }
    }
    .language-mobile {
      display: none;
    }
  }
}
@media screen and (max-width: 1280px) {
  .my-nav {
    position: fixed;
    z-index: 1000;
    height: 1rem;
    width: 100%;
    background-color: #131258;
    .inner {
      padding: 0 0.2rem;
      width: 100%;
      overflow: hidden;
      justify-content: space-between;
      .menu {
        cursor: pointer;
        display: block;
        font-size: 0.6rem;
      }
      .account {
        margin-left: 0;
        width: 0.8rem;
        text-indent: -1.2rem;
      }
      .nav {
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        height: 0rem;
        position: fixed;
        z-index: 1;
        width: 100%;
        padding: 0 0.4rem;
        left: 0;
        top: 1rem;
        background-color: #131258;
        box-shadow: -0.2px 11px 46px 0px rgba(14, 13, 62, 0.52);
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        a {
          margin-left: 0;
          height: 1rem;
          width: 100%;
          display: flex;
          font-size: 0.28rem;
          align-items: center;
          cursor: pointer !important;
          &:nth-child(1) {
            order: 2;
          }
          &:nth-child(2) {
            order: 3;
          }
          &:nth-child(3) {
            order: 4;
          }
          &:nth-child(4) {
            order: 5;
            border-bottom: 0.01rem solid #39387b;
          }
          &:nth-child(5) {
            margin-top: 0.2rem;
            order: 1;
            width: auto;
            height: 0.6rem;
            font-size: 0.3rem;
            line-height: 0.6rem;
            padding-left: 0.6rem;
            padding-right: 0.2rem;
            background-image: linear-gradient(
                142deg,
                #2babf5 0%,
                #4786f9 50%,
                #6260fd 100%
              ),
              linear-gradient(#de5cff, #de5cff);
            background-blend-mode: normal, normal;
            border-radius: 0.1rem;
            &:before {
              width: 0.4rem;
              height: 0.4rem;
              background-size: auto 100%;
              top: 0.1rem;
            }
          }
        }
        .language-mobile {
          order: 6;
          height: 1rem;
          width: 100%;
          top: 5.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .cell {
            display: flex;
            align-items: center;
            padding: 0.12rem;
            border: 0.01rem solid #39387b;
            border-radius: 0.28rem;
            img {
              width: 0.32rem;
            }
            span {
              margin-left: 0.04rem;
            }
          }
          .cell.focus {
            border-color: #64e1f5;
          }
        }
      }
      .nav.show {
        height: 6rem;
      }
      .language {
        display: none;
      }
    }
  }
}
</style>
