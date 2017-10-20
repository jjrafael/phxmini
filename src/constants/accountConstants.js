const selfExclusion = [{ //id will be the combined period example: "0,1" 0 - periodDays, 1 - periodMonth
    description: 'Not Self Excluded',
    periodDays: 0,
    periodMonths:0,
    id: "0,0"
},{
    description: '1 Day',
    periodDays: 1,
    periodMonths:0,
    id: "1,0"
},{
    description: '6 Months',
    periodDays: 0,
    periodMonths: 6,
    id: "0,6"
},{
    description: '12 Months',
    periodDays: 0,
    periodMonths: 12,
    id: "0,12"
},{
    description: '2 Years',
    periodDays: 0,
    periodMonths: 24,
    id: "0,24"
},{
    description: '3 Years',
    periodDays: 0,
    periodMonths: 36,
    id: "0,36"
},{
    description: '5 Years',
    periodDays: 0,
    periodMonths: 60,
    id: "0,60"
},{
    description: 'Permanent',
    periodDays: 0,
    periodMonths: 999,
    id: "0,999"
}];

export { selfExclusion }