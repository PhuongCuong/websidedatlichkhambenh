import db from "../models/index";
import user from "../models/user";
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

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

let handleUserlogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUseremail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {
                        email: email,

                    },
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = 'user not found';
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = 'your email is exist in your system . plz try other email!';
            }


            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUseremail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAlluser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';
            if (userId === 'ALL') {
                user = await db.User.findAll({
                })
            } if (userId && userId !== 'ALL') {
                user = await db.User.findOne({
                    where: {
                        id: userId
                    }
                })
            }
            resolve(user)
        } catch (e) {
            reject(e)
        }
    })
}

let createnewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkUseremail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'your email is already'
                })
            }
            else {
                let handleUserPasswordFromBcrypt = await handleUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: handleUserPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {

        let user = await db.User.findOne({
            where: { id: userId },
            raw: false
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'The user is not exist'
            })
        }
        // if (user)
        //     await user.destroy();
        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            errMessage: 'The user is delete'
        })
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'user not found id'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if (data.user) {
                    user.image = data.avatar;
                }
                await user.save()
                resolve({
                    errCode: 0,
                    errMessage: 'update the user success!'
                })

            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'user not found!'
                });
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllcodeservice = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramenter'
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }


        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    handleUserlogin: handleUserlogin,
    getAlluser: getAlluser,
    createnewUser: createnewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllcodeservice: getAllcodeservice

};