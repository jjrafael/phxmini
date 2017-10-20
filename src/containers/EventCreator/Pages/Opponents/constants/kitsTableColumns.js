import React from "react";

const kitsTableColumns = [{
    header: 'Description',
    headerClassName: 'header-row',
    accessor: 'description'
}, {
    header: 'Base Colour',
    headerClassName: 'header-row',
    accessor: 'backgroundColor',
    render: row=><div style={{background: `#${row.value}`, width: '100%', height:'100%'}}/>
}, {
    header: 'Default',
    headerClassName: 'header-row',
    accessor: 'defaultKit',
    render: (row)=>{
      return row.value ?
      <div style={{textAlign: 'center'}} ><i className='phxico phx-check' style={{height: '100%', width: 'auto'}}/></div> : null
    }
}];
export { kitsTableColumns };
