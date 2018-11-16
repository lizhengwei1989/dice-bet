import Vue from 'vue'


export default () => {
  Vue.filter('hiddenAddress', value => { return value?value.substr(0,5)+'...'+value.substr(-5):'' });
  Vue.filter('fixed', (value,number) => { return parseFloat(value).toFixed(number) });
  Vue.filter('fromSun', value => { return window.tronWeb.fromSun(value) });
}
