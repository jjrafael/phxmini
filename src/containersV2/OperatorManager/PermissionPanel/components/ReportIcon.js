import React from 'react';

const ReportIcon = ({report}) => {
    const icon = report.type === 'group' ? 'folder' : 'file'
    return <span className={`reports-folder__icon phx-ico phx-${icon}`}></span>
}

export default ReportIcon;