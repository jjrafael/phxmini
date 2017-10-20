import React from "react";
import { Router, Route, IndexRoute, IndexRedirect } from "react-router";
import { history } from "./store.js";
import Lobby from "./containers/Lobby/";
import Login from "./containers/Login";
import EnsureLoggedInContainer from "./containers/EnsureLoggedInContainer";
import OperatorManager from "./containersV2/OperatorManager/App";
import CustomerChat from "./containersV2/CustomerChat/";
import InstantAction from 'containersV2/InstantAction/';

import ToastContainer from './components/toastr/index';
import NotFound from "./containers/NotFound";

//TODO: FIX ROUTING
const router = (
  <div className="app-phoenix">
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Route path="/login" component={Login}/>
      <Route component={EnsureLoggedInContainer}>
        <Route path="/" component={Lobby} />
        <Route path="/customer-chat" component={CustomerChat} />
        <Route path="/instant-action" component={InstantAction} />
        <Route path="/operator-manager" component={OperatorManager}/>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
    <ToastContainer />
  </div>
);


// export
export { router };
