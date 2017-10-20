import MIFY from 'mify';
import localStorageService from './localStorageService';
import channelConfig from '../configs/channelConfig';

const storageService = new localStorageService();

const api = new MIFY({
    storageService,
    logInUrl: '/rest/accounts/operator/',
    logoutCallback: () => {
        storageService.removeItem('username');
        storageService.removeItem('userid');
        location.reload();
    },
    client: 'web',
    baseUrl: '/',
    useRewritePoxy: true,
    REQUIRED_QUERIES: {'lineId': channelConfig.lineId},
    disableGETCache: true
});

// api.logout();
// api.init();


export default api;
