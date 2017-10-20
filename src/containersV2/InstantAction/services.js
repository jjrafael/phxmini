import { performHttpCall } from 'phxServices/apiUtils';
import httpMethods from 'phxConstants/httpMethods';

let fetchEventXhr = null;

export function fetchInitialBetsData() {
  const url = '/rest/instantaction?type=BETSLIP';
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchSubsequentBetsData(lastKey) {
  const url = `/rest/instantaction?fromKey=${lastKey}&type=BETSLIP`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchInitialAccountsData() {
  const url = '/rest/instantaction?type=ACCOUNTS';
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchSubsequentAccountsData(lastKey) {
  const url = `/rest/instantaction?fromKey=${lastKey}&type=ACCOUNTS`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchInitialPaymentsData() {
  const url = '/rest/instantaction?type=TRANSACTIONS';
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchSubsequentPaymentsData(lastKey) {
  const url = `/rest/instantaction?fromKey=${lastKey}&type=TRANSACTIONS`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchInitialFailedBetsData() {
  const url = '/rest/instantaction?type=FAILEDBETS';
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};

export function fetchSubsequentFailedBetsData(lastKey) {
  const url = `/rest/instantaction?fromKey=${lastKey}&type=FAILEDBETS`;
  return performHttpCall(fetchEventXhr, httpMethods.HTTP_GET, url, null)
    .then((response) => ({ response }))
    .catch((xhr) => ({ xhr }));
};