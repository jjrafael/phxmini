import actionTypes from '../constants';

export function openModal(modalName) {
    return {
        type: actionTypes.OPEN_MODAL,
        modalName
    }
}

export function closeModal(modalName) {
    return {
        type: actionTypes.CLOSE_MODAL,
        modalName
    }
}

export function closeAllModals() {
    return {
        type: actionTypes.CLOSE_ALL_MODALS
    }
}