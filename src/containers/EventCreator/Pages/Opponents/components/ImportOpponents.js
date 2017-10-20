import React from 'react';

const ImportOpponents = (props) => {
    const { loading, lists, toggleSelect, selectedAll, toggleAll, onClickImport } = props;
    if(loading) {
        return <span>Loading...</span>
    } else if(lists.length) {
        return (
            <div>
                <div style={{height: '270px', overflow: 'auto', padding: '5px'}}>
                <ul>
                    {lists.map(item => (
                        <li key={item.id} style={{padding: '3px 0px 3px 0px'}}>
                            <input type="checkbox" checked={item.selected} onChange={toggleSelect.bind(this, item.id)} />
                            <span style={{padding: '2px 10px 2px 2px'}}>{item.description}</span>
                        </li>
                    ))}
                </ul>
                </div>
                <div style={{height: '30px', lineHeight: '30px', borderTop: '1px solid #000', padding: '5px 5px 5px 5px'}}>
                    <input type="checkbox" checked={selectedAll} onClick={toggleAll} onChange={()=>{}} /> Select All
                    <button style={{float: 'right'}} onClick={onClickImport}>Import</button>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{padding: '40px 20px 40px 20px', textAlign: 'center'}} >No Opponents Found</div>
        )
    }
}

export default ImportOpponents;
