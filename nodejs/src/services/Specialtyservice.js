const { promise } = require("bcrypt/promises");
const db = require("../models");
const { reject } = require("lodash");

let createSpecialtys = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            } else {
                console.log('check data', data)
                await db.Specialty.create({
                    image: data.imageBase64,
                    name: data.name,
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

let getAllspecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
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

let getDetailSpecialtybyId = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parament!'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['decscriptionHTML', 'descriptionMarkDown'],
                })


                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.doctor_infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'proviceId'],

                        })
                    }
                    else {
                        doctorSpecialty = await db.doctor_infor.findAll({
                            where: {
                                specialtyId: inputId,
                                proviceId: location
                            },
                            attributes: ['doctorId', 'proviceId'],

                        })
                    }

                    data.doctorSpecialty = doctorSpecialty;
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
    createSpecialtys: createSpecialtys,
    getAllspecialty: getAllspecialty,
    getDetailSpecialtybyId: getDetailSpecialtybyId
}