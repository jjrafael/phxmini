import React from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ensureAppIsAllowed from 'componentsV2/ensureAppIsAllowed/index';
import appNames from 'constants/appNames'
import { useApp, fetchAppPermissions } from 'actions/apps'
import { startupApp } from 'actions/startup'
import { fetchOperatorGroups, fetchApplications, fetchActions, fetchReports, submitOperatorData } from './actions'
import constants from './constants'
import Header from '../Header';
import Main from '../Main';
import Sidebar from './Sidebar';

const mapStateToProps = (state) => {
  return {
    startup: state.startup,
    user: state.user.details,
    operatorGroups: state.operatorManagerApp.operatorGroups,
    operatorGroupsIndex: state.operatorManagerApp.operatorGroupsIndex,
    operatorGroupsStatus: state.operatorManagerApp.operatorGroupsStatus,
    isFetchingAppPermissions: state.apps.isFetchingAppPermissions
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    startupApp,
    useApp,
    fetchOperatorGroups,
    fetchApplications,
    fetchActions,
    fetchReports,
    submitOperatorData,
    fetchAppPermissions
  }, dispatch)
}

class OperatorManager extends React.Component {


  constructor(props) {
    super(props)
    this._operatorSelect = this._operatorSelect.bind(this)
    this._isFormReady = this._isFormReady.bind(this)

    this.state = {
      formStatus: null,
      formMode: null,
      formContentType: null, 
      formData: {},
      selectedOperatorGroupId: null,
      selectedOperatorId: null,
    }
  }

  componentDidMount() {
    this.props.fetchAppPermissions(this.props.user.id, 7);
    this.props.startupApp(appNames.OPERATOR_MANAGER)
    this.props.useApp(this.props.user.id, constants.APPLICATION_ID)
  }

  _buildFormData({operatorGroupId, operatorId}) {
    let formData = {}
    let formContentType = null
    // const formContentType = (operatorId === null) ? constants.OPERATORGROUP : constants.OPERATOR
    const {operatorGroups} = this.props
    const operatorGroupData = operatorGroups[operatorGroupId]

    // start building the formData
    formData = {
      operatorGroupId: operatorGroupId,
      operatorGroupDescription: operatorGroupData.description,
      operatorGroupEmail: operatorGroupData.email,
    }

    if (operatorId === null) {
      formContentType = constants.OPERATORGROUP
    } else {
      formContentType = constants.OPERATOR
      const operators = operatorGroupData.operators
      const operatorData = operators.filter((operator)=>{ return (operator.id === operatorId) })[0]

      formData = {
        ...formData,
        ...operatorData
      }
    }

    this.setState({
      formData : formData,
      selectedOperatorGroupId: operatorGroupId,
      selectedOperatorId: operatorId,
      formMode: constants.FORM_MODE_EDIT,
      formStatus: constants.FORM_LOADING,
      formContentType: formContentType,
    })

  }

  _renderLoadingIndicator() {
    return (
      <div className="loading tcenter">
          <i className="phxico phx-spinner phx-spin"></i>
        <h3>Loading {appNames.OPERATOR_MANAGER}</h3>
      </div>
      )
  }

  _isFormReady() {
    const {formStatus} = this.state
    if (formStatus === constants.FORM_READY || formStatus===null) {
      return true
    } else if (formStatus === constants.FORM_CHANGED) {
      // TODO: Better popup
      alert('Your changes has not been saved yet.')
      return false
    } else {
      return false
    }
  }

  

  _operatorSelect({operatorGroupId, operatorId}) {
    if (this.state.selectedOperatorGroupId !== operatorGroupId || this.state.selectedOperatorId !== operatorId){
      if (this._isFormReady()) {
        this._buildFormData({operatorGroupId, operatorId})
      }
    }
  }

  render() {
    const {
      startup,
      user,
      operatorGroups,
      operatorGroupsIndex,
      operatorGroupsStatus,
      isFetchingAppPermissions
    } = this.props

    const {formData} = this.state
    const app = startup.apps[appNames.OPERATOR_MANAGER];
    const isAppStartingUp =  app && app.isStartingUp;
    if(!startup.apps[appNames.OPERATOR_MANAGER] || isAppStartingUp || isFetchingAppPermissions) {
      return this._renderLoadingIndicator();
  }
    return (
    <div id="app-operator-manager">
      <Header />
      <section className="page-container">
        <Sidebar 
          operatorGroups={operatorGroups} 
          operatorGroupsIndex={operatorGroupsIndex} 
          operatorGroupsStatus={operatorGroupsStatus} 
          clickHandler={this._operatorSelect} 
          selectedOperatorGroupId={this.state.selectedOperatorGroupId}
          selectedOperatorId={this.state.selectedOperatorId} />
        <Main />
      </section>
      
    </div>)
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ensureAppIsAllowed({appKey: 'OPERATOR_MANAGER'})(OperatorManager))
