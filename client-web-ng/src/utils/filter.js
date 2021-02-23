
import dayjs from 'dayjs';

export default {
  datetime(value, fmt) {
    if (!value) {
      return 'N/A';
    }
    return dayjs(value).format(fmt || 'YYYY-MM-DD HH:mm');
  }
} 
