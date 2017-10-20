import React from "react";
import ListItem from "./ListItem";
import Clock from "components/clock";
import { hashHistory } from "react-router";

const Header = (props) => {
    const { title, user, onClick, showLogOut, children, className='', useDiffentList=false } = props;
    return (
        <header className={`width-wrapper header-container clearfix ${className}`}>
          <div className="header-content">
              <section className="brand clearfix fleft">
                  <div className="logo fleft push-right" onClick={()=>{hashHistory.replace('/')}}></div> 
              </section>
              {title &&
              <nav className="navigation-container fleft">
                  <ul className="nav">
                      <li><a className="active">{title}</a></li>
                  </ul>
              </nav>
              }
              {children &&
              <section className="control-buttons fleft header-actions">
                {useDiffentList
                  ? children
                  : <ul className="list-reset button-group">{children}</ul>
                }
              </section>
              }
              <section className="user-section fright">
                  <div className="user-details">
                      <div className="user-id">
                          {user && `${user.username} [${user.id}]`}
                      </div>
                      <Clock/>
                  </div>
                  {!showLogOut &&
                      <div className="btn btn-outline btn-logout" onClick={onClick}>Logout</div>
                  }
              </section>
          </div>
      </header>
    )
}

export default Header;
export { ListItem }