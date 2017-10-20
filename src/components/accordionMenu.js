import React from "react";

class AccordionMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: typeof(props.isOpen) !== "undefined" ? props.isOpen : true,
			iconOnLeft: typeof(props.iconOnLeft) ? props.iconOnLeft : false
		}
	}

	onClick() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	render() {
		const icon = this.state.isOpen ? 'phx-caret-down' : 'phx-caret-right';
		const {className, headerClassName, bodyClassName} = this.props;
		return(
			<div className={className}>
				<div onClick={this.onClick.bind(this)} className="accordion-heading">
					{this.state.iconOnLeft && (
						<i className={`phxico ${icon} fleft`}></i>
					)}
					{this.props.title}
					{!this.state.iconOnLeft && (
						<i className={`phxico ${icon} fright`}></i>
					)}
				</div>
				{this.state.isOpen && (
					<div className="accordion-body">
						{this.props.children}
					</div>
				)}
			</div>
		)
	}
}

export default AccordionMenu;