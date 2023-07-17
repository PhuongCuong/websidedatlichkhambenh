const { promise } = require("bcrypt/promises");
const db = require("../models");
const { reject } = require("lodash");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                await db.Clinic.create({
                    image: data.imageBase64,
                    name: data.name,
                    address: data.address,
                    decscriptionHTML: data.descriptionHTML,
                    descriptionMarkDown: data.descriptionMarkDown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllclinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
            });

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })
            }
        } catch (e) {
            reject(e)
        }

    })
}

let getDetailClinicbyId = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parament!'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'decscriptionHTML', 'descriptionMarkDown'],
                })


                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.doctor_infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'proviceId'],

                    })
                    data.doctorClinic = doctorClinic;
                }
                else { data = {} }
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    createClinic: createClinic,
    getAllclinic: getAllclinic,
    getDetailClinicbyId: getDetailClinicbyId
}