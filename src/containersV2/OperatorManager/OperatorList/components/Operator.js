import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setOriginalOperator } from '../../OperatorForm/actions'

const mapStateToProps = ({operatorList, operatorDetailsForm}) => {
    return{
        operatorid: operatorList.operatorid,
        isOperatorModified: operatorDetailsForm.modified
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
   setOriginalOperator
  }, dispatch)
}

class Operator extends PureComponent {

    selectOperator = () => {
        const { operator, isOperatorModified } = this.props
        this.props.onSelect({
            groupid: operator.operatorGroupId || operator.groupId,
            operatorid: operator.id,
            details: operator
        })
        if(!isOperatorModified && operator.id){
            this.props.setOriginalOperator(operator)
        }
    }

    accountStatus = (id)=>{
        switch(id){
            case 1: return <i className="phx-account" title='Closed' style={{color:'red'}}></i>
            case 2: return <i className="phx-account" title='Open' style={{color:'green'}}></i>
            case 3: return <i className="phx-account" title='Suspended' style={{color:'orange'}}></i>
            case 4: return <i className="phx-account-off" title='Suspended Password Failure' style={{color:'orange'}}></i>
            case 5: return <i className="phx-account" title='Open Not Pool' style={{color:'yellow'}}></i>
            case 6: return <i className="phx-account" title='Suspended Except Login' style={{color:'orange'}}></i>
            default: return <i className="phx-account"></i>
        }
    }
    render() {
        const { operator, onSelect, operatorid, match } = this.props
        const operatorClass = classNames({
            'operator': true,
            '-active': operator.id === operatorid ? true : false,
            '-match': operator.id === operatorid ? false : match 
        })
        return (
            <li className={operatorClass} onClick={this.selectOperator}>
               {this.accountStatus(operator.statusId)} <span className='operator-username' title={operator.userName}>{operator.userName}</span>
            </li>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Operator)