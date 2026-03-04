/*
* Custom service wrapper for moved modals
*
* The hook for this context `useModal` provides the following functions:
*   open, close
*
*   open: (modalComponent, options)
*     options:
*       onClose(result):  (function) callback function on modal close that recieves
*                         the result provided by the modal if it sends one (undefined if dismissed)
*       hideCloseButton:  (boolean) to disable the default close button icon
*       customStyles:     (style object) custom styles to apply to the modal container
*
* This context exposes four exports to implement modal context
* See the examples below for how to implement each approach
*
* Use full context for class component
* example:
*    import { ModalContext } from '@moved/services';
*    static contextType = ModalContext;
*    const openModal = this.context.open;
*    const onClick = () => openModal(MyModalComponent, options);
*
* Use context hook for functional component (prefered)
* example:
*    import { useModal } from '@moved/services';
*    const { open } = useModal();
*    const onClick = () => open(MyModalComponent, options);
*
* Use context provider component for wrapping the global application
* (not needed more than once per app, usually in the Root component)
* example:
*    import { ModalProvider } from '@moved/services';
*    render (
*      <ModalProvider> ... </ModalProvider>
*    )
*/

import React, { createContext, useContext, useState } from "react";
import nextId from 'react-id-generator';
import { get, merge } from 'lodash';

import { Modal } from '../components/Modal';

const ModalContext = createContext();
const useModal = () => useContext(ModalContext);

const defaultOptions = {};

// define ModalContextProvider as functional component
const ModalProvider = ({ children, ...props}) => {
  // set state vars
  const [activeModals, setActiveModals] = useState([]);

  const open = (contents, opts) => {
    const options = merge({}, defaultOptions, opts)
    setActiveModals(activeModals => ([
      ...activeModals,
      {
        id: nextId('modal-'),
        contents,
        options,
      },
    ]));
  };

  const close = (result, id) => {
    const closingModal = id ?
      activeModals.find(modal => modal.id === id) :
      activeModals[activeModals.length-1];
    if(get(closingModal,`options.onClose`)) closingModal.options.onClose(result);
    setActiveModals(activeModals.filter(modal => modal !== closingModal));
  };

  const context = { open, close, activeModals };
  return (
    <ModalContext.Provider value={context} {...props}>
      { children }
    </ModalContext.Provider>
  );
};

// define the modal markup as component to be rendered downstream (inside the ServicesContext)
const ModalInstance = () => {
  const { activeModals=[], close } = useModal();
  return (
    <>
      { activeModals.map(modal => (
        <Modal
          key={modal.id}
          id={modal.id}
          options={modal.options}
          close={(result) => close(result,modal.id)}
        >
          { modal.contents }
        </Modal>
      ))}
    </>
  );
}

export { ModalContext, ModalProvider, ModalInstance, useModal };
