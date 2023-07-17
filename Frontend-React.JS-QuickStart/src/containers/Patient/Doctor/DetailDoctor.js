import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import Homeheader from '../../HomePage/Homeheader';
import './DetailDoctor.scss';
import { getDetailInforDoctor } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtrainfor from './DoctorExtrainfor';
class DetailDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detaildoctor: {},
            currentDoctorId: -1,

        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            let res = await getDetailInforDoctor(id)
            if (res && res.errCode === 0) {
                this.setState({
                    detaildoctor: res.data,
                    currentDoctorId: id
                })
            }

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorRedux
            })
        }
    }

    render() {
        let { detaildoctor } = this.state;
        let { language } = this.props;
        let nameVi, nameEn = '';
        if (detaildoctor && detaildoctor.positionData) {
            nameVi = `${detaildoctor.positionData.valueVi},${detaildoctor.lastName} ${detaildoctor.firstName}`;
            nameEn = `${detaildoctor.positionData.valueEn},${detaildoctor.firstName} ${detaildoctor.lastName}`;
        }

        return (
            <>
                <Homeheader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left' style={{ backgroundImage: `url(${detaildoctor && detaildoctor.image ? detaildoctor.image : ''})` }}>

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detaildoctor && detaildoctor.markdown && detaildoctor.markdown.description &&
                                    <span>
                                        {detaildoctor.markdown.description}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className='content-right'>
                            <DoctorExtrainfor
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {detaildoctor && detaildoctor.markdown && detaildoctor.markdown.contenHTML
                            &&
                            <div dangerouslySetInnerHTML={{ __html: detaildoctor.markdown.contenHTML }}>

                            </div>
                        }
                    </div>
                    <div className='comment-doctor'>

                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
