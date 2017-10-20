import React from 'react';
import ModalWindow from 'components/modal';
import LoadingIndicator from 'phxComponents/loadingIndicator';

const ModalLoader = (props) => {
  let Configs = {
    key:"loading-modal",
    className:"small-box",
    title:"Loading",
    name:"error",
    isVisibleOn:true,
    shouldCloseOnOverlayClick:false,
    closeButton:false
  }

  if(Object.keys(props)){
     Configs = Object.assign({}, Configs, props);
  }
  

  return <ModalWindow {...Configs}>
      <div>
        <LoadingIndicator />
      </div>
  </ModalWindow>;
}


export default ModalLoader;