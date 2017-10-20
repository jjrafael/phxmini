import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import { updateReports } from '../actions';
import { getReportsToToggle, getParentsToUncheck, getParentsToCheck } from '../helpers';
import ReportIcon from '../components/ReportIcon';
import ReportToggle from '../components/ReportToggle';
import { mapPermissionsToProps } from 'componentsV2/checkPermission/index'
import constants from '../../App/constants'

const mapStateToProps = (state, ownProps) => {
    const reportsMap = state.permissionPanel.reportsMap;
    const report = reportsMap[ownProps.reportKey];
    return {
        report,
        reportsMap,
        groupList: state.operatorList.groupIndex
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateReports
    }, dispatch);
};

class Report extends Component {
    constructor (props) {
        super(props);
        this._toggleSelection = this._toggleSelection.bind(this);
    }
    _toggleSelection () {
        let { report, group, reportsMap, reportGroupKey, updateReports, permissions,groupList } = this.props;
        const isChecked = report[`isChecked_${group}`];
        let reports = getReportsToToggle({
            reports: [{
                ...report,
                [`isChecked_${group}`]: !isChecked
            }],
            isChecked: !isChecked,
            reportsMap,
            report,
            group,
        });
        if (isChecked) {
            reports = getParentsToUncheck({reportsMap, reports, report, group})
        } else {
            reports = getParentsToCheck({reportsMap, reports, report, group})
        }
        const isAdmin = groupList.find((group)=> group.id === 1) //check if user is in admin group
        
        if(isAdmin || [  constants.permissionsCode.CREATE_USER,
            constants.permissionsCode.CREATE_GROUP 
         ].some( id => permissions.includes(id)) ){
            updateReports(reports);
        }
    }
    render () {
        const { group, report, permissions, groupList } = this.props;
        const isChecked = report[`isChecked_${group}`];
        const isExpanded = report[`isExpanded_${group}`];
        const reportClassNames = cx('report-desc', {active: isChecked});
        // console.log(report, report.isExpanded);
        const isAdmin = groupList.find((group)=> group.id === 1) //check if user is in admin group
        const updatePermission = isAdmin || [  constants.permissionsCode.CREATE_USER,
          constants.permissionsCode.CREATE_GROUP 
       ].some( id => permissions.includes(id)) 
        return (
            <li className="flex flex--column">
                <div className={reportClassNames} onClick={this._toggleSelection}>
                    <ReportToggle report={report} group={group} permissions={permissions}/>
                    <span className="report-checkbox"><input type="checkbox" disabled={!updatePermission} checked={isChecked} onChange={() => {}}/></span>
                    <ReportIcon report={report}/>
                    <span> {report.desc}</span>
                </div>
                {updatePermission && isExpanded && !!report[group].length &&
                    <ul style={{paddingLeft: '17px'}}>{report[group].map(item => {
                        return <ConnectedReport key={item} group={group} reportKey={item} />
                    })}</ul>
                }
            </li>
        );
    }
}

const ConnectedReport = connect(mapStateToProps, mapDispatchToProps)(mapPermissionsToProps(Report));

export default ConnectedReport;