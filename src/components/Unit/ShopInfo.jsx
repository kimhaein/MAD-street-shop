import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './style.scss';

import { PhotoList } from '../List'
import iconPin from '../../assets/imgs/iconPin.png';
import btnHere from '../../assets/imgs/btnHere.png';


const shopInfoModal = ({shopInfo={}, fetchGeolocation}) => {

  return (
    <div className="shopInfoModal">
      <div className="buttonBox">
        <div className="loaction" onClick={fetchGeolocation}><img src={btnHere} alt="현재위치"/></div>
        <div className="ranking">
          <Link to="/ranking">
            <img src={iconPin} alt="현재위치"/>
            <span className="text">내 주변 인기 스트릿푸드는?</span>
          </Link>
        </div>
      </div>
      <div className="shopInfoBox">
        <PhotoList items={[shopInfo]}/>
      </div>
    </div>
  )
};

export default shopInfoModal;
