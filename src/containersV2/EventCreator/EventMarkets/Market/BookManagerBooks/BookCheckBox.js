export default ({checked, book, onChange}) => {
    return <input type="checkbox" checked={checked} onChange={e => {
        let isChecked = e.target.checked;
        if (onChange) { onChange(isChecked, book) }
    }}/>
}