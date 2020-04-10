import axios from 'axios';
import AuthUtill from '../../util/AuthUtill'

const API_INSTANCE = axios.create({
  baseURL: 'https://mad-street-shop.herokuapp.com/api',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

const KAKAO_API_INSTANCE = axios.create({
  baseURL: 'https://kapi.kakao.com',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
});



/**
 * 카카오 회원정보 조회
 * @param
 */
export const fetchKaKaoInfo = () => {
  console.log('fetchKaKaoInfo', AuthUtill.accessToken)
  return KAKAO_API_INSTANCE.get('/v2/user/me',
    {
      headers: {
        'Authorization': `Bearer ${AuthUtill.accessToken}`
      }
    }
  )
    .then(response => {
      console.log('fetchKaKaoInfo')
      return response
    })
    .catch(error => {
      console.log('fetchKaKaoInfo', error);
      return error;
    });
};

/**
 * 카카오 사용자 회원가입
 * @param
 */
export const postSignUpUser = ({ userId, userTags }) => {
  console.log('postSignUpUser', AuthUtill.accessToken)
  console.log('postSignUpUser', userId, userTags)

  // return API_INSTANCE.post('/users/join/user', {
  //   data: { userId, userTags }
  // })
  //   .then(response => {
  //     console.log('postSignUpUser')
  //     return response
  //   })
  //   .catch(error => {
  //     console.log('postSignUpUser', error);
  //     return error;
  //   });
};


export const fetchWhoami = () => {
  console.log('fetchWhoami', AuthUtill.accessToken)
  return API_INSTANCE.get('/users/whoami',
    {
      params: {
        // userId: 1
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${AuthUtill.accessToken}`
      }
    }
  )
    .then(response => {
      console.log('whoami')
      return response
    })
    .catch(error => {
      console.log('whoami', error);
      return error;
    });
};
