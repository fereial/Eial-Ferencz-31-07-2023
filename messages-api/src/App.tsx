import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";

import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import { Container } from "react-bootstrap";

import useLocalStorage from "./useLocalStorage";
import Login from "./components/Login";
import NotificationMessage from "./components/Notification";
import Home from "./components/Home";

export type ApiUser = {
	external_id: string;
	username: string;
	email: string;
	access_token: string;
};

export type NotificationAbstract = {
	user: string;
	message: string;
	sent_by: string;
	received_by: string;
	sent_at: string;
	subject: string;
	external_id: string;
};

export interface Notifications {
	sentNotifications: NotificationAbstract[];
	receivedNotifications: NotificationAbstract[];
}

const defaultNotifications: Notifications = {
	sentNotifications: [],
	receivedNotifications: [],
};

function App() {
	const [currentApiUser, setCurrentApiUser] = useLocalStorage<ApiUser | null>(
		"currentApiUser",
		null
	);

	const [notifications, setNotifications] =
		useState<Notifications>(defaultNotifications);

	useEffect(() => {
		if (currentApiUser === null) {
			return;
		}

		const fetchNotifications = async () => {
			const response = await fetch(
				`http://localhost:8000/api/v1/notifications/notifications/${currentApiUser?.external_id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${currentApiUser?.access_token}`,
					},
				}
			);
			const data = await response.json();
			setNotifications({
				sentNotifications: data.sent_notifications,
				receivedNotifications: data.received_notifications,
			});
		};
		fetchNotifications();
	}, [currentApiUser]);

	const addNotification = (newNotification: NotificationAbstract) => {
		setNotifications((prevNotifications) => {
			if (newNotification.sent_by === currentApiUser?.email) {
				return {
					...prevNotifications,
					sentNotifications: [
						...prevNotifications.sentNotifications,
						newNotification,
					],
				};
			} else {
				return {
					...prevNotifications,
					receivedNotifications: [
						...prevNotifications.receivedNotifications,
						newNotification,
					],
				};
			}
		});
	};

	const removeNotification = (external_id: string) => {
		setNotifications((prevNotifications) => {
			return {
				...prevNotifications,
				sentNotifications: prevNotifications.sentNotifications.filter(
					(notification) => notification.external_id !== external_id
				),
			};
		});
	};

	if (currentApiUser === null) {
		return (
			<div className='App'>
				<Container className='my-4'>
					<Routes>
						<Route
							path='/'
							element={
								<Login setCurrentApiUser={setCurrentApiUser} />
							}
						></Route>
						<Route
							path='sign-up'
							element={
								<SignUp setCurrentApiUser={setCurrentApiUser} />
							}
						></Route>
					</Routes>
				</Container>
			</div>
		);
	}

	return (
		<div className='App'>
			<Container className='my-4'>
				<Routes>
					<Route
						path='/'
						element={<Home notifications={notifications} />}
					></Route>
					<Route
						path='send-message'
						element={
							<NotificationMessage
								currentUser={currentApiUser}
								addNotification={addNotification}
								removeNotification={removeNotification}
							/>
						}
					></Route>
					<Route
						path='edit-message/:external_id'
						element={
							<NotificationMessage
								currentUser={currentApiUser}
								addNotification={addNotification}
								removeNotification={removeNotification}
							/>
						}
					></Route>
				</Routes>
			</Container>
		</div>
	);
}

export default App;
