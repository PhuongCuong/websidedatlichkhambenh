import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
class OutstandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctor: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctor: this.props.topDoctorRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }
    render() {
        let allDoctor = this.state.arrDoctor;
        let { language } = this.props
        //allDoctor = allDoctor.concat(allDoctor).concat(allDoctor)
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.out-standing-doctor" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-infor" /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {allDoctor && allDoctor.length > 0 &&
                                allDoctor.map((item, index) => {
                                    let imagebase64 = '';
                                    if (item.image) {
                                        imagebase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    if (index === 0) {
                                    }
                                    let nameVi = `${item.positionData.valueVi},${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn},${item.firstName} ${item.lastName}`;
                                    return (
                                        <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div className='bg-image section-outstanding-doctor'
                                                        style={{ backgroundImage: `url(${imagebase64})` }}
                                                    />
                                                </div>

                                                <div className='position text-center'>
                                                    <h3>{language === LANGUAGES.VI ? nameVi : nameEn}</h3>
                                                    <h3>Cơ xương khớp</h3>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>
                    </div>

                </div>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
