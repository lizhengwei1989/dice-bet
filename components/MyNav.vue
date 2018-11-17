<template>
  <div class="my-nav">
      <span class="menu iconfont icon-menu" @click="showMenus"></span>
      <!--<a class="logo" href="javascript:window.location.reload();">-->
        <!--<img :src="require('../assets/images/logo.png')">-->
      <!--</a>-->
      <div class="nav" ref="nav">
        <!-- 玩法介绍 -->
        <a href="javascript:;" @click="ruleDialog.visible = true">{{$t('Nav.Rule')}}</a>

        <!-- 邀请 -->
        <a href="javascript:;" @click="()=>{if(this.address.base58){inviteDialog.visible = true}else{this.$store.commit('SET_DIALOG_LOGIN',true)}}">{{$t('Nav.Invite')}}</a>



        <!-- 红利 -->
        <a class="how" style="display: none">{{$t('Nav.HongLi')}}</a>

        <!-- vip等级 -->
        <a href="javascript:;" @click="()=>{if(this.address.base58){vipDialog.visible = true}else{this.$store.commit('SET_DIALOG_LOGIN',true)}}">{{$t('Nav.Vip')}}</a>

        <!-- 幸运抽奖触发 -->
        <a class="lucky" href="javascript:;" @click="()=>{if(this.address.base58){luckyDialog.visible = true}else{this.$store.commit('SET_DIALOG_LOGIN',true)}}">{{$t('Nav.LuckyDraw')}}</a>
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
        <rule v-if="ruleDialog.visible" :ruleDialog="ruleDialog"></rule>
        <!--vip-->
        <vip v-if="vipDialog.visible" :vipDialog="vipDialog"></vip>
        <!--抽奖-->
        <lucky-draw v-if="luckyDialog.visible" :luckyDialog="luckyDialog"></lucky-draw>

      </div>
      <div class="right">
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
          <!--<img :src="icon?`/images/icon-${icon}.png`:''">-->
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
import Rule from "./Rule";
import Invite from "./Invite";
/* 幸运抽奖 */
import LuckyDraw from "./LuckDraw.vue";
export default {
  name: "MyNav",
  props: ["languageGroup"],
  components: {
    LuckyDraw,
    Vip,
    Invite,
    Rule
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
      ruleDialog: {
          visible: false,
          data: {
              prize: "",
              table: []
          }
      },
      luckyDialog: {
          visible: false,
          data: {
              prize: "",
              table: []
          }
      },
      languages:[]
    };
  },
  created() {
    let languageGroup = this.languageGroup.filter(v=>{
        if(v.lng  !== this.locale){
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
      if (lng === "en") {
          window.location = "/";
      } else {
          window.location = "/" + lng;
      }
    },
    showMenus(e){
        const nav = this.$refs.nav;
        const p = e.target.parentNode;
        if(nav.className.match(/show/g)){
            nav.classList.remove('show');
            setTimeout(()=>{
                p.style.zIndex = '1001';
            },300);
        }else{
            nav.classList.add('show');
            p.style.zIndex = '10000';
        }
    }
  }
};
</script>

<style scoped lang="scss">
.my-nav {
  position: relative;
  z-index:9999;
  height: 0.8rem;
  width: 100%;
  padding:0 0.4rem;
  .menu{display: none}
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom:.2rem solid transparent;
  /*&:after{
    position: absolute;
    width: 100%;
    content:'';
    height: .2rem;
    bottom: -0.2rem;
    left: 0;
    background-image: url('../assets/images/new/border-bg.png');
    background-position: center center;
  }*/
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
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    a{
      color: #FFEAC7;
      font-size: .16rem;
      margin-left:.4rem;
      &:nth-child(5){
        position: relative;
        padding:0 .2rem 0 .36rem;
        height: .31rem;
        line-height: .31rem;
        background-color: #F5A623;
        border-radius: .08rem;
        &:before{
          content: '';
          position: absolute;
          left:0.15rem;
          width: .3rem;
          height: .3rem;
          background-image: url('../assets/images/icons/icon-prize.png');
          background-position:left center;
          background-repeat:no-repeat;
          background-size:auto 60%;

        }
      }
    }
    a.lucky{}
  }
  .right{
    display: flex;
    flex-direction: row;
    .account {
      order:2;
      margin-left: 0.3rem;
      letter-spacing: 0.01rem;
      font-size: 0.16rem;
      display: flex;
      align-items: center;
      color: #FFEAC7;
      text-decoration: underline;
    }
    .language {
      order:1;
      position: relative;
      z-index: 10;
      margin-left: .1rem;
      padding-left: .1rem;
      padding-right: .2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #FFEAC7;
      transition: opacity 0.2s ease-in-out;
      height: .3rem;
      img{
        width: .2rem;
      }
      span{
        margin-left: .04rem;
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
        border-top: 0.04rem solid #FFEAC7;
        border-bottom: 0.04rem solid transparent;
        border-left: 0.04rem solid transparent;
        border-right: 0.04rem solid transparent;
      }
      .group {
        display: none;
        position: absolute;
        right: 0;
        top: .3rem;
        width: 1.2rem;
        background:#a8abe4;
        padding:0.01rem;
        border-radius:.08rem;
        &:after{
          content:'';
          width: 0;
          height: 0;
          position: absolute;
          border-bottom:.06rem solid #a8abe4;
          border-left:.06rem solid transparent;
          border-top:.06rem solid transparent;
          border-right:.06rem solid transparent;
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
            border-radius: .08rem .08rem 0 0;
          }
          &:last-child {
            border-radius:0 0 .08rem .08rem;
          }
        }
      }
    }
  }

  .language-mobile{
    display: none;
  }
}
@media screen and (max-width:1100px){
  .my-nav{
    padding-left:.2rem;
    padding-right:0;
    position: relative;
    z-index:1001;
    height: 1rem;
    width: 7.5rem;
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    border:none;
      .menu{
        cursor: pointer;
        display: block;
        font-size: .6rem;
        color: #FFEAC7;
        position: relative;
      }
      .account{
        margin-left: 0;
        width: .8rem;
        text-indent:-1.2rem;
      }
      .nav{
        transition:all .3s ease-in-out;
        overflow:hidden;
        height: 0rem;
        position: absolute;
        z-index:1002;
        width: 7.5rem;
        padding:0 .4rem;
        left:0;
        top: 1rem;
        background-color: #7a1011;
        box-shadow: -0.2px 11px 46px 0px
        rgba(14, 13, 62, 0.52);
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        a{
          margin-left: 0;
          height: 1rem;
          width: 100%;
          display: flex;
          font-size: .28rem;
          align-items: center;
          cursor: pointer !important;
          &:nth-child(1){
            order:2;
          }
          &:nth-child(2){
            order:3;
          }
          &:nth-child(3){
            order:4;
          }
          &:nth-child(4){
            order:5;
            border-bottom:0.01rem solid #FFEAC7;
          }
          &:nth-child(5){
            margin-top: .2rem;
            order:1;
            width: auto;
            height: .6rem;
            font-size: .3rem;
            line-height: .6rem;
            padding-left:.6rem;
            padding-right:.2rem;
            background-image: linear-gradient(142deg,
                    #2babf5 0%,
                    #4786f9 50%,
                    #6260fd 100%),
            linear-gradient(
                            #de5cff,
                            #de5cff);
            background-blend-mode: normal,
            normal;
            border-radius: .1rem;
            &:before{
              width: .4rem;
              height: .4rem;
              background-size:auto 100%;
              top: .1rem;
            }
          }
        }
        .language-mobile{
          order:6;
          height: 1rem;
          width: 100%;
          top:5.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .cell{
            display: flex;
            align-items: center;
            padding:.12rem;
            border:.01rem solid #FFEAC7;
            color: #FFEAC7;
            border-radius:.28rem;
            img{
              width: .32rem;
            }
            span{
              margin-left: .04rem;
            }
          }
          .cell.focus{
            border-color:#D81734;
            color: #D81734;
          }
        }
      }
      .nav.show{
        height: 4.8rem;
      }
      .language{
        display: none !important;
      }
  }
}
</style>
