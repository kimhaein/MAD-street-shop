import React from 'react';
import iconChevronRight from '../../assets/imgs/iconChevronRight.png';
import './style.scss';

const InputText = ({label='',type='text',onEvent=null ,selcetData=null}) => {

  const resizeTextArea = ({target}) => {
    target.style.height = "1px";
    target.style.height = `${target.scrollHeight}px`
  }

  const renderInput = ()=>{
    switch (type) {
      case 'openModal':
        return (
          <div 
            className={`inputText ${(selcetData?.sub)?'selcet':''}`}
            onClick={onEvent}
          >
            <p>
              {selcetData?.main?selcetData.main:'선택해주세요'}
              <img src={iconChevronRight} alt="right"/>
            </p>
            {selcetData?<span>{selcetData.sub}</span>:null}
          </div>
        )
      case 'textarea':
        return  <textarea className="inputText" onKeyDown={resizeTextArea} placeholder='입력해주세요'></textarea>
      default:
        return <input className="inputText" defaultValue='' type={type} placeholder='입력해주세요'/>
    }
  }

  return (
    <div className='inputTextItem'>
      <label>{label}</label>
      {renderInput()}
    </div>
  )
};

export default InputText;