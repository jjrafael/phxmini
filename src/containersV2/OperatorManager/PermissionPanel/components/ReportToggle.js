import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateReport } from '../actions';
import constants from '../../App/constants'

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateReport
    }, dispatch);
};

const mapStateToProps = (state) => {
    return  {
        groupList: state.operatorList.groupIndex    
    }
}
const ReportToggle = ({report, updateReport, group, permissions,groupList}) => {
      const isAdmin = groupList.find((group)=> group.id === 1) //check if user is in admin group
      const updatePermission = isAdmin || [  constants.permissionsCode.CREATE_USER,
        constants.permissionsCode.CREATE_GROUP 
     ].some( id => permissions.includes(id)) 
    let content = null;
    const isExpanded = report[`isExpanded_${group}`];
    if (report.type === 'group') {
        content = <i className={`phx-ico phx-chevron-${updatePermission && isExpanded ? 'down' : 'right'}`}></i>
    }
    return <span className="report-toggle" onClick={e => {
        if (content) {
            e.preventDefault();
            e.stopPropagation();
            updateReport({...report, [`isExpanded_${group}`]: !isExpanded});
        }
    }}>{content}</span>
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportToggle)