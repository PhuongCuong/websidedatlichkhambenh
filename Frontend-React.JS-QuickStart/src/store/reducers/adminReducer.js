import actionTypes from '../actions/actionTypes';

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null
}

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctor: [],
    allscheduletime: [],

    allRequiredDoctorInfor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copystate = { ...state };
            copystate.genders = action.data;
            copystate.isLoadingGender = false;
            return {
                ...state,
                genders: action.data
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.genders = [];
            state.isLoadingGender = true;
            return {
                ...state,
                started: true
            }

        case actionTypes.FETCH_POSITIONS_SUCCESS:
            state.positions = action.data;
            state.isLoadingGender = false;
            return {
                ...state,
                positions: action.data
            }
        case actionTypes.FETCH_POSITIONS_FAILED:
            state.positions = [];
            state.isLoadingGender = true;
            return {
                ...state,
                started: true
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingGender = false;
            return {
                ...state,
                roles: action.data
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            state.isLoadingGender = true;
            return {
                ...state,
                started: true
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.users;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users = action.users;
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctor = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.topDoctor = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.topDoctor = action.dataDoctor;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.topDoctor = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS:
            state.allscheduletime = action.datatime;
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAILED:
            state.allscheduletime = [];
            return {
                ...state
            }

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.allRequiredDoctorInfor = action.data;


            return {
                ...state
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            state.allRequiredDoctorInfor = action.data;
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;