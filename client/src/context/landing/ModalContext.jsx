import { createContext, useContext, useState } from 'react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  // type: null | 'login' | 'register'
  const [modalType, setModalType] = useState(null)

  const openModal  = (type) => setModalType(type)
  const closeModal = ()     => setModalType(null)

  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
