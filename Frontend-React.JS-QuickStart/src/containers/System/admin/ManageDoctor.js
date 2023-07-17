import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions"
import { ToastContainer, toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import { result } from 'lodash';
import { getDetailInforDoctor } from '../../../services/userService';


const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctor: [],
            hasOlData: false,


            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinitc: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: ''
        })
    }


    componentDidMount() {
        this.props.featchAlldoctor()
        this.props.getAllrequiredDoctorInfor()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.topDoctor !== this.props.topDoctor) {
            let dataSelect = this.builDataInputSelect(this.props.topDoctor, 'USERS')
            this.setState({
                listDoctor: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor
            let dataSelectPrice = this.builDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.builDataInputSelect(resPayment, "PAYMENT")
            let dataSelectProvince = this.builDataInputSelect(resProvince, "PROVINCE")
            let dataSelectSpecialty = this.builDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.builDataInputSelect(resClinic, 'CLINIC')
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinitc: dataSelectClinic
            })

        }
        if (prevProps.language !== this.props.language) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor
            let dataSelect = this.builDataInputSelect(this.props.topDoctor, 'USERS')
            let dataSelectPrice = this.builDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.builDataInputSelect(resPayment, "PAYMENT")
            let dataSelectProvince = this.builDataInputSelect(resProvince, "PROVINCE")
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listDoctor: dataSelect

            })
        }
    }

    builDataInputSelect = (data, type) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            if (type === 'USERS') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'PRICE') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'SPECIALTY') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }

            if (type === 'CLINIC') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }

        }
        return result;
    }

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSavecontentmarkdown = () => {
        let { hasOlData } = this.state;
        this.props.saveDetailDoctors({
            contentHTML: this.state.contentHTML,
            contenMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            actions: hasOlData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty && this.state.selectedSpecialty.value ? this.state.selectedSpecialty.value : ''
        })
    }

    handleChange = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPayment, listPrice, listProvince, listSpecialty, listClinitc } = this.state
        let res = await getDetailInforDoctor(selectedOption.value)
        if (res && res.errCode === 0 && res.data.markdown) {
            let markdown = res.data.markdown;
            let addressClinic = '', nameClinic = '', note = '', paymentId = '', specialtyId = '',
                clinictId = '',
                priceId = '', proviceId = '', selectedPrice = '', selectedPayment = '',
                selectedProvince = '', selectedSpecialty = '', selectedClinic = '';


            if (res.data.doctor_infor) {
                addressClinic = res.data.doctor_infor.addressClinic;
                nameClinic = res.data.doctor_infor.nameClinic;
                note = res.data.doctor_infor.note;

                paymentId = res.data.doctor_infor.paymentId;
                priceId = res.data.doctor_infor.priceId;
                proviceId = res.data.doctor_infor.proviceId;
                specialtyId = res.data.doctor_infor.specialtyId;
                clinictId = res.data.doctor_infor.clinicId;

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })

                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })

                selectedProvince = listProvince.find(item => {
                    return item && item.value === proviceId
                })

                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId
                })

                selectedClinic = listClinitc.find(item => {
                    return item && item.value === clinictId
                })

            }

            console.log('check clinic', clinictId, selectedClinic)

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contenMarkdown,
                description: markdown.description,
                hasOlData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            })
        } else {
            let markdown = res.data.markdown;
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOlData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: ''
            })
        }
    };

    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;

        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }


    render() {
        let { hasOlData, listSpecialty } = this.state;
        let arrUser = this.state.userRedux;
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id='admin.manage-doctor.title' />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.select-doctor' />
                        </label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.listDoctor}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.select-doctor' />

                            }
                        />
                    </div>

                    <div className='content-right'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.infor' />

                        </label>
                        <textarea className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>
                </div>

                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.price' />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.price' />

                            }
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.payment' />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.payment' />

                            }
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.province' />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.province' />

                            }
                            name="selectedProvince"
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.nameClinic' />

                        </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.addressClinic' />

                        </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        ></input>
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.note' />

                        </label>
                        <input className='form-control'
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        ></input>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.specialty' />
                        </label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.specialty' />

                            }
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.selectClinit' />

                        </label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinitc}
                            placeholder={
                                <FormattedMessage id='admin.manage-doctor.selectClinit' />

                            }
                            name="selectedClinic"
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />

                </div>

                <button
                    onClick={() => { this.handleSavecontentmarkdown() }}
                    className={hasOlData === true ? "save-content-doctor" : "create-content-doctor"}>
                    {hasOlData === true ?
                        <span>
                            <FormattedMessage id='admin.manage-doctor.add' />
                        </span> :
                        <span>
                            <FormattedMessage id='admin.manage-doctor.save' />

                        </span>}
                </button>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        topDoctor: state.admin.topDoctor,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        featchAlldoctor: () => dispatch(actions.fetchAllDoctor()),
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data)),
        getAllrequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),


    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
