import React, { useState, useRef, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { FormGroup } from '../FormGroup'
import windowUtil from '../../util/windowUtil'
import './style.scss';

const ImgUploader = ({ fullMode = false, title = '', info = '', multiple = true, setFiles = null, files, delImg, setDelImg }) => {
  const [isImgUpload, setIsImgUpload] = useState(files.length > 0 ? false : true);
  const [imgFiles, setImgFiles] = useState([]);
  const [imgBase64, setImgBase64] = useState(files);
  const userId = useSelector(state => state.userReducer.userId, shallowEqual);
  const shopId = useSelector(state => state.userReducer.shopId, shallowEqual);
  const imgUploader = useRef();

  const fileReader = (target) => {
    return [...target.files].map((files, i) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = ({ currentTarget }) => {
          const base64 = currentTarget.result;
          resolve(base64.toString())
        };
        reader.onerror = (e) => {
          reject(e)
        }
        reader.readAsDataURL(files);
      });
    })
  }

  const onChangeImg = ({ target }) => {
    const imgs = fileReader(target)
    Promise.all(imgs).then(v => {
      if (v.length > 0) {
        setImgFiles([...imgFiles, target.files[0]])
        setImgBase64([...imgBase64, v])
        if (!multiple) setIsImgUpload(false)
      }
    });
  }

  const deleteImg = (index) => {
    if (!multiple) {
      setImgFiles([])
      setImgBase64([])
      setIsImgUpload(true)
    } else {
      const img = imgFiles.filter((v, i) => index !== i)
      const img64 = imgBase64.filter((v, i) => index !== i)
      setImgFiles(img)
      setImgBase64(img64)
      const delImg64 = imgBase64.filter((v, i) => index === i)
      const text = delImg64[0].split('/')
      setDelImg([...delImg, `${shopId}_${userId}/${text[text.length - 1]}`])

    }

  }

  useEffect(() => {
    if (imgFiles.length > 0) {
      setFiles(imgFiles)
    } else if (imgFiles.length > 10) {
      alert('이미지는 최대 10개만 업로드 가능합니다.')
    }
  }, [imgFiles]);



  const renderImgPreviewBox = () => {
    return imgBase64.map((v, i) => {
      return (
        <div className='imgPreview imgBox' key={`imgPreview-${i}`} style={{ backgroundImage: `url(${v})` }}>
          <span className="imgDelBtn" onClick={() => deleteImg(i)} />
        </div>
      )
    })
  }


  console.log(imgBase64)
  return (
    <FormGroup fullMode={fullMode} title={title} subTittle={(multiple ? `${imgFiles.length}/10` : null)} info={info}>
      <div className="imgUploaderBox">
        {!multiple && !isImgUpload ? (
          <div className='imgPreview imgBox' style={{ backgroundImage: `url(${imgBase64[0]})` }}>
            <span className="imgDelBtn" onClick={deleteImg} />
          </div>) : null}

        {!multiple && isImgUpload ? (
          <div className="imgUploader imgBox" onClick={() => imgUploader.current.click()}>
            <input type="file" name="ImgUpload" ref={imgUploader} onChange={onChangeImg} accept="image/*" hidden={true} />
          </div>
        ) : null}

        {multiple ? (
          <>
            <div className="imgUploader imgBox" onClick={() => imgUploader.current.click()}>
              <input type="file" name="ImgUpload" ref={imgUploader} onChange={onChangeImg} accept="image/*" hidden={true} />
            </div>
            <div className="imgPreviewBox" style={{ width: `${windowUtil.useWindowSize().width - 132}px` }}>
              <div>
                {renderImgPreviewBox()}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </FormGroup>
  )
};

export default ImgUploader;
