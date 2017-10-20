import { makeIterable } from 'phxUtils';

export const createReport = ({type='group', level=0, parentKey='', items=[], key, group, desc}) => {
    const report = {
        type,
        level,
        parentKey,
        key,
        desc,
        assigned: [],
        unassigned: [],
        isChecked_assigned: false,
        isChecked_unassigned: false,
        isExpanded_assigned: false,
        isExpanded_unassigned: false,
    }
    report[group] = items;
    return report;
}
export const generateReportsMap = (reportGroups) => {
    const reportsMap = {};
    [...makeIterable(reportGroups, true)].forEach(reportGroup => {
        let reports = reportGroup.value;
        let group = reportGroup.key;
        [...makeIterable(reports, true)].map(report => {
            if (report.key.indexOf('/') >= 0) {
              let [parentKey, subKey] = report.key.split('/');
              if (reportsMap[parentKey]) {
                reportsMap[parentKey][group].push(report.key)
              } else {
                reportsMap[parentKey] = createReport({items: [report.key], key: parentKey, desc: parentKey, group});
              }
              if (!reportsMap[report.key]) {
                reportsMap[report.key] = createReport({
                  level: 1,
                  parentKey: parentKey,
                  items: [...report.value],
                  key: report.key,
                  desc: subKey,
                  group
                });
            } else { // if nested group already exists
                reportsMap[report.key][group] = [...report.value]
                    .reduce((accu, val) => {
                        if (!accu.includes(val)) { accu = [...accu, val] };
                        return accu;
                    }, reportsMap[report.key][group])
                    .sort();
            }
              
              report.value.map(key => {
                reportsMap[key] = createReport({type: 'report', parentKey: report.key, desc: key, key, group});
              })
            } else {
              if (!reportsMap[report.key]) {
                reportsMap[report.key] = createReport({items: [...report.value], key: report.key, desc: report.key, group})
              } else {
                reportsMap[report.key][group] = [
                  ...reportsMap[report.key][group],
                  ...report.value
                ]
              }
              report.value.map(key => {
                reportsMap[key] = createReport({type: 'report', parentKey: report.key, desc: key, key, group});
              })
            }
        });
    })

    return sortReports(reportsMap);
}

export const sortReports = (reportsMap) => {
    // sort assigned/unassigned array by type first, then by key
    for (const report of makeIterable(reportsMap)) {
        if (report.type === 'group') {
            report.assigned.sort((a,b) => {
                if (reportsMap[a].type > reportsMap[b].type) return -1;
                if (reportsMap[a].type < reportsMap[b].type) return 1;
                if (reportsMap[a].type === reportsMap[b].type) {
                    if (reportsMap[a].key > reportsMap[b].key) return 1;
                    if (reportsMap[a].key < reportsMap[b].key) return -1;
                    return 0;
                }
            })
            report.unassigned.sort((a,b) => {
                if (reportsMap[a].type > reportsMap[b].type) return -1;
                if (reportsMap[a].type < reportsMap[b].type) return 1;
                if (reportsMap[a].type === reportsMap[b].type) {
                    if (reportsMap[a].key > reportsMap[b].key) return 1;
                    if (reportsMap[a].key < reportsMap[b].key) return -1;
                    return 0;
                }
            })
        }
    }
    return reportsMap;
}

export const generateReportsList = ({reportsMap, group}) => {
    return [...makeIterable(reportsMap)]
        .filter(report => report.type === 'group' && report.level === 0 && !!report[group].length)
        .map(report => report.key)
        .sort();
}

export const countAssignedWithCheck = ({reportsMap, group}) => {
    return [...makeIterable(reportsMap)].filter(report => report[`isChecked_${group}`]).length
}

export const getReportsArray = ({reportsMap, group, isSorted=false}) => {
    const allGroup = [...makeIterable(reportsMap)].reduce((accu, val) => {
        return [...accu, ...val[group]];
    }, []);
    if (isSorted) {
        return allGroup.filter(key => reportsMap[key].type === 'report').sort();
    } else {
        return allGroup;
    }
}

export const updateReportMap = ({report, reportsMap}) => {
    return {
      ...reportsMap,
      [report.key]: {
        ...reportsMap[report.key],
        ...report,
      }
    }
}

export const getReportsToToggle = ({reportsMap, reports, report, isChecked, group}) => {
    report[group].forEach(key => {
        reports.push({key, [`isChecked_${group}`]: isChecked});
        if (reportsMap[key][group].length) {
            reports = getReportsToToggle({reportsMap, reports, group, isChecked, report: reportsMap[key]})
        }
    })
    return reports;
}

export const getParentsToUncheck = ({reportsMap, reports, report, group}) => {
    reports.push({key: report.key, [`isChecked_${group}`]: false});
    if (reportsMap[report.parentKey]) {
        reports = getParentsToUncheck({reportsMap, reports, group, report: reportsMap[report.parentKey]})
    }
    return reports;
}
export const getParentsToCheck = ({reportsMap, reports, report, group}) => {
    // auto-check parent folder once all children are checked
    let parentMap = reportsMap[report.parentKey]
    if (parentMap && parentMap[group].length) {
        let checkParent = true;
        for (const key of parentMap[group]) {
            if (!reportsMap[key][`isChecked_${group}`] && key !== report.key) {
                checkParent = false;
                break;
            }
        }
        if (checkParent) {
            reports.push({key: parentMap.key, [`isChecked_${group}`]: true});
            reports = getParentsToCheck({reportsMap, reports, group, report: parentMap})
        }
    }
    return reports;
}