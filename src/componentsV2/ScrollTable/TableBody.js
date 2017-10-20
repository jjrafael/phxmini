import React from 'react';

//TO DO when width is not set it should be the same width with the header
// let getHeaderWidth = (headerIndex) => {
// 	let headerSelector = document.querySelector('.rt-th-index'+headerIndex);
// 	return {
// 		width : headerSelector !== null ? headerSelector.clientWidth + "px" : "8.33%"
// 	}
// }

let TableBody = (props) => {
	let { data, headers, onRowClick, selectRow, selectedRow, isLoading = false} = props;
	// console.log(isLoading)
	// if(!isLoading) {
	// 	return <div className="loading tcenter">
 //              <i className="phxico phx-spinner phx-spin"></i>
 //            </div>
	// }
	// else {
		return <div className="rt-tbody">
	        {
	        	data.length ? data.map( (d, index) => {
		            let className = 'rt-tr -odd';
		            if (index % 2 === 0) {
		                className = 'rt-tr -even';
		            }
		            
		            return <div key={index}className={`rt-tr-group ${selectRow ? "selectable" : ""} ${selectRow && (selectedRow.id === d.id) ?  "active" : ""} `} onClick={ selectRow ? (e) => {
		            	onRowClick(d);
		            } : null}>
		                <div className={className}>
		                	{
		                		headers.map((header, i)=> { //for custom renderer
		                			let render;
		                			if(header.data !== null && d.hasOwnProperty(header.data)) {
		                				if(header.hasOwnProperty('render')){
		                					render = header.render(d);
		                				}
		                				else 
		                					render = d[header.data];
		                			}
		                			else {
		                				if(header.hasOwnProperty('render')){
		                					render = header.render(d);
		                				}
		                				else 
		                				render = <div>&nbsp;</div>;
		                			}

			                		return <div className={`rt-td col-description ${header.hasOwnProperty('class') ? header.class : "" }`} style={{width:header.width}} title={d[header.data]}>{render}</div>
		                		})
		                	}
		                </div>
		            </div>
		        }) : <div className="rt-noData">No rows found</div>

	        }
	    </div>
	// }
}

export default TableBody;