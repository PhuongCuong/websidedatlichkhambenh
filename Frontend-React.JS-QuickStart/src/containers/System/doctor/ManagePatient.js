import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllpatienfordoctor, PostsendRemedy } from '../../../services/userService'
import moment from 'moment/moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal'
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowloading: false
        }
    }

    async componentDidMount() {

        this.getDataPatient()
    }


    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;

        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllpatienfordoctor({
            id: user.id,
            date: formatedDate
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangleDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {

            await this.getDataPatient()
        })
    }
    handlebtnComfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            language: this.props.language,
            patientName: item.patientData.firstName
        }

        console.log('check data', data)
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }
    closeRemeryModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataFromModal) => {
        let { dataModal } = this.state;
        this.setState({
            isShowloading: true
        })
        let res = await PostsendRemedy({
            email: dataFromModal.email,
            imgBase64: dataFromModal.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName


        })
        if (res && res.errCode === 0) {
            this.setState({
                isShowloading: false
            })
            toast.success('Send Remedy success!')
            this.closeRemeryModal()
            await this.getDataPatient()

        }
        else {
            this.setState({
                isShowloading: false
            })
            toast.error('Send gemery error')
        }
    }

    render() {
        console.log('check prop', this.state)
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowloading}
                    spinner
                    text='Loading your content...'
                >
                    <div className='manager-patient-contener'>
                        <div className='m-p-title'>Quản lý bệnh nhận khám bệnh</div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker onChange={this.handleOnChangleDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                // minDate={yesterday}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và Tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Giới tính</th>
                                        <th>Actions</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ? item.timeTypeDataPaitient.valueVi
                                                : item.timeTypeDataPaitient.valueEn;
                                            let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi :
                                                item.patientData.genderData.valueEn
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{gender}</td>
                                                    <td>
                                                        <button className='mp-btn-confirm' onClick={() => {
                                                            this.handlebtnComfirm(item)
                                                        }}>Xác nhận</button>

                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>

                                            <td colSpan='6' style={{ textAlign: 'center' }}>
                                                no data
                                            </td>
                                        </tr>
                                    }

                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemeryModal={this.closeRemeryModal}
                        sendRemedy={this.sendRemedy}
                    />

                    <p>Some content or children or something.</p>
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
