import express from "express";
import homcontrollers from "../controller/homecontroller";
import userController from "../controller/usercontroller";
import doctorController from "../controller/doctorcontroller";
import patientcontroller from "../controller/patientcontroller";
import Specialtycontroller from "../controller/Specialtycontroller";
import clinicController from '../controller/clinicController';
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homcontrollers.getHomePage);
    router.get('/about', homcontrollers.getAbout);
    router.get('/crud', homcontrollers.getCRUD);
    router.post('/post-crud', homcontrollers.postCRUD);
    router.get('/get-crud', homcontrollers.displaygetCRUD);
    router.get('/edit-crud', homcontrollers.getEditCRUD);
    router.post('/put-crud', homcontrollers.putCRUD);
    router.get('/delete-crud', homcontrollers.deleteCRUD);

    router.post('/api/login', userController.handlelogin);
    router.get('/api/get-all-user', userController.handGetAlluser);
    router.post('/api/create-new-user', userController.handleCreatenewuser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/allcode', userController.getAllcode);

    router.get('/api/top-doctor-home', doctorController.getTopdoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAlldoctors);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctro);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorbyIds);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getSchedulebyDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorbyId);


    router.get('/api/get-list-patient-for-doctor', doctorController.getlistPatientforDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);


    router.post('/api/patient-book-appointment', patientcontroller.postBookAppointment);
    router.post('/api/verify-book-appointment', patientcontroller.postVerifyAppointment);

    router.post('/api/create-new-specialty', Specialtycontroller.createSpecialty);
    router.get('/api/get-all-specialty', Specialtycontroller.getAllspecialty);
    router.get('/api/get-detail-specialty-by-id', Specialtycontroller.getDetailSpecialtybyId);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllclinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicbyId);



    return app.use("/", router);


}

module.exports = initWebRoutes;