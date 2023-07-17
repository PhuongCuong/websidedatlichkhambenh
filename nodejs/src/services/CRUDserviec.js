
import bcrypt from 'bcrypt';
import db from '../models/index';
import user from '../models/user';

const salt = bcrypt.genSaltSync(10);

const { promiseImpl } = require("ejs")

let CreateNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handleUserPasswordFromBcrypt = await handleUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: handleUserPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('ok create a new user success!')
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

let getAlluser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfobyId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId,
                },
                raw: true
            });
            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let alluser = await db.User.findAll();
                resolve(alluser);
            }
            else {
                resolve();
            }
        } catch (e) {
            reject(e)
        }
    })
    console.log('data from service');
    console.log(data)
}

let deleteUserbyId = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userid
                }
            })

            if (user) {
                user.destroy();
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    CreateNewUser: CreateNewUser,
    getAlluser: getAlluser,
    getUserInfobyId: getUserInfobyId,
    updateUserData: updateUserData,
    deleteUserbyId: deleteUserbyId
}