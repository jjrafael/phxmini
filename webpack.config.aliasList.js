var Path = require( 'path' );
var app_root = 'src'; // the app root folder: src, src_users, etc

module.exports = {
  phxStore: getSrcPath( 'store.js' ),
  phxUtils: getSrcPath( 'utils.js' ),
  phxActions: getSrcPath( 'actions' ),
  phxComponents: getSrcPath( 'components' ),
  phxConfigs: getSrcPath( 'configs' ),
  phxConstants: getSrcPath( 'constants' ),
  phxContainers: getSrcPath( 'containers' ),
  phxServices: getSrcPath( 'services' ),
  phxValidations: getSrcPath( 'validations.js' ),
  phxSagas: getSrcPath('sagas'),
  phxNewComponents: getSrcPath('componentsNew'),
  phxV2Components: getSrcPath('componentsV2'),
  // Event Creator
  eventCreator: getSrcPath( 'containers/EventCreator' ),
  eventCreatorActions: getSrcPath( 'containers/EventCreator/actions' ),
  eventCreatorComponents: getSrcPath( 'containers/EventCreator/components' ),
  eventCreatorConfigs: getSrcPath( 'containers/EventCreator/configs' ),
  eventCreatorConstants: getSrcPath( 'containers/EventCreator/constants' ),
  eventCreatorReducers: getSrcPath( 'containers/EventCreator/reducers' ),
  eventCreatorUtils: getSrcPath( 'containers/EventCreator/utils' ),
  // Event Creator - Event Path
  eventCreatorEventPathActions: getSrcPath( 'containers/EventCreator/Pages/EventPath/actions' ),
  eventCreatorEventPathComponents: getSrcPath( 'containers/EventCreator/Pages/EventPath/components' ),
  eventCreatorEventPathConfigs: getSrcPath( 'containers/EventCreator/Pages/EventPath/configs' ),
  eventCreatorEventPathConstants: getSrcPath( 'containers/EventCreator/Pages/EventPath/constants' ),
  eventCreatorEventPathContainers: getSrcPath( 'containers/EventCreator/Pages/EventPath/containers' ),
  eventCreatorEventPathReducers: getSrcPath( 'containers/EventCreator/Pages/EventPath/reducers' ),
  eventCreatorEventPathSagas: getSrcPath( 'containers/EventCreator/Pages/EventPath/sagas' ),
  eventCreatorEventPathServices: getSrcPath( 'containers/EventCreator/Pages/EventPath/services' ),
  // Event Creator - Opponents
  eventCreatorOpponentsActions: getSrcPath( 'containers/EventCreator/Pages/Opponents/actions' ),
  eventCreatorOpponentsComponents: getSrcPath( 'containers/EventCreator/Pages/Opponents/components' ),
  eventCreatorOpponentsConfigs: getSrcPath( 'containers/EventCreator/Pages/Opponents/configs' ),
  eventCreatorOpponentsConstants: getSrcPath( 'containers/EventCreator/Pages/Opponents/constants' ),
  eventCreatorOpponentsContainers: getSrcPath( 'containers/EventCreator/Pages/Opponents/containers' ),
  eventCreatorOpponentsReducers: getSrcPath( 'containers/EventCreator/Pages/Opponents/reducers' ),
  eventCreatorOpponentsSagas: getSrcPath( 'containers/EventCreator/Pages/Opponents/sagas' ),
  eventCreatorOpponentsServices: getSrcPath( 'containers/EventCreator/Pages/Opponents/services' ),
  // Event Creator - Bet Restrictions
  eventCreatorBetRestrictActions: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/actions' ),
  eventCreatorBetRestrictComponents: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/components' ),
  eventCreatorBetRestrictConfigs: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/configs' ),
  eventCreatorBetRestrictContainers: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/containers' ),
  eventCreatorBetRestrictReducers: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/reducers' ),
  eventCreatorBetRestrictSagas: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/sagas' ),
  eventCreatorBetRestrictServices: getSrcPath( 'containers/EventCreator/Pages/BetRestrictions/services' ),
  //Report Manager
  reportsManagerRoot: getSrcPath( 'containersNew/ReportsManager' ),
  reportsManagerComponents: getSrcPath( 'containersNew/ReportsManager/components' ),
  reportsManagerContainers: getSrcPath( 'containersNew/ReportsManager/containers' ),
  reportsManagerConfigs: getSrcPath( 'containersNew/ReportsManager/configs' ),
  reportsManagerConstants: getSrcPath( 'containersNew/ReportsManager/constants' ),
  reportsManagerActions: getSrcPath( 'containersNew/ReportsManager/actions' ),
  reportsManagerReducers: getSrcPath( 'containersNew/ReportsManager/reducers' ),
  reportsManagerServices: getSrcPath( 'containersNew/ReportsManager/services' ),
  reportsManagerSagas: getSrcPath( 'containersNew/ReportsManager/sagas' ),
};

function getSrcPath( srcPath ) {
  return Path.resolve( __dirname, app_root, srcPath );
};

// export default aliasList;
