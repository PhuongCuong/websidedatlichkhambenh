import React, { Component } from 'react';
import { connect } from "react-redux";
import './Manageschedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from "../../../store/actions"
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService'

class Manageschedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctor: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.featchAlldoctor();
        this.props.fetchAllScheduleHours();
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevProps.topDoctor !== this.props.topDoctor) {
            let dataSelect = this.builDataInputSelect(this.props.topDoctor)
            this.setState({
                listDoctor: dataSelect
            })
        }
        if (prevProps.allscheduletime !== this.props.allscheduletime) {
            let data = this.props.allscheduletime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

    builDataInputSelect = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {


                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChange = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };

    handleOnChangleDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }


    handleClickBtntime = (time) => {

        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error("Invalid date!")
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected Doctor!")
            return;
        }

        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)
        // let formatedDate = moment(currentDate).unix()
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })

            } else {
                toast.error("Invalid selected time!")

            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate
        })

        if (res && res.errCode === 0) {
            toast.success('success save')
        } else {
            toast.error('error save')
        }
    }

    render() {
        let { rangeTime } = this.state
        let { language } = this.props
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));


        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listDoctor}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker onChange={this.handleOnChangleDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            onClick={() => this.handleClickBtntime(item)}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule' onClick={() => this.handleSaveSchedule()}><FormattedMessage id='manage-schedule.save-doctor' /></button>

                        </div>
                    </div>
                </div>
            </div >

        );
    }
}

const mapStateToProps = state => {
    return {
        ManagescheduleMenuPath: state.app.ManagescheduleMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        topDoctor: state.admin.topDoctor,
        allscheduletime: state.admin.allscheduletime,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        featchAlldoctor: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleHours: () => dispatch(actions.fetchAllScheduleHours()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Manageschedule);
