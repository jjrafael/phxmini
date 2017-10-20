import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import OperatorGroup from 'components/OperatorGroup'
import {
  fetchOperatorGroups,
  selectOperator,
  filterGroup,
  searchOperator,
  fetchOperatorGroupsByStatus,
  toggleWarningModal
} from './actions'
import { showNewOperatorModal, showNewOperatorGroupModal } from '../App/actions'
import { clearForm } from '../GroupForm/actions'
import { resetOperatorForm, setOriginalOperator } from '../OperatorForm/actions'
import { resetModifiedPermission } from '../PermissionPanel/actions'
import { getFilteredGroups } from './selector'
import ConfirmModal from 'componentsV2/Modal/ConfirmModal'
import LoadingIndicator from 'phxComponents/loadingIndicator'
import ModalWindow from 'phxComponents/modal'
import { removedStatusFilter } from './constants'


const mapStateToProps = ({
  operatorList,
  permissionPanel,
  modifiedGroupForm,
  operatorDetailsForm,
  apiConstants
}) => {
  const filter = operatorList.groupFilter
  const groups = getFilteredGroups(operatorList)
  const {
    groupid,
    operatorid,
    search,
    groupStatus,
    showWarningModal,
    action
  } = operatorList
  const { modified } = modifiedGroupForm
  const {
    isModifiedActionPermission,
    isModifiedApplicationPermission,
    isModifiedReportPermission
  } = permissionPanel
  const isDetailModified =
    modified ||
    operatorDetailsForm.modified ||
    ((groupid || operatorid) &&
      (isModifiedActionPermission ||
        isModifiedApplicationPermission ||
        isModifiedReportPermission))
  const accountStatus = apiConstants.values.accountStatuses.filter(status => !removedStatusFilter.includes(status.id))
  const loading =
    operatorList.isgroupUpdating ||
    operatorList.newOperatorStatus === 'LOADING' ||
    operatorList.updateOperatorStatus === 'LOADING'
  return {
    groups,
    filter,
    search,
    isDetailModified,
    groupStatus,
    accountStatus,
    showWarningModal,
    action,
    loading,
    operatorid,
    groupid
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchOperatorGroupsByStatus,
      filterGroup,
      searchOperator,
      clearForm,
      resetOperatorForm,
      selectOperator,
      fetchOperatorGroups,
      toggleWarningModal,
      showNewOperatorModal,
      showNewOperatorGroupModal,
      resetModifiedPermission,
      setOriginalOperator
    },
    dispatch
  )
}
class OperatorList extends Component {
  state = {
    showConfirmationModal: false,
    selectedOperator: null
  }

  componentDidMount() {
    this.props.fetchOperatorGroups()
  }

  selectOperator = operator => {
    if (this.props.isDetailModified) {
      this.props.toggleWarningModal()
      this.setState({ selectedOperator: operator })
    } else {
      this.props.selectOperator(operator)
      this.props.clearForm()
      this.props.resetOperatorForm()
    }
  }

  changeFilter = event => {
    this.props.filterGroup(event.target.value)
  }

  searchOperator = event => {
    this.props.searchOperator(event.target.value)
  }

  clearSearch = () => {
    this.props.searchOperator('')
  }

  render() {
    const {
      groups,
      filter,
      search,
      groupStatus,
      accountStatus,
      showWarningModal,
      action,
      loading,
      groupid,
      operatorid
    } = this.props
    return (
      <div className="operator-manager-sidebar">
        <div className="sidebar-header">
          <div className="operator-list-search">
            <input
              type="text"
              value={search}
              placeholder="Search"
              onChange={this.searchOperator}
            />
            <i
              className="phxico phx-close icon-xsmall icon"
              onClick={this.clearSearch}
            />
          </div>
          <div className="operator-list-filter">
            <select value={filter} onChange={this.changeFilter}>
              <option value="0">All</option>
              {accountStatus &&
                accountStatus.map(status => {
                  return (
                    <option key={status.id} value={status.id}>
                      {status.description}
                    </option>
                  )
                })}
            </select>
            <button
              className="button btn-box"
              title="Refresh"
              onClick={() => {
                this.props.fetchOperatorGroups()
              }}>
              <i className="phxico phx-refresh" />
            </button>
          </div>
        </div>
        <div className="sidebar-body">
          <div className="operator-list">
            {groupStatus === 'LOADING' && (
              <div className="loading tcenter">
                <i className="phxico phx-spinner phx-spin" />
              </div>
            )}
            {groupStatus === 'LOADED' &&
              groups &&
              groups.map(group => {
                const match = search && group.description.toLowerCase().indexOf(search.toLowerCase()) >= 0
                return (
                  <OperatorGroup
                    key={group.id}
                    group={group}
                    onOperatorSelect={this.selectOperator}
                    open={search ? true : false}
                    match={match}
                    active={operatorid ? false : group.id === groupid}
                  />
                )
              })}
            {groupStatus === 'LOADED' &&
            groups &&
            groups.length < 1 && (
              <div style={{ textAlign: 'center' }}>No Operators Found</div>
            )}
          </div>
        </div>
        <ConfirmModal
          isVisible={showWarningModal}
          onConfirm={e => {
            if (action === 'newOperator') {
              this.props.showNewOperatorModal()
            } else if (action === 'newGroup') {
              this.props.showNewOperatorGroupModal()
            } else {
              if (this.state.selectedOperator) {
                this.props.setOriginalOperator(this.state.selectedOperator);
                this.props.selectOperator(this.state.selectedOperator)
                this.setState({ selectedOperator: null })
              }
            }
            this.props.toggleWarningModal('')
            this.props.clearForm()
            this.props.resetOperatorForm()
            this.props.resetModifiedPermission()
          }}
          onCancel={e => {
            this.props.toggleWarningModal('')
          }}
        />
        {loading && (
          <ModalWindow
            key="loading-modal"
            className="small-box"
            title="Loading"
            name="error"
            isVisibleOn={true}
            shouldCloseOnOverlayClick={false}
            closeButton={false}>
            <div>
              <LoadingIndicator />
            </div>
          </ModalWindow>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorList)
