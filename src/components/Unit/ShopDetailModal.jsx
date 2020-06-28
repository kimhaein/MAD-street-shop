import React from 'react'
import './style.scss';
import { ShopItem, PhotoList } from '../List'
import iconClock from '../../assets/imgs/iconClock.png'
import iconMapPin from '../../assets/imgs/iconMapPin.png'
import iconPhone from '../../assets/imgs/iconPhone.png'

const shopDetailModal = ({ shopInfo, isOpen = true, onEvent = null, userFavorite = [], userIdNumber, token }) => {
  const mobile = shopInfo.mobile ? shopInfo.mobile.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3") : '비공개'
  const times = shopInfo.now.active ? `${shopInfo.now.openTime}~${shopInfo.now.closeTime}` : `${shopInfo.openTime}~${shopInfo.closeTime}`
  const locationComment = shopInfo.now.active ? shopInfo.now.locationComment : shopInfo.locationComment

  return (
    <div className={`shopDetailModal ${isOpen ? 'open' : ''}`}>
      <ShopItem data={shopInfo} type='icon' userFavorite={userFavorite} userId={userIdNumber} token={token} />
      <ul className={'shopDetailInfo'}>
        <li className="infoList">
          <img src={iconMapPin} alt={'위치'} />
          <div className="info">
            <p>{shopInfo.location.subLocation}</p>
            <span className="subLocation">{locationComment}</span>
          </div>
        </li>
        <li className="infoList">
          <img src={iconClock} alt={'영업시간'} />
          <div className="info">
            <p>영업시간{shopInfo.now.active ? <span className="openInfo open">영업중</span> : <span className="openInfo">준비중</span>}</p>
            <p>{`${shopInfo.openDays}`} {times}</p>
          </div>
        </li>
        <li className="infoList">
          <img src={iconPhone} alt={'전화번호'} />
          <div className="info">
            <p>
              {(shopInfo.useMobile) ? <a href={`tel:${mobile}`}>{mobile}</a> : '비공개'}
            </p>
          </div>
        </li>
      </ul>
      <PhotoList items={shopInfo.imageUrl} />
    </div >
  )
};

export default shopDetailModal;
