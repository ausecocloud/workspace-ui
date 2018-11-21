import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { cancelled, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import { formatDate } from '../utils';

const FeedMe = require('feedme');


function* fetchFeedTask() {
  try {
    const cancel = axios.CancelToken.source();
    const promise = axios.get('https://ecocloud.org.au/category/notifications/feed/', {
      cancelToken: cancel.token,
    })
      .then(res => res.data)
      .then((body) => {
        // parse feed
        const parser = new FeedMe(false);
        const feed = [];
        // register all event handlers before we push data into the parser
        parser.on('item', (item) => {
          // need to format date string
          let desc = new DOMParser().parseFromString(item.description, 'text/html');
          desc = desc.documentElement.textContent.substring(0, 80);
          const date = formatDate(item.pubdate);
          const feedItem = {
            link: item.link,
            title: item.title,
            date,
            desc,
          };
          feed.push(feedItem);
        });
        // parser.on('end', () => {
        // });
        // write is a blocking call
        parser.write(body);
        // trigger end event handler ....
        // could just do setState here as well
        parser.end();
        return feed;
      });
      // TODO: should be done at other places as well?
      //       If I catch error here, it won't reach the exception handler
      //       below. I could probably re-raise here as well to avoid that.
      // .catch(error => console.error('Fetch feed failed ', error));
    promise[CANCEL] = cancel;
    const feed = yield promise;
    yield put(actions.feedSucceeded(feed));
  } catch (error) {
    yield put(actions.feedFailed(error));
  } finally {
    if (yield cancelled()) {
      yield put(actions.feedFailed('fetchFeedTask cancelled'));
    }
  }
}

export default function* dashboardSaga() {
  // start yourself
  yield takeLatest(actions.FEED_FETCH, fetchFeedTask);
}
