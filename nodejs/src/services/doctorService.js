import db from "../models/index";
require('dotenv').config();
import _, { flatMap } from 'lodash'
import emailService from '../services/EmailService';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAlldoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contenMarkdown', 'actions',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic'
        , 'addressClinic', 'note', 'specialtyId'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false;
            element = arr[i]
            break;
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let checkObject = checkRequiredFields(data);

            if (checkObject.isValid === false
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObject.element}`
                })
            }
            else {

                // upsert to Markdown
                if (data.actions === 'CREATE') {
                    await db.markdown.create({
                        contenHTML: data.contentHTML,
                        contenMarkdown: data.contenMarkdown,
                        description: data.description,
                        doctorId: data.doctorId
                    })
                } else if (data.actions === 'EDIT') {
                    let doctorMarkdown = await db.markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contenHTML = data.contenHTML;
                        doctorMarkdown.contenMarkdown = data.contenMarkdown;
                        doctorMarkdown.description = data.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                // upsert to infor doctor
                let doctorInfor = await db.doctor_infor.findOne({
                    where: {
                        doctorId: data.doctorId,

                    },
                    raw: false
                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorId = data.doctorId;
                    doctorInfor.priceId = data.selectedPrice;
                    doctorInfor.proviceId = data.selectedProvince;
                    doctorInfor.paymentId = data.selectedPayment;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.note = data.note;
                    doctorInfor.specialtyId = data.specialtyId;
                    doctorInfor.clinicId = data.clinicId

                    await doctorInfor.save()
                } else {
                    //create
                    await db.doctor_infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        proviceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId
                    })

                }
                resolve({
                    errCode: 0,
                    errMessage: 'save Infor doctor success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorbyId = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.markdown,
                            attributes: ['description', 'contenHTML', 'contenMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'proviTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedules = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })



                //convert date
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                //compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getSchedulebyDates = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let datas = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [{
                        model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']
                    },
                    ],
                    raw: false,
                    nest: true
                })

                if (!datas) datas = [];

                resolve({
                    errCode: 0,
                    data: datas
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.doctor_infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'proviTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorbyId = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.markdown,
                            attributes: ['description']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.doctor_infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'proviTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');

                }

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getlistPatientforDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData', attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },

                        {
                            model: db.Allcode, as: 'timeTypeDataPaitient', attributes: ['valueEn', 'valueVi'],

                        }


                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false,

                })

                if (appointment) {
                    //update
                    appointment.statusId = 'S3'

                    await appointment.save()
                }
                //send email remedy
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAlldoctors: getAlldoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorbyId: getDetailDoctorbyId,
    bulkCreateSchedules: bulkCreateSchedules,
    getSchedulebyDates: getSchedulebyDates,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorbyId: getProfileDoctorbyId,
    getlistPatientforDoctor: getlistPatientforDoctor,
    sendRemedy: sendRemedy
}