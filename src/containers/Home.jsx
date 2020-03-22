import React from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from "react-router-dom";

const Home = () => {
  // console.log(4,process.env);
  const loading = useSelector(({ authReducer }) => authReducer.loading, true);
  return (
    // <div>{process.env.REACT_APP_API_KEY}</div>
    <div>
      <div>{`Home: ${loading}`}</div>
      {/* <Redirect to='/signUp' /> */}
      <div><Link to="/signup/owner">사장님 가입</Link></div>
      <div><Link to="/signup/user">사용자 가입</Link></div>

      <div className="iconBox">
        <span>🍢</span>
        <span>🥪</span>
        <span>🍩</span>
        <span>🍤</span>
        <span>🌭</span>
        <span>🐙</span>
      </div>
    </div>
  );
};

export default withRouter(Home);
