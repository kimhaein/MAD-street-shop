import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { userTypes, userApiTypes } from '../reducers/userReducer';

import AlertUtil from '../util/AlertUtil.js';
import ModalPageUtill from '../util/ModalPageUtill.js';

import { Alert } from '../components/Alert';
import { Header } from '../components/Header';
import { FormGroup, InputText, Radio, ImgUploader } from '../components/FormGroup';
import { Button } from '../components/Unit';
import Spinner from "../components/Unit/Spinner";

import '../assets/styles/containers/signUpOwner.scss';
import { SettingCategory, SettingTime, SettingLocation } from './ModalPage';

const SignUpOwner = ({ history, match }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(true);
  // 스토어 값 가져오기
  const userId = useSelector(state => state.userReducer.userId, shallowEqual);
  const shopId = useSelector(state => state.userReducer.shopId, shallowEqual);
  const isUser = useSelector(state => state.userReducer.isUser, shallowEqual);
  const shopInfo = useSelector(state => state.userReducer.shopInfo, shallowEqual);
  const storeLocation = useSelector(state => state.userReducer.storeLocation, shallowEqual);
  const storeCategory = useSelector(state => state.userReducer.storeCategory, shallowEqual);
  const storeOpenDays = useSelector(state => state.userReducer.storeOpenDays, shallowEqual);
  const storeOpenTime = useSelector(state => state.userReducer.storeOpenTime, shallowEqual);
  const storeCloseTime = useSelector(state => state.userReducer.storeCloseTime, shallowEqual);
  const userLoading = useSelector(state => state.userReducer.userLoading, shallowEqual);

  const [userName, setUserName] = useState(shopInfo.ownerName || '');
  const [mobile, setMobile] = useState(shopInfo.mobile || '');
  const [useMobile, setUseMobile] = useState(shopInfo.useMobile ? 1 : 0);
  const [shopName, setShopName] = useState(shopInfo.shopName || '');
  const [shopComment, setShopComment] = useState(shopInfo.ownerComment || '');
  const [firstFile, setFirstFile] = useState(useSelector(state => state.userReducer.firstFile), []);
  const [files, setFiles] = useState(useSelector(state => state.userReducer.files), []);
  // 모달
  const { isShowing, title, contents, setAlert } = AlertUtil();
  const { targetModalPage, isModalOpen, setModalPage } = ModalPageUtill();

  const [delImg, setDelImg] = useState([]);


  const rederModalPage = () => {
    switch (targetModalPage) {
      case 'SettingCategory':
        return <SettingCategory isOpen={isModalOpen} onEvent={setModalPage} />;
      case 'SettingTime':
        return <SettingTime isOpen={isModalOpen} onEvent={setModalPage} />;
      case 'SettingLocation':
        return <SettingLocation type={history.location.pathname === "/myPage/owner" ? 'edit' : null} isOpen={isModalOpen} onEvent={setModalPage} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!state && !userLoading && shopInfo) {
      if (history.location.pathname !== "/myPage/owner") {
        history.push(`/signup/complet/owner`)
      } else {
        history.goBack()
      }
    }
  }, [userLoading])

  const renderTimes = () => {
    const days = Object.keys(storeOpenDays).sort((a, b) => {
      return storeOpenDays[a] - storeOpenDays[b]
    })
    const openTime = `${storeOpenTime[0]}:${(+storeOpenTime[1] < 10) ? `0${+storeOpenTime[1]}` : storeOpenTime[1]}`
    const closeTime = `${storeCloseTime[0]}:${(+storeCloseTime[1] < 10) ? `0${+storeCloseTime[1]}` : storeCloseTime[1]}`
    const text = `${days} ${openTime}~${closeTime}`
    return {
      days,
      openTime,
      closeTime,
      text,
    }
  }

  const submitData = () => {
    if (!userId || !storeLocation || !storeCategory || !storeOpenDays || !storeOpenTime || !storeCloseTime || !userName || !mobile || !shopName || !shopComment || firstFile.length <= 0) {
      alert("필수 입력값을 입력해주세요")
      return false
    }

    const formData = new FormData();
    // formData.append('files', firstFile[0], `${shopId}.${firstFile[0].type.split('/')[1]}`);
    formData.append('files', firstFile[0]);
    files.map((v) => {
      formData.append('files', v);
    })

    const { days, openTime, closeTime } = renderTimes()
    setState(false)
    dispatch({
      type: userTypes.USER_LODING,
      payload: {
        userLoading: true
      }
    })
    if (history.location.pathname === "/myPage/owner") {
      // 사장님 정보 수정
      dispatch({
        type: userApiTypes.PUT_OWNER,
        payload: {
          shopId,
          userId,
          userName,
          mobile,
          useMobile: useMobile ? true : false,
          shopName,
          category: storeCategory,
          latitude: storeLocation.location.lat,
          longitude: storeLocation.location.long,
          subLocation: storeLocation.address,
          locationComment: storeLocation.locationComment,
          shopComment,
          openDays: days.join(','),
          openTime: openTime,
          closeTime: closeTime,
          useKakao: true,
          files: formData,
          deleteFiles: delImg.join(',')
        },
      })
    } else {
      // 사장님 가입
      dispatch({
        type: userApiTypes.POST_SIGNUP_OWNER,
        payload: {
          userId,
          userName,
          mobile,
          useMobile: useMobile ? true : false,
          shopName,
          category: storeCategory,
          latitude: storeLocation.location.lat,
          longitude: storeLocation.location.long,
          subLocation: storeLocation.address,
          locationComment: storeLocation.locationComment,
          shopComment,
          openDays: days.join(','),
          openTime: openTime,
          closeTime: closeTime,
          useKakao: true,
          files: formData,
        },
      })
    }
  }

  console.log(firstFile, 'firstFile')
  return (
    <div className="main signUpOwner">
      <Header onEvent={history.goBack} />
      <h2 className="title">
        안녕하세요 <br />
        <b>사장님 계정</b>으로 매드스트릿샵<br />
        회원가입을 진행합니다<br />
      </h2>
      <FormGroup title={'기본 정보'} outline={true}>
        <InputText label={'이름'} onEvent={(e) => { setUserName(e.target.value) }} defaultValue={userName} />
        <InputText label={'휴대전화 번호'} type="tel" onEvent={(e) => { setMobile(e.target.value) }} defaultValue={mobile} />
      </FormGroup>
      <FormGroup
        title={'가게 정보'}
        outline={true}
        info={'※ 가게 이름이 없는 경우 판매하는 음식명으로 대체 가능합니다.'}
      >
        <InputText label={'가게 이름'} onEvent={(e) => { setShopName(e.target.value) }} defaultValue={shopName} />
        <InputText
          label={'음식 카테고리'}
          type="openModal"
          selcetData={
            Object.keys(storeCategory).length > 0 ?
              {
                main: storeCategory.title,
                sub: storeCategory.item.join(','),
              }
              : null
          }
          onEvent={() => {
            setModalPage({
              target: 'SettingCategory',
            });
          }}
        />
        <InputText
          label={'주 영업 위치'}
          selcetData={{ main: storeLocation.address, sub: storeLocation.locationComment }}
          type="openModal"
          onEvent={() => {
            setModalPage({
              target: 'SettingLocation',
            });
          }}
        />
        <InputText
          label={'주 영업 시간'}
          type="openModal"
          selcetData={
            Object.keys(storeOpenDays).length > 0 ?
              {
                main: renderTimes().text
              }
              : null
          }
          onEvent={() => {
            setModalPage({
              target: 'SettingTime',
            });
          }}
        />
        <InputText label={'매장소개'} type="textarea" onEvent={(e) => { setShopComment(e.target.value) }} defaultValue={shopComment} />
      </FormGroup>
      <FormGroup title={'휴대폰 번호 노출 여부'} info={'※ 휴대폰 번호 노출 선택 시 가게정보에 함께 노출됩니다.'}>
        <Radio
          index={1}
          data={{ title: '노출' }}
          selectItem={useMobile}
          setSelectItem={setUseMobile}
        />
        <Radio
          index={0}
          data={{ title: '미노출' }}
          selectItem={useMobile}
          setSelectItem={setUseMobile}
        />
      </FormGroup>
      <ImgUploader files={firstFile} setFiles={setFirstFile} multiple={false} title={'대표이미지 등록'} info={'※ 가게를 대표하는 사진을 등록해주세요.'} />
      <ImgUploader files={files} setFiles={setFiles} title={'사진 등록'} info={'※ 10장 이내의 사진을 등록해주세요. <b>판매하는 음식사진이나, 가게 전경, 영업 위치가 찍힌 사진</b>을 등록하면 판매에 도움이 됩니다.'} delImg={delImg} setDelImg={setDelImg} />
      <Button
        active={true}
        onEvent={submitData}
        text={'완료'}
      />
      <Alert isShowing={isShowing} hide={setAlert} title={title} contents={contents} />
      {rederModalPage()}
      {userLoading ? <Spinner /> : null}
    </div>
  );
};

export default withRouter(SignUpOwner);
