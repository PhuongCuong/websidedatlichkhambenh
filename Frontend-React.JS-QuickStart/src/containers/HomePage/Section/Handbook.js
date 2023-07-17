import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";



class Handbook extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    render() {

        return (
            <div className='section-share section-Handbooks'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm Nang</span>
                        <button className='btn-section'>Xem Thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 1</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 2</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 3</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 4</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 5</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-Handbook' />
                                <h3>Cơ Xương Khớp 6</h3>
                            </div>
                        </Slider>
                    </div>

                </div>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
