import userserviec from '../services/userServiec';
let handlelogin = async (req, res) => {
    let email = req.body.email;
    console.log('youremail' + email)
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input paremeter!'
        })
    }

    let userData = await userserviec.handleUserlogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })



}

let handGetAlluser = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing required paramenters',
            users: []
        })
    }
    let users = await userserviec.getAlluser(id);
    console.log(users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}

let handleCreatenewuser = async (req, res) => {
    let message = await userserviec.createnewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let userId = req.body;
    let message = await userserviec.updateUser(userId);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        })
    }
    let message = await userserviec.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllcode = async (req, res) => {
    try {
        let data = await userserviec.getAllcodeservice(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        console.log('get all code server', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


module.exports = {
    handlelogin: handlelogin,
    handGetAlluser: handGetAlluser,
    handleCreatenewuser: handleCreatenewuser,
    handleDeleteUser: handleDeleteUser,
    handleEditUser: handleEditUser,
    getAllcode: getAllcode


};