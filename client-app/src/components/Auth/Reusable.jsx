import React from 'react';

import { 
	Grid, Row, Col
} from 'react-bootstrap';

export const Card = ({children, ...rest}) => {
	return (
		<Grid {...rest}>
			<Row>
				<Col md={4} mdOffset={4}>
					<div className="card card-signup">
						<form className="form">
							{ children }
						</form>
					</div>
				</Col>
			</Row>
		</Grid>
	);
}

export const Header = (props) => {
	return (
		<div className="header header-success text-center" {...props} />
	);
}

export const Footer = (props) => {
	return (
		<div className="footer text-center" 
		{...props} />
	);
}

export const Content = (props) => {
	return (
		<div className="content" 
		{...props} />
	);
}