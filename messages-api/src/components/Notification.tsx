import { useEffect, useState, useRef } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Spinner,
	Stack,
} from "react-bootstrap";
import { ApiUser } from "../App";

import { Link, useParams } from "react-router-dom";

import { NotificationAbstract } from "../App";

type NotificationProps = {
	currentUser: ApiUser;
	addNotification: (notification: NotificationAbstract) => void;
	removeNotification: (external_id: string) => void;
};

const defaultNotification: NotificationAbstract = {
	user: "",
	message: "",
	sent_by: "",
	received_by: "",
	subject: "",
	sent_at: "",
	external_id: "",
};

type NotificationError = {
	user: string | null;
	message: string | null;
	sent_by: string | null;
	received_by: string | null;
	subject: string | null;
	error: string | null;
};

export default function NotificationMessage({
	currentUser,
	addNotification,
	removeNotification,
}: NotificationProps) {
	const [notification, setNotification] =
		useState<NotificationAbstract>(defaultNotification);
	const [error, setError] = useState<NotificationError>();
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);

	const notificationRef = useRef<HTMLTextAreaElement>(null);
	const { external_id } = useParams<{ external_id: string }>();
	const isCreate = external_id ? false : true;

	const handleClose = () => setShow(false);

	useEffect(() => {
		if (typeof external_id !== "undefined" && !isCreate) {
			console.log("fetch");
			const fetchNotifications = async () => {
				const response = await fetch(
					`http://localhost:8000/api/v1/notifications/notifications/${currentUser.external_id}/${external_id}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${currentUser.access_token}`,
						},
					}
				);
				const data = await response.json();

				if (response.status === 200) {
					setNotification({
						user: data.user,
						message: data.message,
						sent_by: data.sent_by,
						received_by: data.received_by,
						subject: data.subject,
						sent_at: data.sent_at,
						external_id: data.external_id,
					});
				} else {
					setLoading(false);
					setError({
						user: data.user,
						message: data.message,
						sent_by: data.sent_by,
						received_by: data.received_by,
						subject: data.subject,
						error: data.error,
					});
				}
			};
			fetchNotifications();
		}
	}, [
		currentUser.external_id,
		currentUser.access_token,
		external_id,
		isCreate,
	]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			setError(undefined);
			setLoading(true);
			const response = await fetch(
				`http://localhost:8000/api/v1/notifications/notifications/${currentUser.external_id}/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${currentUser.access_token}`,
					},
					body: JSON.stringify(notification),
				}
			);

			const data = await response.json();
			setLoading(false);

			if (response.status !== 200) {
				setLoading(false);
				setError({
					user: data.user,
					message: data.message,
					sent_by: data.sent_by,
					received_by: data.received_by,
					subject: data.subject,
					error: data.error,
				});
			}

			alert("Notification sent successfully");
			addNotification(data);
			window.location.href = "/";
		} catch (error) {
			setLoading(false);
			console.log("error: ", error);
		}
	};

	const handleDelete = async () => {
		try {
			setError(undefined);
			setLoading(true);
			const response = await fetch(
				`http://localhost:8000/api/v1/notifications/notifications/${currentUser.external_id}/${external_id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${currentUser.access_token}`,
					},
				}
			);

			const data = await response.json();
			setLoading(false);

			if (response.status === 200 || response.status === 301) {
				alert("Notification deleted successfully");
				removeNotification(external_id as string);
				window.location.href = "/";
			}

			setError({
				user: data.user,
				message: data.message,
				sent_by: data.sent_by,
				received_by: data.received_by,
				subject: data.subject,
				error: data.error,
			});
		} catch (error) {
			setLoading(false);
			console.log("error: ", error);
		}
	};

	return (
		<Container>
			<Card className='p-4 shadow p-3 mb-5 bg-white rounded'>
				<Card.Body>
					<Card.Title>Notification </Card.Title>

					<Form onSubmit={handleSubmit}>
						<Stack gap={4}>
							<Row>
								<Col>
									<Form.Group controlId='sent_by'>
										<Form.Label>Sender</Form.Label>
										<Form.Control
											type='text'
											placeholder='Sender'
											value={notification?.sent_by}
											onChange={(e) =>
												setNotification({
													...notification,
													sent_by: e.target.value,
												})
											}
										></Form.Control>
										{error?.sent_by && (
											<Form.Text className='text-danger'>
												{error.sent_by}
											</Form.Text>
										)}
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId='receiver'>
										<Form.Label>Receiver</Form.Label>
										<Form.Control
											type='text'
											placeholder='Receiver'
											value={notification?.received_by}
											onChange={(e) =>
												setNotification({
													...notification,
													received_by: e.target.value,
												})
											}
										></Form.Control>
										{error?.received_by && (
											<Form.Text className='text-danger'>
												{error.received_by}
											</Form.Text>
										)}
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId='subject'>
										<Form.Label>Subject</Form.Label>
										<Form.Control
											type='text'
											placeholder='Subject'
											value={notification?.subject}
											onChange={(e) =>
												setNotification({
													...notification,
													subject: e.target.value,
												})
											}
										></Form.Control>
										{error?.subject && (
											<Form.Text className='text-danger'>
												{error.subject}
											</Form.Text>
										)}
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId='message'>
										<Form.Label>Message</Form.Label>
										<Form.Control
											ref={notificationRef}
											as='textarea'
											rows={15}
											required
											defaultValue={notification?.message}
											onChange={(e) =>
												setNotification({
													...notification,
													message: e.target.value,
												})
											}
										/>
									</Form.Group>
									{error?.message && (
										<Form.Text className='text-danger'>
											{error.message}
										</Form.Text>
									)}
									{error?.error && (
										<Form.Text className='text-danger'>
											{error.error}
										</Form.Text>
									)}
								</Col>
							</Row>
							{isCreate && (
								<Button variant='primary' type='submit'>
									{(loading && (
										<Spinner
											animation='border'
											role='status'
										>
											<span className='visually-hidden'>
												Loading...
											</span>
										</Spinner>
									)) ||
										"Send Notification"}
								</Button>
							)}
							{!isCreate && (
								<Button
									variant='danger'
									onClick={() => setShow(true)}
								>
									Delete
								</Button>
							)}
							<Button variant='danger' as={Link} to='/'>
								Back
							</Button>
						</Stack>
					</Form>
				</Card.Body>
			</Card>
			{!isCreate && (
				<DeleteModal
					show={show}
					handleClose={handleClose}
					handleDelete={handleDelete}
				/>
			)}
		</Container>
	);
}

type DeleteModalProps = {
	show: boolean;
	handleClose: () => void;
	handleDelete: () => void;
};

function DeleteModal({ show, handleClose, handleDelete }: DeleteModalProps) {
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Notification</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this notification?
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={handleClose}>
					Close
				</Button>
				<Button variant='danger' onClick={handleDelete}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
