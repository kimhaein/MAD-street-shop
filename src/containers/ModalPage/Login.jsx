import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";


import AuthUtill from '../../util/AuthUtill'

import { userTypes, userApiTypes } from '../../reducers/userReducer';

// common components
import { ModalHeader } from '../../components/Header';
// style
import '../../assets/styles/containers/login.scss';
// img
import imgLogoTruck from '../../assets/imgs/imgLogoTruck.png';
import iconKakao from '../../assets/imgs/iconKakao.png';

const KAKAO = window.Kakao

const Login = ({ history, isOpen, onEvent }) => {
  const dispatch = useDispatch();
  const isUser = useSelector(state => state.userReducer.isUser, []);
  const isLogin = useSelector(state => state.userReducer.isLogin);
  const [type, setType] = useState('')
  const modalPage = useRef();

  const kakaoSignUp = (url) => {
    // 카카오 로그인
    KAKAO.Auth.login({
      success: (authObj) => {
        // 사용자 토큰 저장
        AuthUtill.setUserStore(authObj.access_token)
        dispatch({
          type: userTypes.SET_TOKEN,
          payload: {
            token: {
              accessToken: authObj.access_token,
              refreshToken: authObj.refresh_token
            }
          },
        })
        // 앱 로그인
        dispatch({
          type: userApiTypes.LOGIN,
        })
      },
      fail: (err) => {
        console.log(JSON.stringify(err))
      },
    })
  }

  useEffect(() => {
    if (isOpen) {
      modalPage.current.style = 'transform: translateY(0)'
      modalPage.current.scrollTop = 0
    }
  }, [isOpen]);

  useEffect(() => {
    console.log(isLogin, isUser)
    if (isLogin && isUser) {
      history.push(`/home`)
    } else if (isLogin && !isUser) {
      history.push(`/signup/account`)
    }
  }, [isLogin]);

  return (
    <div ref={modalPage} className={`main login modalPage ${isOpen ? 'open' : ''}`}>
      <ModalHeader onEvent={onEvent} border={false} />
      <div className="loginBox">
        <img src={imgLogoTruck} alt="" />
        <p>매드스트릿샵의 모든 기능을<br />이용하시려면 <b>로그인</b>해주세요</p>
        <div className="kakaoBtn" onClick={() => {
          setType('login')
          kakaoSignUp()
        }}>
          <img src={iconKakao} alt="" />
          <span>카카오톡으로 로그인</span>
        </div>
      </div>
      <div className="loginBox">
        <p>아직 매드스트릿샵의 회원이<br />아니신가요?</p>
        <div className="kakaoBtn" onClick={() => {
          setType('signUP')
          kakaoSignUp()
        }}>
          <img src={iconKakao} alt="" />
          <span>카카오톡으로 회원가입</span>
        </div>
      </div>
      <p onClick={onEvent}>나중에 할래요</p>
    </div >
  );
};

export default withRouter(Login);
