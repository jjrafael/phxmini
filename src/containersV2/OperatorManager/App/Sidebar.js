import React from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import OperatorList from '../OperatorList'
import Loader from './Loader'


import constants from './constants'

class Sidebar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeOperatorGroupId : null,
      activeOperatorId : null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedOperatorGroupId, selectedOperatorId } = nextProps

    if (selectedOperatorGroupId !== null && selectedOperatorGroupId === this.state.activeOperatorGroupId && selectedOperatorId === this.state.activeOperatorId) {
      return false
    }
    return true
  }

  _renderOperators (operators) {
    const {clickHandler, selectedOperatorId} = this.props

    this.state.activeOperatorId = selectedOperatorId
    
    if (operators) {
      return (
        operators.map((operator)=>{
          const activeClassName = (operator.id === selectedOperatorId) ? 'active' : ''
          return (
            <div key={operator.id}>
              <div className="operator-tree-item" >{activeClassName}
                <a className="expand-toggle"><i className="fa fa-user"></i></a>
                <a className="pathtree-desc" title={operator.userName} 
                  onClick={ (e)=> { e.preventDefault(); clickHandler({
                    operatorGroupId: operator.operatorGroupId,
                    operatorId : operator.id
                  }) } }>
                    {operator.userName}
                </a>
              </div>
            </div>
          )
        })
      )
    } else {
      return null
    }
    
  }

  _renderOperatorGroups() {
    const { operatorGroups, operatorGroupsIndex, operatorGroupsStatus, clickHandler, selectedOperatorGroupId } = this.props

    this.state.activeOperatorGroupId = selectedOperatorGroupId
    
      return (
        operatorGroupsIndex.map((index)=>{
          const operatorGroup = operatorGroups[index.id]
          const activeClassName = (selectedOperatorGroupId === operatorGroup.id) ? 'active' : ''
          
          return (
            <div key={operatorGroup.id}>
              <div className="operator-tree-group has-children" >{activeClassName}
                <a className="expand-toggle"><i className="fa fa-angle-down"></i></a>
                <a className="pathtree-desc" title={operatorGroup.description} 
                  onClick={ (e)=> { e.preventDefault(); clickHandler({
                    operatorGroupId: operatorGroup.id,
                    operatorId : null
                  }) } }>
                    {operatorGroup.description}
                  </a>
              </div>
              {this._renderOperators(operatorGroup.operators)}
            </div>
          )
        })
        
        
      )
    
  }

  render () {
    const {
      activeTree, 
      operatorGroups, 
      operatorGroupsIndex, 
      operatorGroupsStatus, 
      clickHandler, 
      selectedOperatorGroupId 
    } = this.props
    
    operatorGroupsStatus === 'LOADING'

    return (
            <OperatorList />
    )
  }
}

export default Sidebar
