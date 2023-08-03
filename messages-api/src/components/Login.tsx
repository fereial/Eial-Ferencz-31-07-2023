import { useState } from "react";

import { Button, Card, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { ApiUser } from "../App";
import { Link } from "react-router-dom";

type LoginProps = {
	setCurrentApiUser: (apiUser: ApiUser) => void;
};

type Error = {
	username: string | null;
	password: string | null;
	error: string | null;
};

export default function Login({ setCurrentApiUser }: LoginProps) {
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			setError(undefined);
			setLoading(true);
			const response = await fetch(
				"http://localhost:8000/api/v1/users/login/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username,
						password,
					}),
				}
			);

			const data = await response.json();
			setLoading(false);
			if (response.status === 400) {
				setError({
					username: data.username,
					password: data.password,
					error: data.error,
				});
			} else if (response.status === 500) {
				console.log("data: ", data);
				setError({
					username: null,
					password: null,
					error: "Server error",
				});
			} else {
				console.log("data: ", data);
				setError({
					username: null,
					password: null,
					error: "Unexpected error",
				});
			}
			if (response.ok) {
				localStorage.setItem("currentUser", JSON.stringify(data));
				setCurrentApiUser(data);
				window.location.href = "/";
			}
		} catch (err) {
			console.error(err);
			setError(err as Error);
		}
	};

	return (
		<Card className='p-4'>
			<Card.Body>
				<Card.Title>Login</Card.Title>
				<Form onSubmit={handleSubmit}>
					<Stack gap={4}>
						<Row>
							<Col>
								<Form.Group controlId='username'>
									<Form.Label>Username</Form.Label>
									<Form.Control
										type='text'
										name='username'
										value={username}
										onChange={(e) =>
											setUsername(e.target.value)
										}
									/>
									{error?.username && (
										<Form.Text className='text-danger'>
											{error.username}
										</Form.Text>
									)}
								</Form.Group>
							</Col>
						</Row>
					</Stack>
					<Stack gap={4}>
						<Row>
							<Col>
								<Form.Group controlId='password'>
									<Form.Label>Password</Form.Label>
									<Form.Control
										type='password'
										name='password'
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
									{error?.password && (
										<Form.Text className='text-danger'>
											{error.password}
										</Form.Text>
									)}

									{error && (
										<Form.Text className='text-danger'>
											{error.error}
										</Form.Text>
									)}
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Link to='/sign-up'>
									Don't have an account? Sign up here!
								</Link>
							</Col>
						</Row>

						<Button
							variant='primary'
							type='submit'
							disabled={loading}
						>
							{(loading && (
								<Spinner animation='border' role='status'>
									<span className='visually-hidden'>
										Loading...
									</span>
								</Spinner>
							)) ||
								"Login"}
						</Button>
					</Stack>
				</Form>
			</Card.Body>
		</Card>
	);
}
