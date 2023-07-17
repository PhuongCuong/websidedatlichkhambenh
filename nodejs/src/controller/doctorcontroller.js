import doctorService from "../services/doctorService";


let getTopdoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAlldoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAlldoctors();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postInforDoctro = async (req, res) => {
    try {
        let respont = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(respont)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailDoctorbyIds = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorbyId(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedules(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getSchedulebyDate = async (req, res) => {
    try {
        let infor = await doctorService.getSchedulebyDates(req.query.doctorId, req.query.date);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getProfileDoctorbyId = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorbyId(req.query.doctorId);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getlistPatientforDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getlistPatientforDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}


let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedy(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

module.exports = {
    getTopdoctorHome: getTopdoctorHome,
    getAlldoctors: getAlldoctors,
    postInforDoctro: postInforDoctro,
    getDetailDoctorbyIds: getDetailDoctorbyIds,
    bulkCreateSchedule: bulkCreateSchedule,
    getSchedulebyDate: getSchedulebyDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorbyId: getProfileDoctorbyId,
    getlistPatientforDoctor: getlistPatientforDoctor,
    sendRemedy: sendRemedy
}