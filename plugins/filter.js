import Vue from 'vue'


export default () => {
  Vue.filter('hiddenAddress', value => { return value?value.substr(0,6)+'...'+value.substr(-6):'' });
  Vue.filter('fixed', (value,number) => { return parseFloat(value).toFixed(number) });
}
