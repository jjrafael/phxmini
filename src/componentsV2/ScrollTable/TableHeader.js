import React from 'react';


let TableHeader = (props) => {
	return <div className="rt-thead -header">
	        <div className="rt-tr">
	        	{
	        		props.headers.map( (header, i) => {
	        			let render;
            			if(header.title !== null) {
            				if(header.hasOwnProperty('headerRender')){
            					render = header.headerRender(header);
            				}
            				else 
            					render = header.title;
            			}
            			else {
            				if(header.hasOwnProperty('headerRender')){
            					render = header.headerRender(header);
            				}
            				else 
            					render = <div>&nbsp;</div>;
            			}
                		return  <div className={`rt-th col-description rt-th-index${i} ${header.hasOwnProperty('class') ? header.class : ""}`} style={{width: header.width}}>{render}</div>
	        		})
	        	}
	        </div>
	    </div>
}

export default TableHeader;