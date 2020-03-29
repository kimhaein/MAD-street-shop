import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { HomeHeader } from '../components/Header'
import { MainMap } from '../components/Map';
import { ShopInfo } from '../components/Unit';

import ModalPageUtill from '../util/ModalPageUtill.js';

import { SearchModal } from '../containers/ModalPage';

const Home = () => {
  const [location, setLocation] = useState('');
  const [shopList, setShopList] = useState([{ name: '토토네 튀김', latitude: 37.489524599999996, longitude: 126.98655099999998 }, { name: '네네치킨', latitude: 37.489524599999996, longitude: 126.98643099999998 }]);
  const loading = useSelector(({ authReducer }) => authReducer.loading, true);

  const { targetModalPage, isModalOpen, setModalPage } = ModalPageUtill();

  // 위치정보 조회
  const fetchGeolocation = () => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 300000,
      timeout: 5000,
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log('coords', coords);
        setLocation({ lat: coords.latitude, long: coords.longitude });
      },
      e => console.log(`Geolocation 오류 [${e.code}] : ${e.message}`),
      options,
    );
  };

  useEffect(() => {
    console.log('HOME_Mount');
    if (navigator.geolocation) {
      fetchGeolocation();
    }
    return () => {
      console.log('HOME_unMount');
    };
  }, []);

  // location 변경될때
  useEffect(() => {
    if (location) {
      // dispatch({
      //   type: homeTypes.FETCH_SHOP_LIST,
      //   payload: { location, type: 'main' },
      // });
    }
  }, [location]);

  const rederModalPage = () => {
    switch (targetModalPage) {
      case 'SearchModal':
        return <SearchModal isOpen={isModalOpen} onEvent={setModalPage} />;
      default:
        return null;
    }
  };

  return (
    // <div>{process.env.REACT_APP_API_KEY}</div>
    <div style={{ background: 'gray' }}>
      <HomeHeader fetchGeolocation={fetchGeolocation} setModalPage={setModalPage} />
      <MainMap location={location} setLocation={setLocation} shopList={shopList} />
      <ShopInfo
        shopInfo={{
          name: "석정포장마차",
          category: "분식",
          photo: "https://post-phinf.pstatic.net/MjAxOTEwMDFfNjkg/MDAxNTY5OTE5NzUxNDc2.mnGT1DcIaEY9os4ftETl5Bc_SudAwsUq8O3KaqlpQtQg.qhcMdUjcKqBoTC6hR1j7OnsY4BIpK1aulSmv0mlwO14g.JPEG/%EB%B6%84%EC%8B%9D.jpg?type=w1200",
          open: true,
          link: "/",
          info: {
            distance: 8,
            like: 674,
            userLike: true,
          }
        }
        }
        fetchGeolocation={fetchGeolocation}
      />
      {/* <div>{`Home: ${loading}`}</div> */}
      {/* <Redirect to='/signUp' /> */}
      {/* <div><Link to="/signup/owner">사장님 가입</Link></div>
      <div><Link to="/signup/user">사용자 가입</Link></div>
      <div><Link to="/ranking">리스트 보기</Link></div> */}

      {/* <div className="iconBox">
        <span>🍢</span>
        <span>🥪</span>
        <span>🍩</span>
        <span>🍤</span>
        <span>🌭</span>
        <span>🐙</span>
      </div> */}

      {rederModalPage()}
    </div>
  );
};

export default withRouter(Home);
