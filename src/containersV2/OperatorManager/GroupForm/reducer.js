import { UPDATE_GROUP_FROM, CLEAR_GROUP_FROM ,RESET_GROUP_FROM_MODIFIED} from './actions'

const initialState = {
    groupdetails: {
        description:'',
        email: '',
        currency:'',
        id:''
    },
    groupid:'',
    modified: false
}

const modifiedGroupForm = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_GROUP_FROM:
            return {
                ...state,
                groupdetails:{
                    ...state.groupdetails,
                    ...action.formDetails
                },
                modified: true
            }
        case CLEAR_GROUP_FROM:
            return initialState
        case RESET_GROUP_FROM_MODIFIED:
            return {
                ...state,
                modified:false
            }
        default:
            return state
    }
}

export default modifiedGroupForm