import Vue from 'vue';
import moment from 'moment';

Vue.filter('datetime', function (value, fmt) {
  if (!value) {
    return 'N/A';
  }
  return moment(value).format(fmt || 'YYYY-MM-DD HH:mm');
});
