import { takeLatest, put, call } from "redux-saga/effects";
import { startTypes } from "../reducers/startReducer";
import { fetchCategory, fetchList } from './api/startApi';

export function* fetchCategorySaga({ payload }) {
  console.log('fetchCategorySaga')
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
  console.log('fetchShopListSaga');
  const response = yield call(fetchList, payload);
  if (response.data) {
    console.log('fetchShopList 있음 >>', response.data);
    yield put({
      type: startTypes.FETCH_SHOP_LIST,
      payload: response.data,
    });
  } else {
    console.log('fetchShopList >>', response.data);
  }
}

export default function* startSaga() {
  yield takeLatest(startTypes.FETCH_SHOP_CATEGORY, fetchCategorySaga);
  yield takeLatest(startTypes.FETCH_SHOP_LIST, fetchShopListSaga);
}