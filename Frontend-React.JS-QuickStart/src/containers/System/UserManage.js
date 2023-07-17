import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManager.scss';
import { getAllUser, CreateNewUserModal, DeleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
import ModaleditUser from './ModaleditUser';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            arrUser: [],
            isOpenModal: false,
            isOpenModalUser: false,
            userEdit: {}
        })
    }
    async componentDidMount() {
        await this.getAluserFromReact();
    }

    getAluserFromReact = async () => {
        let response = await getAllUser('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUser: response.users
            }, () => {
            })
        }
    }

    handleAddnewUser = () => {
        this.setState({
            isOpenModal: true
        })
    }


    toggleUserModals = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
        })
    }

    createNewUser = async (data) => {
        try {
            let reponce = await CreateNewUserModal(data);
            if (reponce && reponce.errCode !== 0) {
                alert(reponce.message)
            }
            else {
                await this.getAluserFromReact()
                this.setState({
                    isOpenModal: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA', { 'id': 'Your id' })
            }
        } catch (error) {
        }

    }

    handleEdit = (user) => {
        this.setState({
            isOpenModalUser: true,
            userEdit: user
        })
    }

    handleeditUser = async (user) => {
        let res = await editUserService(user);
        try {
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalUser: false
                })
                await this.getAluserFromReact()
            }
            else {
                alert(res.errCode)
            }
        } catch (e) {
            console.log(e)
        }

    }

    handleDelete = async (user) => {
        try {
            let res = await DeleteUserService(user.id);
            if (res && res.errCode !== 0) {
                alert(res.message)
            }
            else {
                await this.getAluserFromReact()
            }
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    toggleUseredit = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }


    render() {
        let arrUser = this.state.arrUser;
        return (
            <div className="text-centers">
                <div className='title' style={{ textAlign: 'center' }}>Manage users with cuongnguyen</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={() => { this.handleAddnewUser() }}><i className="fa-solid fa-plus"></i>Add new user</button>
                </div>
                <div className='table-view'>
                    <table id="customers">
                        <tr>
                            <th>email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {arrUser && arrUser.map((item, index) => {
                            return (
                                <tr>

                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className='btn-edit' onClick={() => { this.handleEdit(item) }}><i className="fa-solid fa-pencil"></i></button>
                                        <button className='btn-delete' onClick={() => { this.handleDelete(item) }}><i className="fa-solid fa-trash"></i></button>
                                    </td>

                                </tr>
                            )
                        })}
                    </table>
                </div>
                <ModalUser
                    isOpen={this.state.isOpenModal}
                    toggleUserModal={this.toggleUserModals}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalUser &&
                    <ModaleditUser
                        isOpen={this.state.isOpenModalUser}
                        toggleUserModal={this.toggleUseredit}
                        currentUser={this.state.userEdit}
                        editUser={this.handleeditUser}
                    />
                }
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
