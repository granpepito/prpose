import React from 'react';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { createPost } from '../api/Requests';

class NewPost extends React.Component {
	constructor() {
		super();
		this.state = {
			postTitle: '',
			postContent: '',
			open: false,
			error: false
		};

		this.validateForm = this.validateForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	validateForm() {
		const valid =
			this.state.postTitle.length > 0 &&
			this.state.postContent.length > 150;
		return valid;
	}

	handleClick(event) {
		this.setState(prevState => {
			return {
				open: !prevState.open
			};
		});
	}

	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit(event) {
		const postTitle = this.state.postTitle;
		const postContent = this.state.postContent;
		const informations = JSON.stringify({ postTitle, postContent });
		createPost(informations)
			.then(response => {
				if (response.status === 200) {
					window.location.reload();
				}
			})
			.catch(err => {
				this.setState({
					error: true
				});
			});
	}

	render() {
		const openStyle = this.state.open
			? {
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					maxWidth: '500px'
			  }
			: {
					display: 'none',
					marginLeft: 'auto',
					marginRight: 'auto',
					maxWidth: '500px'
			  };

		return (
			<div>
				<Button
					variant='primary'
					onClick={this.handleClick}
					style={{
						width: '10em',
						margin: '0 auto'
					}}
				>
					Create a new post
				</Button>
				<div>
					<div style={openStyle}>
						<h3 style={{ marginBottom: '3%' }}>Create a post</h3>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId='postTitle' size='lg'>
								<Form.Label>Title</Form.Label>
								<Form.Control
									autoFocus
									type='text'
									placeholder='Title'
									onChange={this.handleChange}
								/>
							</Form.Group>
							<Form.Group controlId='postContent' size='lg'>
								<Form.Label>Content</Form.Label>
								<Form.Control
									placeholder='Leave your prposition here'
									onChange={this.handleChange}
									as='textarea'
									rows='3'
								/>
							</Form.Group>
							<Button
								block
								size='lg'
								type='submit'
								disabled={!this.validateForm()}
							>
								POST
							</Button>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default NewPost;
