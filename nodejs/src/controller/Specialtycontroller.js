import Specialtyservice from '../services/Specialtyservice'
let createSpecialty = async (req, res) => {
    try {
        let infor = await Specialtyservice.createSpecialtys(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getAllspecialty = async (req, res) => {
    try {
        let infor = await Specialtyservice.getAllspecialty();
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever'
        })
    }
}

let getDetailSpecialtybyId = async (req, res) => {
    try {
        let infor = await Specialtyservice.getDetailSpecialtybyId(req.query.id, req.query.location);
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
    createSpecialty: createSpecialty,
    getAllspecialty: getAllspecialty,
    getDetailSpecialtybyId: getDetailSpecialtybyId
}