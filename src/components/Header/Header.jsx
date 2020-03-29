import React from 'react';
import './style.scss';
import iconBack from '../../assets/imgs/iconBack.png';
import btnClose from '../../assets/imgs/btnClose.png';
import iconMenu from '../../assets/imgs/iconMenu.png';
import iconSearch from '../../assets/imgs/iconSearch.png';
import adressEdit from '../../assets/imgs/adressEdit.png';

import ModalPageUtill from '../../util/ModalPageUtill.js';

import { SearchModal } from '../../containers/ModalPage';


const Header = ({ goBack, title = '' }) => {
  return (
    <div className="header">
      <div onClick={goBack}><img src={iconBack} alt={'뒤로가기'} /></div>
      <h2 className="headerTitle">{(title) ? title : ''}</h2>
      <div>{''}</div>
    </div>
  );
};

export const ModalHeader = ({ goBack, title = '' }) => {
  return (
    <div className="header modalHeader">
      <div onClick={goBack}><img src={btnClose} alt="btnClose" /></div>
      <h2 className="headerTitle">{(title) ? title : ''}</h2>
      <div>{''}</div>
    </div>
  );
};




export const HomeHeader = ({ address = '서울 영등포구 여의도동 37', fetchGeolocation, setModalPage }) => {

  return (
    <div className="header homeHeader">
      <div className="menu">
        <img src={iconMenu} alt={'메뉴'} />
      </div>
      <div className="address" onClick={fetchGeolocation}>
        <span className="text">{address}</span>
        <img src={adressEdit} alt={'주소 수정'} />
      </div>
      <div className="search" onClick={() => {
        setModalPage({
          target: 'SearchModal',
        });
      }}>
        <img src={iconSearch} alt={'검색'} />
      </div>
    </div>
  );
};

export default Header;
