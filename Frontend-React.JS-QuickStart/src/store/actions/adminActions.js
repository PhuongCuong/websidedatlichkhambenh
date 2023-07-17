import actionTypes from './actionTypes';
import {
    getAllcodeservice, CreateNewUserModal, getAllUser,
    DeleteUserService, editUserService, getTopDoctorHome
    , getAlldoctors, saveDetailDoctor, getAllspecialty, getAllClinic
} from '../../services/userService'
import { ToastContainer, toast } from 'react-toastify';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })



export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllcodeservice("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchpositionSuccess(res.data));
            } else {
                dispatch(fetchpositionFailed());
            }
        } catch (e) {
            dispatch(fetchpositionFailed());
            console.log(e)
        }
    }
}

export const fetchRolesStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllcodeservice("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log(e)
        }
    }
}

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await CreateNewUserModal(data);
            if (res && res.errCode === 0) {
                toast.success("create a new user success!")
                dispatch(saveUserSuccess());
                dispatch(fetchallUserStart())
            } else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log(e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCSESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })

            let res = await getAllcodeservice("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
            console.log(e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})


export const fetchpositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITIONS_SUCCESS,
    data: positionData
})

export const fetchpositionFailed = () => ({
    type: actionTypes.FETCH_POSITIONS_FAILED
})


export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const fetchallUserStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUser("ALL");
            let res1 = await getTopDoctorHome(3);
            console.log('check doctor', res1)
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()));
            } else {
                toast.success("fetch All user error!")
                dispatch(fetchAllUserFailed());
            }
        } catch (e) {
            toast.success("fetch All user error!")
            dispatch(fetchAllUserFailed());
            console.log(e)
        }
    }
}

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED,
})


export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await DeleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("delete a user success!")
                dispatch(deleteUserSuccess());
                dispatch(fetchallUserStart())
            } else {
                toast.success("delete a user error!")
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            toast.success("delete a user error!")
            dispatch(deleteUserFailed());
            console.log(e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCSESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})


export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("update a user success!")
                dispatch(editUserSuccess());
                dispatch(fetchallUserStart())
            } else {
                toast.success("update a user error!")
                dispatch(editUserFailed());
            }
        } catch (e) {
            toast.success("update a user error!")
            dispatch(editUserFailed());
            console.log(e)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCSESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHome('10');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctor: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_DOCTORS_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
}


export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAlldoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctor: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTORS_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
}


export const saveDetailDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctor(data);
            if (res && res.errCode === 0) {
                toast.success("save infor detail doctor success!")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                    dataDoctor: res.data
                })
            } else {
                toast.error("save infor detail doctor error!")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                })
            }
        } catch (e) {
            toast.error("save infor detail doctor error!")
            console.log('SAVE_DETAIL_DOCTOR_FAILED', e)
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
            })
        }
    }
}

export const fetchAllScheduleHours = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllcodeservice('TIME');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS,
                    datatime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_HOURS_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAILED,
            })
        }
    }
}

export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
            })

            let resPrice = await getAllcodeservice("PRICE");
            let resPayment = await getAllcodeservice("PAYMENT");
            let resProvince = await getAllcodeservice("PROVINCE");
            let resSpecialty = await getAllspecialty();
            let resClinic = await getAllClinic();

            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInforFailed());
            console.log(e)
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})