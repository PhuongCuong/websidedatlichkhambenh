import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss';
import { FormattedMessage } from 'react-intl';
import { getProfileDoctorbyId } from '../../services/userService'
import { result } from 'lodash';
import { LANGUAGES } from '../../utils';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment/moment';
import localization from 'moment/locale/vi'
import { Link } from "react-router-dom";

class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })

    }

    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorbyId(id);
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result;
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

        if (this.props.doctorId !== prevProps.doctorId) {
            // this.getInforDoctor(this.props.doctorId)
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                <>
                    <div>{time} - {date}</div>
                    <div>
                        <FormattedMessage id='patient.booking-modal.priceBooking' />

                    </div>
                </>
            )
        }
        return <></>

    }

    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime, isShowlinkDetail
            , isShowPrice, doctorId } = this.props;
        let nameVi, nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi},${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn},${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left' style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>

                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                <>
                                    {dataProfile && dataProfile.markdown && dataProfile.markdown.description &&
                                        <span>
                                            {dataProfile.markdown.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }

                        </div>
                    </div>
                </div>
                {isShowlinkDetail === true && <div className='view-detail-doctor'>
                    <Link to={`/detail-doctor/${doctorId}`}>Xem Thêm</Link>
                </div>}
                {isShowPrice === true &&
                    < div className='price'>
                        <FormattedMessage id='patient.booking-modal.price' />
                        {dataProfile && dataProfile.doctor_infor && language === LANGUAGES.VI &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.doctor_infor.priceTypeData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                        }

                        {dataProfile && dataProfile.doctor_infor && language === LANGUAGES.EN &&
                            < NumberFormat
                                className='currency'
                                value={dataProfile.doctor_infor.priceTypeData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'$'}
                            />

                        }
                    </div>
                }

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
