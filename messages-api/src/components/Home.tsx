import { Stack, Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { Notifications } from "../App";
import { Link } from "react-router-dom";

type HomeProps = {
	notifications: Notifications;
};

export default function Home({ notifications }: HomeProps) {
	const sentNotifications =
		(notifications && notifications.sentNotifications) || [];
	const receivedNotifications =
		(notifications && notifications.receivedNotifications) || [];

	return (
		<Container>
			<Row>
				<Col>
					<Stack gap={2}>
						<Row className='d-flex flex-row justify-content-between'>
							<Col>
								<h1>Messages</h1>
							</Col>
							<Col className='d-flex flex-row justify-content-end'>
								<Button
									className='sm'
									as={Link}
									to='/send-message'
								>
									<p className='align-middle"'>New Message</p>
								</Button>
							</Col>
						</Row>
						<Row>
							<Col>
								<h2>Sent</h2>
								{sentNotifications.length > 0 ? (
									<ListGroup>
										{sentNotifications.map(
											(notification) => (
												<ListGroup.Item
													key={
														notification.external_id
													}
												>
													<Link
														to={`/edit-message/${notification.external_id}`}
													>
														<Row>
															<Col>
																{
																	notification.subject
																}
															</Col>
															<Col>
																From:{" "}
																{
																	notification.sent_by
																}
															</Col>
															<Col>
																To:{" "}
																{
																	notification.received_by
																}
															</Col>
														</Row>
													</Link>
												</ListGroup.Item>
											)
										)}
									</ListGroup>
								) : (
									<p> No sent messages </p>
								)}
							</Col>

							<Col>
								<h2>Received</h2>
								{receivedNotifications.length > 0 ? (
									<ListGroup>
										{receivedNotifications.map(
											(notification) => (
												<ListGroup.Item
													key={
														notification.external_id
													}
												>
													<Link
														to={`/edit-message/${notification.external_id}`}
													>
														<Row>
															<Col>
																{
																	notification.subject
																}
															</Col>
															<Col>
																From:{" "}
																{
																	notification.sent_by
																}
															</Col>
															<Col>
																To:{" "}
																{
																	notification.received_by
																}
															</Col>
														</Row>
													</Link>
												</ListGroup.Item>
											)
										)}
									</ListGroup>
								) : (
									<p> No received messages </p>
								)}
							</Col>
						</Row>
					</Stack>
				</Col>
			</Row>
		</Container>
	);
}
