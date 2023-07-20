import {Component} from 'react'
import './index.css'

class Home extends Component {
  state = {
    userMessage: '',
    displayMessage: [],
    messageId: 1,
    messageCount: 1,
  }

  onApplyBtn = button => {
    this.setState(prev => ({
      messageId: prev.messageId + 1,
    }))

    this.sendUserMessage(button)
  }

  handleSelectChange = e => {
    this.setState(prev => ({
      messageId: prev.messageId + 1,
    }))

    this.sendUserMessage(e.target.value)
  }

  sendUserMessage = async message => {
    try {
      const {messageCount} = this.state
      const response = await fetch(
        'http://localhost:3006/api/sendUserMessage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({message, messageCount}),
        },
      )

      const data = await response.json()
      if (messageCount > 2) {
        if (typeof data.botMessage === 'object') {
          this.setState(prev => ({
            displayMessage: [
              ...prev.displayMessage,
              {id: prev.messageId, message: data.botMessage.text},
            ],
            messageId: prev.messageId + 1,
          }))
        } else {
          this.setState(prev => ({
            displayMessage: [
              ...prev.displayMessage,
              {id: prev.messageId, message: data.botMessage},
            ],
            messageId: prev.messageId + 1,
            messageCount: prev.messageCount + 1,
          }))
        }
      } else {
        this.setState(prev => ({
          displayMessage: [
            ...prev.displayMessage,
            {id: prev.messageId, message: data.botMessage},
          ],
          messageId: prev.messageId + 1,
          messageCount: prev.messageCount + 1,
        }))
      }
    } catch (error) {
      console.log('Error sending user message:', error)
    }
  }

  handleUserMessage = e => {
    this.setState({userMessage: e.target.value})
  }

  handleSubmit = e => {
    e.preventDefault()
    const {userMessage, messageCount} = this.state
    if (userMessage !== '' && messageCount < 6) {
      this.sendUserMessage(userMessage)
      this.setState(prev => ({
        displayMessage: [
          ...prev.displayMessage,
          {id: prev.messageId, message: userMessage},
        ],
        messageId: prev.messageId + 1,
        userMessage: '',
      }))
    }
  }

  render() {
    const {userMessage, displayMessage, messageCount} = this.state

    return (
      <div className="main-container">
        <div className="chat-container">
          {displayMessage.length === 0 ? (
            <div className="empty-chat">
              <h1 className="empty-txt">
                Say<span className="hi-text"> Hi! </span>To Start the
                Conversation
              </h1>
            </div>
          ) : (
            <div className="chat-environment">
              {displayMessage.map(each => (
                <div
                  key={each.id}
                  className={each.id % 2 === 0 ? 'bot-message' : 'user-message'}
                >
                  {each.id % 2 === 0 &&
                  messageCount === 5 &&
                  each.message ===
                    'Please select how many years of experience you have with Python/JS/Automation Development:' ? (
                    <div>
                      <p>{each.id === 2 ? each.message.text : each.message}</p>
                      <select
                        onChange={this.handleSelectChange}
                        className="drop-down"
                      >
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5 years</option>
                      </select>
                    </div>
                  ) : (
                    <p>{each.id === 2 ? each.message.text : each.message}</p>
                  )}
                  {each.message.buttons && (
                    <div>
                      {each.message.buttons.map(button => (
                        <button
                          className="apply-btn"
                          type="button"
                          onClick={() => this.onApplyBtn(button)}
                        >
                          {button}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* <div>Bot Message: {botMessage}</div> */}
          <form onSubmit={this.handleSubmit} className="input-form">
            <input
              className="text-input"
              type="text"
              value={userMessage}
              onChange={this.handleUserMessage}
              placeholder="Type a message"
            />
            <button className="send-btn" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Home
