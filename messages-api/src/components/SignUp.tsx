import { useState } from "react";

import { Button, Card, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { ApiUser } from "../App";

type SignUpProps = {
	setCurrentApiUser: (apiUser: ApiUser) => void;
};

type Error = {
	username: string | null;
	email: string | null;
	password: string | null;
};

export default function SignUp({ setCurrentApiUser }: SignUpProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			console.log("username: ", username);
			setError(undefined);
			setLoading(true);
			const response = await fetch(
				"http://localhost:8000/api/v1/users/create_api_user/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username,
						password,
						email,
					}),
				}
			);

			const data = await response.json();
			setLoading(false);
			if (response.status !== 200) {
				setError(data);
			} else {
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
				<Card.Title>Sign Up</Card.Title>
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

							<Col>
								<Form.Group controlId='email'>
									<Form.Label>Email</Form.Label>
									<Form.Control
										type='text'
										name='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
									{error?.email && (
										<Form.Text className='text-danger'>
											{error.email}
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
								</Form.Group>
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
								"Sign Up"}
						</Button>
					</Stack>
				</Form>
			</Card.Body>
		</Card>
	);
}
