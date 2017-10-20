const opponentsTableColumns = [{
    header: 'Description',
    headerClassName: 'header-row',
    accessor: 'description'
}, {
    header: 'Abbreviation',
    headerClassName: 'header-row',
    accessor: 'abbreviation'
}, {
    header: 'Alias',
    headerClassName: 'header-row',
    accessor: 'nickname'
}, {
    header: 'Grade',
    headerClassName: 'header-row',
    id: 'grade',
    accessor: (d) => {
      return d.grade < 0 ? '' : d.grade;
    },
}];
export { opponentsTableColumns };
