
import config from '../config';
import History from '../component/HistoryContent';
import Video from '../component/Video';

export default {
  init() {
    new History();
    new Video();
  },
}