import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
let ScrollTable = (props) => {
	return <div className="custom-table"> 
		<div className="rt-table">
		    <TableHeader {...props}/>
		    <TableBody {...props}/>
	    </div>
	</div>
};


export default ScrollTable;