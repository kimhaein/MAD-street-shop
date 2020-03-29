import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
// utill
import AlertUtil from '../../util/AlertUtil.js';
// common components
import { ModalHeader } from '../../components/Header';
import { Alert } from '../../components/Alert';
// components
import { SelectTime, InputTag } from '../../components/FormGroup';
import { Button } from '../../components/Unit';
// style
import '../../assets/styles/containers/setting.scss';

const SearchModal = ({ isOpen, onEvent }) => {
    const tagList = ['월', '화', '수', '목', '금', '토', '일']
    const [selectTag, setSelectTag] = useState([]);

    const modalPage = useRef();

    // 모달
    const { isShowing, title, contents, setAlert } = AlertUtil();

    const onChangeTag = (tag) => {
        if (!selectTag.includes(tag)) {
            setSelectTag([...selectTag, tag])
        } else {
            selectTag.splice(selectTag.indexOf(tag), 1)
            setSelectTag([...selectTag])
        }
    }

    useEffect(() => {
        if (isOpen) {
            console.log(modalPage)
            modalPage.current.style = 'transform: translateY(0)'
            modalPage.current.scrollTop = 0
        }
    }, [isOpen]);



    return (
        <div ref={modalPage} className={`searchModal modalPage ${isOpen ? 'open' : ''}`}>
            <ModalHeader goBack={onEvent} />
            검색하기 페이지
        </div>
    );
};

export default withRouter(SearchModal);
