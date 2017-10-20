import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { reducer as formReducer } from "redux-form";
import apiConstants from "./apiConstants";
import user from "./user";
import apps from "./apps";
import userRiskPreferences from "./userRiskPreferences";
import riskParameters from "./riskParameters";
import riskData from "./riskData";
import riskTransaction from "./riskTransaction";
import eventPathTree from "./eventPathTree";
import eventPathTreeFilter from "./eventPathTreeFilter";
import modals from "./modals";
import market from "./market";
import outcome from "./outcome";
import marketFeedInfo from "./marketFeedInfo";
import riskDataChanges from "./riskDataChanges";
import marketStateDetails from "./marketStateDetails";
import editMarket from "./editMarket";
import outcomeWagerLimits from "./outcomeWagerLimits";
import riskAnalysis from "./riskAnalysis";
import startup from "./startup";

// For EC
import eventCreatorModes from "eventCreatorReducers/eventCreatorModes";
import eventCreatorPages from "eventCreatorReducers/eventCreatorPages";

// For EC Event Path
import eventCreatorApp from "containersV2/EventCreator/App/reducers";
import eventCreatorEvent from "containersV2/EventCreator/Event/reducers";
import eventCreatorEventPath from "containersV2/EventCreator/Path/reducers";
import eventCreatorEventMarkets from "containersV2/EventCreator/EventMarkets/reducers";
import betRestrictions from "containersV2/EventCreator/BetRestrictions/reducers";
import sportsTree from "containersV2/SportsTree/reducers";

//For EC Feed History
import feedHistory from "containersV2/EventCreator/Event/FeedHistory/reducers";

//For EC Game Results
import gameResults from "containersV2/EventCreator/GameResults/reducers";

// For EC Opponents
import opponentsReducers from "eventCreatorOpponentsReducers/opponentsReducers";
import playersReducers from "eventCreatorOpponentsReducers/playersReducers";

// For Customers Chat
import customerChat from "containersV2/CustomerChat/reducers";

// For Instant Action
import instantAction from "containersV2/InstantAction/reducers";

// Operator Manager
import operatorList from "containersV2/OperatorManager/OperatorList/reducer";
import operatorManagerModal from "containersV2/OperatorManager/Main/reducer";
import modifiedGroupForm from "containersV2/OperatorManager/GroupForm/reducer";
import operatorDetailsForm from "containersV2/OperatorManager/OperatorForm/reducer";
import operatorManagerApp from "containersV2/OperatorManager/App/reducers";
import permissionPanel from "containersV2/OperatorManager/PermissionPanel/reducers";
// Applicable Templates
import applicableTemplates from "containersV2/EventCreator/BulkUpdate/reducers";

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  apiConstants,
  user,
  apps,
  userRiskPreferences,
  riskParameters,
  riskData,
  riskTransaction,
  eventPathTree,
  eventPathTreeFilter,
  modals,
  market,
  outcome,
  riskDataChanges,
  marketStateDetails,
  marketFeedInfo,
  editMarket,
  outcomeWagerLimits,
  // eventCreatorPathTree,
  eventCreatorModes,
  eventCreatorPages,

  eventCreatorApp,
  eventCreatorEvent,
  eventCreatorEventMarkets,
  eventCreatorEventPath,
  betRestrictions,
  sportsTree,

  feedHistory,
  
  gameResults,
  opponentsReducers,
  playersReducers,

  riskAnalysis,
  startup,

  customerChat,
  instantAction,
  operatorList,
  operatorManagerModal,
  modifiedGroupForm,
  operatorDetailsForm,
  operatorManagerApp,
  permissionPanel,

  applicableTemplates
});
