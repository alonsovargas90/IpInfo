import Message from '../models/Message';

class MessageService {
	messages: Message[] = [];

	async find() {
		// Just return all our messages
		return this.messages;
	}

	async create(data: Pick<Message, 'text'>) {
		// The new message is the data text with a unique identifier added
		// using the messages length since it changes whenever we add one
		const message: Message = {
			id: this.messages.length,
			text: data.text
		};

		// Add new message to the list
		this.messages.push(message);

		return message;
	}
}

export default MessageService;