import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
//import { FormattedMessage } from 'react-intl';
import { handlelogin } from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowpassword: false,
            errMessage: ''
        }
    }

    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://kit.fontawesome.com/adc63797a7.js";
        script.async = true;

        document.body.appendChild(script);
    }

    handleOnechangeusername = (event) => {
        this.setState({
            username: event.target.value
        })
        console.log(event.target.value)
    }

    handleOnechangepassword = (event) => {
        this.setState({
            password: event.target.value
        })
        console.log(event.target.value)
    }

    handleOneclicklogin = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handlelogin(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginsuccess(data.user)
                console.log('login success')
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
            console.log(e.response)

        }

    }

    handleshowpass = () => {
        this.setState({
            isShowpassword: !this.state.isShowpassword
        })
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handlelogin();
        }
    }

    render() {


        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group'>
                            <label>UserName:</label>
                            <input type='text' className='form-control' placeholder='Enter your usename'
                                value={this.state.username}
                                onChange={(envent) => this.handleOnechangeusername(envent)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>PassWord:</label>
                            <div className='custom-input-password'>
                                <input type={this.state.isShowpassword ? 'text' : 'password'} className='form-control' placeholder='Enter your password'
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnechangepassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span onClick={() => { this.handleshowpass() }}>
                                    <i className={this.state.isShowpassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                                </span>

                            </div>

                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={() => { this.handleOneclicklogin() }}>Login</button>
                        </div>

                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password?</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span>Or login with:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fa-brands fa-google fa-2xs google"></i>
                            <i className="fa-brands fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginsuccess: (userInfo) => dispatch(actions.userLoginsuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
