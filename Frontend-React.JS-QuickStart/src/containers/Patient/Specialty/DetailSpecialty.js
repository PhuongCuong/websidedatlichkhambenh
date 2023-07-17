import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import Homeheader from '../../HomePage/Homeheader';
import { withRouter } from 'react-router';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtrainfor from '../Doctor/DoctorExtrainfor';
import ProfileDoctor from '../ProfileDoctor';
import { getDetailSpecialtybyId, getAllcodeservice } from '../../../services/userService'
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvice: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailSpecialtybyId({
                id: id,
                location: 'ALL'
            })
            let resProvice = await getAllcodeservice('PROVINCE')
            if (res && res.errCode === 0 && resProvice && resProvice.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)

                        })
                    }
                }

                let datapovice = resProvice.data;
                if (datapovice && datapovice.length > 0) {
                    datapovice.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueEn: 'ALL',
                        valueVi: 'Toàn quốc'
                    })
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvice: datapovice
                })
            }

        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }


    handleOnchangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;

            let res = await getDetailSpecialtybyId({
                id: id,
                location: location
            })
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)

                        })
                    }
                }


                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvice } = this.state;
        let { language } = this.props;
        return (
            <div className='detail-specialty-container'>
                <Homeheader />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                            &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.decscriptionHTML }}>

                            </div>
                        }

                    </div>
                    <div className='Search-sp-doctor'>
                        <select onChange={(event) => this.handleOnchangeSelect(event)}>
                            {listProvice && listProvice.length > 0 &&
                                listProvice.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }


                        </select>
                    </div>
                    {arrDoctorId && arrDoctorId.length > 0
                        && arrDoctorId.map((item, index) => {
                            return (
                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowlinkDetail={true}
                                                isShowPrice={false}
                                            // dataTime={dataTime}
                                            />
                                        </div>
                                    </div>
                                    <div className='dt-content-right'>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule
                                                doctorIdFromParent={item}
                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtrainfor
                                                doctorIdFromParent={item}
                                            />
                                        </div>

                                    </div>
                                </div>

                            )
                        })
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
