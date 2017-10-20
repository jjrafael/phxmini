import React, { PureComponent } from 'react'
import Operator from './Operator'
import classNames from 'classnames'
import { connect } from 'react-redux'

const mapStateToProps = ({ operatorList }) => {
  return {
    currentGroupID: operatorList.groupid,
    currentOperatorID: operatorList.operatorid,
    search: operatorList.search,
    filter :operatorList.groupFilter
  }
}

class OperatorGroup extends PureComponent {  
  state = {
    toggle: false
  }
  componentWillMount(){
    this.setState({toggle:this.props.open})
  }
  
  componentWillReceiveProps(prop){
    if(prop.search !== this.props.search||prop.filter !== this.props.filter){
      this.setState({toggle:prop.open})
    }
  }

  componentWillUnmount() {
    if (this.state.toggle) {
      this.setState({ toggle: false })
    }
  }

  toggle = () => {
    const checkToggle = this.state.toggle ? false : true
    this.setState({ toggle: checkToggle })
  }

  selectGroup = () => {
    this.props.onOperatorSelect({
      groupid: this.props.group.id,
      operatorid: null,
      details: null
    })
  }

  render() {
    const { group, onOperatorSelect, active, currentGroupID, search, currentOperatorID, open, match} = this.props
    const chevron = this.state.toggle //check if prop passed
    const { id, operators, description } = group
     const groupClass = classNames({
      'operator-group':true,
    })  

    const operatorClass = classNames({
      'operator-group-list': true,
      '-open': operators && chevron,
      '-none': operators ? false : true,
      '-closed': chevron ? false : true
    })

    const chevronClass = classNames({
      'phx-chevron-down': chevron,
      'phx-chevron-right': chevron ? false : true
    })
 
    const headerClass = classNames({
      'operator-header-description': true,
      '-active': active,
      '-match' : !open ? false : match
    })
 
    return (
      <div className={groupClass}>
        <div className="operator-header">
          <i onClick={this.toggle} className={chevronClass} />
          <i className="icon phxico phx-account-multiple" />
          <h5 className={headerClass} onClick={this.selectGroup} title={description}>
            {' '}{description}{' '}
          </h5>
          {operators && operators.length > 0 &&
            <span className='operator-header-count'>{operators.length}</span>
          }
          <div style={{ clear: 'both' }} />
        </div>
        {
          <ul className={operatorClass}>
            {operators &&
              operators.map(operator => {
                const match = search && operator.userName.toLowerCase().indexOf(search.toLowerCase()) >= 0
                return (
                  <Operator
                    key={operator.id}
                    operator={operator}
                    onSelect={onOperatorSelect}
                    match={match}
                  />
                )
              })}
          </ul>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(OperatorGroup)
