import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllcodeservice } from '../../../services/userService'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions"
import "./UserRedux.scss";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableUserRedux from './TableUserRedux';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positonArr: [],
            roleArr: [],
            previewImg: [],
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            genders: '',
            positions: '',
            roles: '',
            avatar: '',

            action: '',
            userEditId: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionsStart();
        this.props.getRolesStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderReduxs !== this.props.genderReduxs) {
            let arrGender = this.props.genderReduxs;
            this.setState({
                genderArr: this.props.genderReduxs,
                genders: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : ''
            })
        }

        if (prevProps.roleReduxs !== this.props.roleReduxs) {
            let arrRole = this.props.roleReduxs;

            this.setState({
                roleArr: this.props.roleReduxs,
                roles: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : ''
            })
        }

        if (prevProps.positionReduxs !== this.props.positionReduxs) {
            let arrPosition = this.props.positionReduxs;
            this.setState({
                positonArr: this.props.positionReduxs,
                positions: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : ''
            })
        }

        if (prevProps.users !== this.props.users) {
            let arrGender = this.props.genderReduxs;
            let arrRole = this.props.roleReduxs;
            let arrPosition = this.props.positionReduxs;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                genders: '',
                positions: '',
                roles: '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImg: ''
            })
        }


    }
    handleOnChangefile = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let ObjectURL = URL.createObjectURL(file);
            this.setState({
                previewImg: ObjectURL,
                avatar: base64
            })
        }

    }

    handlepreviewImg = () => {
        if (!this.state.previewImg) return;
        this.setState({
            isOpen: true
        })
    }

    handleSave = () => {
        let isValid = this.handleCheckVaidataInput();
        if (isValid === false) return;

        let { action } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.genders,
                roleId: this.state.roles,
                positionId: this.state.positions,
                avatar: this.state.avatar
            })
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAUser({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.genders,
                roleId: this.state.roles,
                positionId: this.state.positions,
                avatar: this.state.avatar
            })
        }

    }

    handleCheckVaidataInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('this input is required:' + arrCheck[i]);
                break;
            }
        }
        return;
    }

    onChangeInput = (event, id) => {
        let copystate = { ...this.state };

        copystate[id] = event.target.value;
        this.setState({
            ...copystate
        })
        console.log('check state', this.state)
    }

    handleEditUserFromParent = (user) => {
        let imagebase64 = '';
        if (user.image) {
            imagebase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            genders: user.gender,
            positions: user.positionId,
            roles: user.roleId,
            avatar: '',
            previewImg: imagebase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id
        })
    }

    render() {
        let gender = this.state.genderArr;
        let role = this.state.roleArr;
        let position = this.state.positonArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;

        let { email, password, firstName, lastName,
            phoneNumber, address, genders, positions,
            roles, avatar } = this.state;

        return (
            <div className='user-redux-container'>
                <div className="title" >User Redux</div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id='manage-user.add' /></div>
                            <div className='col-12'>{isLoadingGender === true ? 'loading Gender' : ''}</div>
                            <div className='col-6'>
                                <label><FormattedMessage id='manage-user.email' /></label>
                                <input className='form-control' type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id='manage-user.password' /></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}

                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id='manage-user.firstName' /></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id='manage-user.lastName' /></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.phone' /></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id='manage-user.address' /></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.gender' /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'genders')}
                                    value={genders}
                                >
                                    {gender && gender.length > 0 &&
                                        gender.map((item, index) => {
                                            return (

                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'positions')}
                                    value={positions}
                                >
                                    {position && position.length > 0 &&
                                        position.map((item, index) => {
                                            return (

                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.role' /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'roles')}
                                    value={roles}
                                >
                                    {role && role.length > 0 &&
                                        role.map((item, index) => {
                                            return (

                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.image' /></label>
                                <div className='previewImg-container'>
                                    <input id='previewImg' type='file' onChange={(event) => this.handleOnChangefile(event)} />
                                    <label className='lable-upload' htmlFor='previewImg'>Tải ảnh <i className='fas fa-upload'></i></label>
                                    <div className='preview-image' style={{ backgroundImage: `url(${this.state.previewImg})` }}
                                        onClick={() => this.handlepreviewImg()}
                                    >

                                    </div>
                                </div>

                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                                    onClick={() => this.handleSave()}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ?
                                        < FormattedMessage id='manage-user.edit' />
                                        :
                                        < FormattedMessage id='manage-user.save' />
                                    }

                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableUserRedux
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {
                    this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImg}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >

        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderReduxs: state.admin.genders,
        roleReduxs: state.admin.roles,
        positionReduxs: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        users: state.admin.users

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),

        getPositionsStart: () => dispatch(actions.fetchPositionStart()),

        getRolesStart: () => dispatch(actions.fetchRolesStart()),

        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchallUserStart()),
        editAUser: (data) => dispatch(actions.editAUser(data))


        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
