import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableUserRedux.scss';
import * as actions from "../../../store/actions"
import { ToastContainer, toast } from 'react-toastify';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableUserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            userRedux: []
        })
    }


    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.users != this.props.users) {
            this.setState({
                userRedux: this.props.users
            })
        }
    }

    handleDelete = (user) => {
        this.props.deleteAUser(user.id)
    }

    handleEdit = (user) => {
        this.props.handleEditUserFromParent(user)
    }

    render() {
        let arrUser = this.state.userRedux;
        return (
            <React.Fragment>
                <table id='TableUserRedux'>
                    <tr>
                        <th>email</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                    {arrUser && arrUser.length > 0 &&
                        arrUser.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className='btn-edit'
                                            onClick={() => { this.handleEdit(item) }}
                                        ><i className="fa-solid fa-pencil"></i></button>
                                        <button className='btn-delete'
                                            onClick={() => { this.handleDelete(item) }}
                                        ><i className="fa-solid fa-trash"></i></button>
                                    </td>

                                </tr>
                            )
                        })
                    }
                </table>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchallUserStart()),
        deleteAUser: (id) => dispatch(actions.deleteAUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableUserRedux);
