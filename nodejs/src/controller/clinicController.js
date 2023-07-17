import Clinicservice from '../services/Clinicserviec';
let createClinic = async (req, res) => {
    try {
        let infor = await Clinicservice.createClinic(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getAllclinic = async (req, res) => {
    try {
        let infor = await Clinicservice.getAllclinic();
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getDetailClinicbyId = async (req, res) => {
    try {
        let infor = await Clinicservice.getDetailClinicbyId(req.query.id);
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
    createClinic: createClinic,
    getAllclinic: getAllclinic,
    getDetailClinicbyId: getDetailClinicbyId
}