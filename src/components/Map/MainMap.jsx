import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import scriptUtill from '../../util/scriptUtill';
import './style.scss';
import mapPinOn from '../../assets/imgs/mapPinOn.png';
import mapPinOff from '../../assets/imgs/mapPinOff.png';
import mapMarker from '../../assets/imgs/mapMarker.png';
import { shopTypes } from '../../reducers/shopReducer';

let selectedMarker = null
let selectedMarkerImg = null

const MainMap = ({ location, shopList = [], containerId = null, onEvent, selectShopId, getGeocoder, setLocation }) => {
  const dispatch = useDispatch();
  const mainLocation = useSelector(state => state.startReducer.location)
  const [crrlocation, setCrrLocation] = useState(location)
  const shopId = useSelector(state => state.shopReducer.selectShopId)
  const shopDetail = useSelector(state => state.shopReducer.shopDetail);
  const [Map, setMap] = useState(null)

  useEffect(() => {
    if (Map && location) {
      setCrrLocation(location)
      setAddress()
    }
  }, [location, containerId]);

  useEffect(() => {
    if (containerId === 'openShopMap') {
      renderMap()
    }

  }, [location]);

  useEffect(() => {
    if (Map && containerId !== 'locationMap' && shopId) {
      const lat = (shopDetail.now.active) ? shopDetail.now.location.latitude.$numberDecimal : shopDetail.location.latitude.$numberDecimal
      const long = (shopDetail.now.active) ? shopDetail.now.location.longitude.$numberDecimal : shopDetail.location.longitude.$numberDecimal
      moveMap({ lat, long })
    }
  }, [shopDetail]);

  useEffect(() => {
    renderMap()
  }, [mainLocation]);

  useEffect(() => {
    if (Map) {

      if (containerId !== 'locationMap') {
        const marker = renderMarker(mapMarker, { width: 50, height: 48 }, location)
        marker.setMap(Map);
        moveMap(location)
      }

      if (onEvent) { clickMap(Map) }

      if (getGeocoder && Object.keys(crrlocation).length > 0) { setAddress() }

      if (shopList.length > 0) {
        createShopsMarker();
      }
    }
  }, [Map]);

  useEffect(() => {
    if (Map && shopList.length > 0) {
      createShopsMarker();
    }
  }, [shopList]);


  // 지도 이동
  const moveMap = (location) => {
    // 이동할 위도 경도 위치를 생성합니다 
    const moveLatLon = new window.kakao.maps.LatLng(location.lat, location.long);

    // 지도 중심을 이동
    Map.setCenter(moveLatLon);
  }

  const createMarkerImage = (src, sizeObj) => {
    const size = new window.kakao.maps.Size(sizeObj.width, sizeObj.height);
    const options = {
      spriteOrigin: new window.kakao.maps.Point(0, 0),
      spriteSize: new window.kakao.maps.Size(sizeObj.width, sizeObj.height)
    }
    const markerImage = new window.kakao.maps.MarkerImage(src, size, options);
    return markerImage;
  }

  const renderMarker = (src, sizeObj, location) => {
    const image = createMarkerImage(src, sizeObj);
    const position = new window.kakao.maps.LatLng(location.lat, location.long);
    const marker = new window.kakao.maps.Marker({
      Map,
      position,
      image,
    });
    return marker
  }

  const addEvent = (marker, data, location, src) => {
    // 마커 이벤트 등록

    window.kakao.maps.event.addListener(marker, 'click', function () {
      if (!selectedMarker || selectedMarker !== marker) {
        !!selectedMarker && selectedMarker.setImage(createMarkerImage(selectedMarkerImg, { width: 23, height: 28 }));
        marker.setImage(createMarkerImage(src, { width: 35, height: 42 }));
      }

      selectedMarker = marker;
      selectedMarkerImg = src;

      moveMap(location)
      onEvent({
        target: 'ShopDetailModal',
      });

      if (shopId) {
        dispatch({
          type: shopTypes.SET_SELECT_SHOP_ID,
          payload: {
            selectShopId: data._id
          },
        });

        dispatch({
          type: shopTypes.SET_SHOP_DETAIL,
          payload: {
            shopDetail: data
          }
        });
      }
    });
  }


  const clickMap = (map) => {
    window.kakao.maps.event.addListener(map, 'click', () => {
      onEvent({
        target: null,
      });
      if (shopId) {
        dispatch({
          type: shopTypes.SET_SELECT_SHOP_ID,
          payload: {
            selectShopId: ''
          },
        });
      }
    });
  }

  // 가게 마커 생성
  const createShopsMarker = (map = Map) => {
    for (let i = 0; i < shopList.length; i++) {
      const data = shopList[i];
      const src = data.now.active ? mapPinOn : mapPinOff;
      const sizeObj = selectShopId === data._id ? { width: 35, height: 42 } : { width: 23, height: 28 };
      const lat = (data.now.active) ? data.now.location.latitude.$numberDecimal : data.location.latitude.$numberDecimal
      const long = (data.now.active) ? data.now.location.longitude.$numberDecimal : data.location.longitude.$numberDecimal
      const marker = renderMarker(src, sizeObj, { lat, long })
      selectedMarker = marker
      selectedMarkerImg = src;
      marker.setMap(map);
      addEvent(marker, data, { lat, long }, src)
    }
  };

  // 주소 설정
  const setAddress = () => {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new window.kakao.maps.services.Geocoder();
    if (containerId === 'homeMap') {
      const coord = new window.kakao.maps.LatLng(location.long, location.lat);
      geocoder.coord2Address(coord.Ha, coord.Ga, (result, status) => {
        if (result[0].road_address) {
          getGeocoder(result[0].road_address.address_name)
        } else {
          getGeocoder(result[0].address.address_name)
        }
      });
    }

    if (containerId === 'locationMap') {

      window.kakao.maps.event.addListener(Map, 'idle', (data) => {
        const latlng = Map.getCenter();
        geocoder.coord2Address(latlng.Ga, latlng.Ha, (result, status) => {
          if (result[0].road_address) {
            getGeocoder(result[0].road_address.address_name)
          } else {
            getGeocoder(result[0].address.address_name)
          }
        });

        if (setLocation) {
          setLocation({ lat: latlng.Ha, long: latlng.Ga })
          moveMap({ lat: latlng.Ha, long: latlng.Ga })
        }
      });
    }
  }

  const renderMap = () => {
    console.log('renderMap')
    const container = document.getElementById(containerId);
    const options = {
      center: new window.kakao.maps.LatLng(crrlocation.lat, crrlocation.long), // 지도의 중심좌표.
      level: 3, // 지도의 레벨(확대, 축소 정도)
    };

    setMap(new window.kakao.maps.Map(container, options))
  };




  return <div id={containerId} className="mapBox"></div>;
};
export default MainMap;
