import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }

        this.listToEmitter()
    }

    listToEmitter() {
        emitter.on("EVENT_CLEAR_MODAL_DATA", data => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
            })
        })
    }

    componentDidMount() {
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



    handleAddNewUser = () => {
        let isVaild = this.checkValidata()
        if (isVaild === true) {
            this.props.createNewUser(this.state)
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
                    <ModalHeader toggle={() => { this.toggle() }}>Create new a user</ModalHeader>
                    <ModalBody>
                        <div className='container'>
                            <div className='modal-user-body'>
                                <div className='input-container'>
                                    <label>Email</label>
                                    <input type='text' onChange={(event) => this.handleOneClick(event, 'email')} value={this.state.email} />
                                </div>
                                <div className='input-container'>
                                    <label>password</label>
                                    <input type='password' onChange={(event) => this.handleOneClick(event, 'password')} value={this.state.password} />
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
                        <Button color="primary" className='px-3' onClick={() => { this.handleAddNewUser() }}>Add new</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
