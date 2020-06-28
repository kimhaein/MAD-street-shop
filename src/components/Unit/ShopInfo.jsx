import React from 'react';
import './style.scss';

import { ShopItem } from '../List'


const shopInfo = ({ shopInfo = {}, fetchGeolocation, onEvent }) => {
  return (
    <div className="shopInfoBox">
      <div className="shopInfoList">
        <ShopItem data={shopInfo} onEvent={onEvent} />
      </div>
    </div>
  )
};

export default shopInfo;
