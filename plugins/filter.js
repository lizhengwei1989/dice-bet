import Vue from 'vue'


export default () => {
  Vue.filter('hiddenAddress', value =>  value?value.substr(0,5)+'...'+value.substr(-5):'-');
  Vue.filter('fixed', (value,number) =>  parseFloat(value).toFixed(number) );
  Vue.filter('fromSun', value => window.tronWeb?window.tronWeb.fromSun(value):value/1000000 );
  Vue.filter('numString', (value,s) => {
      const re =/(?=(?!\b)(\d{3})+$)/g;
      return value.replace(re,',')+s;
  });
}
