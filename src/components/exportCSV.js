import React, { PropTypes } from 'react';
import ModalWindow from './modal';
import CSVDownloader from 'react-csv-downloader';

class ExportCSV extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const { className, data, columns, fileName } = this.props;
        return(
            <CSVDownloader
                filename={fileName}
                columns={columns}
                separator=","
                suffix={true} //if true, suffix becomes a date in YYYYMMDDhhiiss format
                datas={data} >
                <button className="btn-box"><i className={`phxico ${className}`}></i></button>
            </CSVDownloader>
        )
    }
};

export default ExportCSV;