import React from 'react';
import { formatDecimalPrice } from 'utils';

const dashboardStatistics = [{
    header: 'Sport',
    headerClassName: 'header-row',
    accessor: 'sportDescription',
},{
    id: 'ltBetCount',
    header: 'L/T Bet Count',
    headerClassName: 'header-row tright',
    accessor: row => <div className="tright">{parseFloat(row.ltBetCount)}</div>,
},{
    id: 'ltAveStake',
    header: 'L/T Ave. Stake',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ltAveStake),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ltTotalStakes',
    header: 'L/T Total Stakes',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ltTotalStakes),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ltValue',
    header: 'L/T Value',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ltValue),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ltPercentage',
    header: 'L/T %',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ltPercentage),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ytdBetCount',
    header: 'YTD Bet Count',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ytdBetCount),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ytdAveStake',
    header: 'YTD Ave. Stake',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ytdAveStake),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ytdTotalStakes',
    header: 'YTD Total Stakes',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ytdTotalStakes),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ytdValue',
    header: 'YTD Value',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ytdValue),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
},{
    id: 'ytdPercentage',
    header: 'YTD %',
    headerClassName: 'header-row',
    accessor: row => parseFloat(row.ytdPercentage),
    render: row => <div className="tright">{formatDecimalPrice(row.value)}</div>,
}];

export { dashboardStatistics }