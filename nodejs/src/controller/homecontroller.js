

import db from '../models/index';
import CRUDserviec, { CreateNewUser } from '../services/CRUDserviec';
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });

    } catch (e) {
        console.log(e)
    }



}

let getAbout = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('test/crud.ejs');
}

let postCRUD = async (req, res) => {
    let messiger = await CRUDserviec.CreateNewUser(req.body);
    console.log(messiger)
    console.log(req.body);
    return res.send('get crud from server');
}

let displaygetCRUD = async (req, res) => {
    let data = await CRUDserviec.getAlluser();
    console.log('-------------------------');
    console.log(data);
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);
    if (userId) {
        let userData = await CRUDserviec.getUserInfobyId(userId)
        console.log('------------')
        console.log(userData)
        console.log('------------')
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('user not found!');
    }

}

let putCRUD = async (req, res) => {
    let data = req.body;
    let alluser = await CRUDserviec.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: alluser
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDserviec.deleteUserbyId(id);
        return res.send('delete user succed!')
    }
    else {
        return res.send('user not found')
    }

}

module.exports = {
    getHomePage: getHomePage,
    getAbout: getAbout,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displaygetCRUD, displaygetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,

}

