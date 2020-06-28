import { takeLatest, put, call } from "redux-saga/effects";
import { userTypes, userApiTypes } from "../reducers/userReducer";
import { login, logout, fetchWhoami, postSignUpUser, postSignUpOwner, putImgUpload, putUser, deleteUser, putOwner, fetchFavoritesList, postFavoritesList, delFavoritesList } from './api/userApi';
import { localStorageRemove } from '../util/LocalStorage';

/**
 * 앱 로그인
 */
export function* loginSaga({ payload }) {
  const response = yield call(login, payload);
  if (response.data) {
    if (response.data.isUser) {
      yield fetchWhoamiSaga({ token: payload.token, userId: response.data.userId })
    }

    yield put({
      type: userTypes.SET_LOGIN,
      payload: {
        isLogin: true,
        isUser: response.data.isUser,
        userId: response.data.userId,
      },
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  } else {
    yield put({
      type: userTypes.SET_LOGIN,
      payload: {
        isLogin: false,
        userId: ''
      },
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  }
}

/**
 * 앱 로그인
 */
export function* logoutSaga({ payload }) {
  const response = yield call(logout, payload);
  if (response.data) {
    yield put({ type: userTypes.SET_USER_RESET });
  } else {
    console.log(response);
  }
}

/**
 * 카카오 사용자 회원가입
 */
export function* postSignUpUserSaga({ payload }) {
  const response = yield call(postSignUpUser, payload);
  if (response.data) {
    yield fetchWhoamiSaga({ userId: payload.userId })
    yield put({
      type: userTypes.SET_SIGNUP,
      payload: {
        isLogin: true,
        isUser: true,
      },
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    })
  } else {
    yield put({
      type: userTypes.SET_SIGNUP,
      payload: {
        isLogin: false,
        isUser: false,
      },
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    })
  }

}

/**
 * 카카오 사용자 회원수정
 */
export function* putUserSaga({ payload }) {
  const response = yield call(putUser, payload);
  if (response.data) {
    yield fetchWhoamiSaga({ userId: payload.userId })
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  } else {
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  }
}

/**
 * 카카오 사장님 회원가입 이미지 업로드
 */
export function* postSignUpImgOwnerSaga(data) {
  const response = yield call(putImgUpload, data);
  if (response.data) {
    yield fetchWhoamiSaga({ userId: data.userId })
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  } else {
    yield put({
      type: userTypes.SET_SIGNUP,
      payload: {
        isLogin: false,
        isUser: ''
      },
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  }
}

/**
 * 카카오 사장님 회원가입
 */
export function* postSignUpOwnerSaga({ payload }) {
  const response = yield call(postSignUpOwner, payload);
  if (response.data) {
    yield put({
      type: userTypes.SET_SIGNUP,
      payload: {
        isLogin: true,
        isUser: true,
      },
    });
    const data = { files: payload.files, userId: payload.userId, shopId: response.data.shop._id }
    yield postSignUpImgOwnerSaga(data)
  } else {
    console.log(response);
  }
}
/**
 * 카카오 사장님 회원수정
 */
export function* putOwnerSaga({ payload }) {
  const response = yield call(putOwner, payload);
  if (response.data) {
    const data = { files: payload.files, userId: payload.userId, shopId: response.data._id }
    yield postSignUpImgOwnerSaga(data)
  } else {
    console.log(response)
  }
}


/**
 * 사용자 탈퇴
 */
export function* deleteUserSaga({ payload }) {
  const response = yield call(deleteUser, payload);
  if (response.data) {
    yield put({ type: userTypes.SET_LEAVE });
    localStorageRemove('MAD_KAKAO_ACCESS_TOKEN');
    localStorageRemove('MAD_USER_ID')
  } else {
    console.log(response);
  }
}

export function* fetchWhoamiSaga(payload) {
  const response = yield call(fetchWhoami, payload);
  if (response.data) {
    if (response.data.shop) {
      const data = response.data.shop
      const tagList = ['월', '화', '수', '목', '금', '토', '일']
      let days = {}
      data.openDays[0].split(',').forEach((v, i) => {
        days[v] = tagList.indexOf(v)
      })
      data.openDays = days
      // TODO: storeLocation now 수정 필요
      yield put({
        type: userTypes.SET_SHOP_INFO,
        payload: {
          shopId: data._id,
          storeLocation: {
            address: (data.now.active) ? data.now.location.subLocation : data.location.subLocation,
            locationComment: (data.now.active) ? data.now.locationComment : data.locationComment,
            location: {
              lat: (data.now.active) ? data.now.location.latitude.$numberDecimal : data.location.latitude.$numberDecimal,
              long: (data.now.active) ? data.now.location.longitude.$numberDecimal : data.location.longitude.$numberDecimal
            }
          },
          storeCategory: data.shopTags,
          storeOpenDays: data.openDays,
          storeOpenTime: data.openTime.split(':'),
          storeCloseTime: data.closeTime.split(':'),
          firstFile: data.imageUrl.shift(),
          files: data.imageUrl,
          shopInfo: data,
          shopActive: data.now.active
        },
      });
    }
    if (response.data.user) {
      let tag = {}
      response.data.user.userTags.forEach(element => {
        element.item.forEach((v) => {
          tag[v] = element.title
        })
      });
      response.data.user.userTags = tag
    }
    yield put({
      type: userTypes.SET_USER_INFO,
      payload: {
        userInfo: response.data.user,
      },
    });
  } else {
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  }
}

export function* fetchFavoritesListSaga({ payload }) {
  const response = yield call(fetchFavoritesList, payload);
  if (response.data) {
    yield put({
      type: userTypes.SET_FAVORITE_LIST,
      payload: {
        favoritesList: response.data
      }
    });
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  } else {
    yield put({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: false
      }
    });
  }
}

export function* postFavoritesListSaga({ payload }) {
  const response = yield call(postFavoritesList, payload);
  if (response.data) {
    yield fetchWhoamiSaga({ userId: payload.userId })
  }

}


export function* delFavoritesListSaga({ payload }) {
  const response = yield call(delFavoritesList, payload);
  if (response.data) {
    yield fetchWhoamiSaga({ userId: payload.userId })
  }

}

export default function* userSaga() {
  yield takeLatest(userApiTypes.LOGIN, loginSaga);
  yield takeLatest(userApiTypes.LOGOUT, logoutSaga);
  yield takeLatest(userApiTypes.LEAVE, deleteUserSaga);
  yield takeLatest(userApiTypes.POST_SIGNUP_USER, postSignUpUserSaga);
  yield takeLatest(userApiTypes.POST_SIGNUP_OWNER, postSignUpOwnerSaga);
  yield takeLatest(userApiTypes.POST_SIGNUP_OWNER_IMG, postSignUpImgOwnerSaga);
  yield takeLatest(userApiTypes.PUT_USER, putUserSaga);
  yield takeLatest(userApiTypes.PUT_OWNER, putOwnerSaga);
  yield takeLatest(userApiTypes.WHO_AM_I, fetchWhoamiSaga);
  yield takeLatest(userApiTypes.FETCH_FAVORITE_LIST, fetchFavoritesListSaga);
  yield takeLatest(userApiTypes.WHO_AM_I, fetchWhoamiSaga);
  yield takeLatest(userApiTypes.POST_FAVORITE_LIST, postFavoritesListSaga);
  yield takeLatest(userApiTypes.DEL_FAVORITE_LIST, delFavoritesListSaga)
}