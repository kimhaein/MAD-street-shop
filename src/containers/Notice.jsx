import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ModalHeader } from '../components/Header';
import { AccordionList } from "../components/List";

const Notice = ({ history }) => {
  const noticeList = useSelector(state => state.startReducer.ntc, []);

  return (
    <div className="main myPage">
      <ModalHeader onEvent={history.goBack} border={false} />
      <AccordionList items={noticeList} listType="announce" />
    </div>
  )
}

export default withRouter(Notice);