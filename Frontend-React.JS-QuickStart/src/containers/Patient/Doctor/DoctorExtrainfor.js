import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtrainfor.scss';
import Select from 'react-select';
import localization from 'moment/locale/vi'
import { LANGUAGES } from '../../../utils';
import { getschedulebydate, getExtraInforDoctorByid } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import { faL } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';

class DoctorExtrainfor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowdetailInfor: false,
            exTraInfor: {}
        }
    }

    async componentDidMount() {
        let res = await getExtraInforDoctorByid(this.props.doctorIdFromParent)
        if (res && res.errCode === 0) {
            this.setState({
                exTraInfor: res.data
            })
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorByid(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    exTraInfor: res.data
                })
            }

        }
    }


    showhideDetailInfor = (status) => {
        this.setState({
            isShowdetailInfor: status
        })
    }

    render() {
        let { isShowdetailInfor, exTraInfor } = this.state;
        let { language } = this.props
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extraInfor-doctor.text-address' />
                    </div>
                    <div className='name-clinic'>{exTraInfor && exTraInfor.nameClinic ? exTraInfor.nameClinic : ''}</div>
                    <div className='detail-address'>{exTraInfor && exTraInfor.addressClinic ? exTraInfor.addressClinic : ''}</div>
                </div>
                <div className='content-down'>

                    {isShowdetailInfor === false &&
                        <div>
                            <FormattedMessage id='patient.extraInfor-doctor.price' />

                            {exTraInfor && exTraInfor.priceTypeData && language === LANGUAGES.VI
                                &&
                                < NumberFormat
                                    className='currency'
                                    value={exTraInfor.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />
                            }

                            {exTraInfor && exTraInfor.priceTypeData && language === LANGUAGES.EN
                                &&
                                < NumberFormat
                                    className='currency'
                                    value={exTraInfor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'$'}
                                />
                            }

                            <span onClick={() => this.showhideDetailInfor(true)}>
                                <FormattedMessage id='patient.extraInfor-doctor.detail' />

                            </span>
                        </div>
                    }
                    {isShowdetailInfor === true &&
                        <>
                            <div className='title-price'>
                                <FormattedMessage id='patient.extraInfor-doctor.price' />

                            </div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>
                                        <FormattedMessage id='patient.extraInfor-doctor.price' />

                                    </span>
                                    <span className='right'>
                                        {exTraInfor && exTraInfor.priceTypeData && language === LANGUAGES.VI
                                            &&
                                            < NumberFormat
                                                className='currency'
                                                value={exTraInfor.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />
                                        }

                                        {exTraInfor && exTraInfor.priceTypeData && language === LANGUAGES.EN
                                            &&
                                            < NumberFormat
                                                className='currency'
                                                value={exTraInfor.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'$'}
                                            />
                                        }
                                    </span>
                                </div>

                                <div className='note'>
                                    {exTraInfor && exTraInfor.note ? exTraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id='patient.extraInfor-doctor.payment' />

                                {exTraInfor && exTraInfor.paymentTypeData && language === LANGUAGES.VI ?
                                    exTraInfor.paymentTypeData.valueVi : ''}
                                {exTraInfor && exTraInfor.paymentTypeData && language === LANGUAGES.EN ?
                                    exTraInfor.paymentTypeData.valueEn : ''}


                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showhideDetailInfor(false)}>
                                    <FormattedMessage id='patient.extraInfor-doctor.hide-price' />

                                </span>

                            </div>

                        </>
                    }



                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);
