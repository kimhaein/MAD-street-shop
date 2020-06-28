import { takeEvery, takeLatest, put, call } from "redux-saga/effects";
import { startTypes } from "../reducers/startReducer";
import { fetchCategory, fetchList, fetchEtc } from './api/startApi';
import { isEmpty } from "../util/gm";


export function* fetchCategorySaga({ payload }) {
  const response = yield call(fetchCategory, payload);
  if (response.data) {
    yield put({
      type: startTypes.SET_SHOP_CATEGORY,
      payload: response.data,
    });
  } else {
    console.log(response);
  }
}

export function* fetchShopListSaga({ payload }) {
  yield put({
    type: startTypes.SET_SHOP_LIST,
    name: payload.name,
    payload: [],
  });
  const response = yield call(fetchList, payload);
  if (response.data || response.statusText === "No Content") {
    yield put({
      type: startTypes.SET_SHOP_LIST,
      name: payload.name,
      payload: isEmpty(response.data) ? "No Content" : response.data,
    });
  } else {
    console.log('fetchShopList >>', response.data);
  }
}

export function* fetcEtcListSaga({ payload }) {
  const response = yield call(fetchEtc, payload);
  if (response.data) {
    yield put({
      type: startTypes.SET_ETC_LIST,
      name: payload.type,
      payload: response.data,
    });
  } else {
    console.log('not yet');
  }
}

export default function* startSaga() {
  yield takeLatest(startTypes.FETCH_SHOP_CATEGORY, fetchCategorySaga);
  yield takeLatest(startTypes.FETCH_SHOP_LIST, fetchShopListSaga);
  yield takeEvery(startTypes.FETCH_ETC_LIST, fetcEtcListSaga);
}