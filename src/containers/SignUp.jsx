import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";

import AlertUtil from '../util/AlertUtil.js';
import ModalPageUtill from '../util/ModalPageUtill.js';

import { Alert } from '../components/Alert';
import { Header } from '../components/Header';
import { FormGroup, InputText, Radio, ImgUploader } from '../components/FormGroup';
import { Button } from '../components/Unit';

import '../assets/styles/containers/signUp.scss';
import { SettingCategory, SettingTime } from './ModalPage';

const SignUp = ({history, match}) => {
  // 스토어 값 가져오기
  // const loading = useSelector(({ authReducer }) => authReducer.loading, true);
  const [selectRadioItem, setSelectRadioItem] = useState(2);
  // 모달
  
  const { isShowing, title, contents, setAlert} = AlertUtil();
  const { targetModalPage, isModalOpen, setModalPage} = ModalPageUtill();

  const storeCategory = useSelector(state => state.userReducer.storeCategory, {});



  const rederModalPage = ()=>{
    switch (targetModalPage) {
      case 'SettingCategory':
        return <SettingCategory isOpen={isModalOpen} onEvent={setModalPage}/>
      case 'SettingTime':
        return <SettingTime isOpen={isModalOpen} onEvent={setModalPage}/>
      default: 
        return null
    }
  }

  return (
    <div className="signUp">
      <Header goBack={history.goBack}/>
      <h2 className="title" onClick={()=>{
        setModalPage({
          target:'SettingCategory',
        })
      }}>
        {`안녕하세요`} <br/>
        <b>{(match.params.type === 'owner')?`사장님 계정`:`사용자 계정`}</b>
        {`으로 매드스트릿샵`} <br/>
        {`회원가입을 진행합니다`} <br/>
      </h2>
      <FormGroup title={'기본 정보'} outline={true}>
        <InputText label={'이름'}/>
        <InputText label={'휴대전화 번호'} type="tel"/>
      </FormGroup>
      <FormGroup title={'가게 정보'} outline={true} info={'※ 가게 이름이 없는 경우 판매하는 음식명으로 대체 가능합니다.'}>
        <InputText label={'가게 이름'}/>
        <InputText 
          label={'음식 카테고리'} 
          type="openModal" 
          selcetData={storeCategory?{
            main:storeCategory.title,
            sub:storeCategory.item.join(',')
          }:null}
          onEvent={()=>{
            setModalPage({
              target:'SettingCategory'
            })
          }}
        />
        <InputText label={'주 영업 위치'} type="openModal"/>
        <InputText 
          label={'주 영업 시간'} 
          type="openModal"
          selcetData={{main:'월~금 17:00 19:10'}}
          onEvent={()=>{
            setModalPage({
              target:'SettingTime'
            })
          }}
        />
        <InputText label={'매장소개'} type="textarea"/>
      </FormGroup>
      <FormGroup title={'휴대폰 번호 노출 여부'} info={'※ 휴대폰 번호 노출 선택 시 가게정보에 함께 노출됩니다.'}>
        <Radio
          index={0}
          data={{title:'노출'}}
          selectItem={selectRadioItem} 
          setSelectItem={setSelectRadioItem}
        />
        <Radio
          index={1}
          data={{title:'미노출'}}
          selectItem={selectRadioItem} 
          setSelectItem={setSelectRadioItem}
        />
      </FormGroup>
      <ImgUploader multiple={false} title={'대표이미지 등록'} info={'※ 가게를 대표하는 사진을 등록해주세요.'} />
      <ImgUploader title={'사진 등록'} info={'※ 10장 이내의 사진을 등록해주세요. <b>판매하는 음식사진이나, 가게 전경, 영업 위치가 찍힌 사진</b>을 등록하면 판매에 도움이 됩니다.'} />
      <Button 
        active={true} 
        onEvent={()=>{alert(1)}} 
        text={'완료'}
      />
      <Alert isShowing={isShowing} hide={setAlert} title={title} contents={contents}/>
      {rederModalPage()}
    </div>
  );
};

export default withRouter(SignUp);
