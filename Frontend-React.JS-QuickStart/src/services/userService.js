import axios from "../axios"
const handlelogin = (email, password) => {
    return axios.post('api/login', { email, password })
}

const getAllUser = (inputid) => {
    return axios.get(`/api/get-all-user?id=${inputid}`)
}

const CreateNewUserModal = (data) => {
    return axios.post('/api/create-new-user', data)
}

const DeleteUserService = (userId) => {
    return axios.delete('/api/delete-user', { data: { id: userId } })
}

const editUserService = (inputdata) => {
    return axios.put('/api/edit-user', inputdata)
}


const getAllcodeservice = (inputType) => {
    return axios.get(`/allcode?type=${inputType}`)
}

const getTopDoctorHome = (limit) => {
    return axios.get(`api/top-doctor-home?limit=${limit}`)
}

const getAlldoctors = () => {
    return axios.get('/api/get-all-doctors')
}

const saveDetailDoctor = (data) => {
    return axios.post('/api/save-infor-doctor', data)
}

const getDetailInforDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data)
}



const getschedulebydate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorByid = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorbyId = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppoinetment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppoinetment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const CreateNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllspecialty = () => {
    return axios.get('/api/get-all-specialty')
}

const getDetailSpecialtybyId = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const CreateNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
    return axios.get('/api/get-clinic')
}


const getDetailClinictybyId = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)

}

const getAllpatienfordoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.id}&date=${data.date}`)

}

const PostsendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

export {
    handlelogin, getAllUser, CreateNewUserModal, DeleteUserService,
    editUserService, getAllcodeservice, getTopDoctorHome, getAlldoctors,
    saveDetailDoctor, getDetailInforDoctor, saveBulkScheduleDoctor, getschedulebydate,
    getExtraInforDoctorByid, getProfileDoctorbyId, postPatientBookAppoinetment, postVerifyBookAppoinetment
    , CreateNewSpecialty, getAllspecialty, getDetailSpecialtybyId, CreateNewClinic, getAllClinic,
    getDetailClinictybyId, getAllpatienfordoctor, PostsendRemedy

}