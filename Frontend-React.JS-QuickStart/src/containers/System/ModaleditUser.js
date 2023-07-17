import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash'
class ModaleditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }


    componentDidMount() {
        let user = this.props.currentUser
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'harcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
    }

    toggle = () => {
        this.props.toggleUserModal();
    }

    handleOneClick = (event, id) => {
        let copy = { ...this.state };
        copy[id] = event.target.value;

        this.setState({
            ...copy
        })

    }

    checkValidata = () => {
        let isvalid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isvalid = false;
                alert('Missing parament');
                break;
            }
        }
        return isvalid;
    }



    handleSaveUser = () => {
        let isVaild = this.checkValidata()
        if (isVaild === true) {
            this.props.editUser(this.state)
        }

    }


    render() {

        return (
            <div>
                <Button color="danger" onClick={() => { this.toggle() }}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.props.isOpen}
                    toggle={() => { this.toggle() }}
                    className={'modal-user-container'}
                    size='lg'
                >
                    <ModalHeader toggle={() => { this.toggle() }}>Edit a User</ModalHeader>
                    <ModalBody>
                        <div className='container'>
                            <div className='modal-user-body'>
                                <div className='input-container'>
                                    <label>Email</label>
                                    <input type='text' onChange={(event) => this.handleOneClick(event, 'email')} value={this.state.email}
                                        disabled />
                                </div>
                                <div className='input-container'>
                                    <label>password</label>
                                    <input type='password' onChange={(event) => this.handleOneClick(event, 'password')} value={this.state.password}
                                        disabled />
                                </div>
                                <div className='input-container'>
                                    <label>Frist Name</label>
                                    <input type='text' onChange={(event) => this.handleOneClick(event, 'firstName')} value={this.state.firstName} />
                                </div>
                                <div className='input-container'>
                                    <label>Last Name</label>
                                    <input type='text' onChange={(event) => this.handleOneClick(event, 'lastName')} value={this.state.lastName} />
                                </div>
                                <div className='input-container max-width-input'>
                                    <label>Address</label>
                                    <input type='text' onChange={(event) => this.handleOneClick(event, 'address')} value={this.state.address} />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" className='px-3' onClick={() => { this.handleSaveUser() }}>save changes</Button>{' '}
                        <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModaleditUser);
