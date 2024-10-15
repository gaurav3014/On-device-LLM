# On-Device-LLM Chatbot

This project is an on-device chatbot application powered by WebLLM. It allows users to chat with an AI agent and generate suggested queries based on webpage metadata.

## Features
- **Initialize and Load Models**: Choose from available models and initialize the WebLLM engine.
- **Interactive Chat**: Chat with the AI agent and receive real-time responses.
- **Query Suggestions**: Generate query suggestions based on the metadata of the current webpage.
- **On-Device Processing**: All processing occurs on the device, enhancing privacy and performance.

## Technologies Used
- **WebLLM**: Provides on-device LLM capabilities with various prebuilt models.
- **JavaScript (ESM)**: Powers the application logic.
- **HTML & CSS**: Builds the user interface.

## Getting Started
Follow these steps to set up and run the project locally:

### Prerequisites
- Make sure you have a browser that supports ESM modules.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/on-device-llm-chatbot.git
   ```
2. Navigate to the project directory:
   ```bash
   cd on-device-llm-chatbot
   ```

### Usage
1. Open `index.html` in your web browser.
2. Select a model from the dropdown and click **Download** to initialize WebLLM.
3. Enter your message in the chat input and click **Send**.
4. Click **Show Suggestions** to generate queries based on webpage metadata.

## File Structure
- `index.html`: The main HTML file that includes the structure of the app.
- `index.js`: Contains the application logic, including WebLLM integration and chat handling.
- `index.css`: Styles the user interface for an engaging experience.

## Code Overview

### WebLLM Logic
This section initializes the WebLLM engine and sets up model loading with real-time progress tracking. The selected model is used for generating responses in the chat.

### Chat with Page
Handles message interactions between the user and the AI agent, including sending messages, receiving responses, and updating the UI dynamically.

### Query Suggestion
Uses metadata from the current page to generate suggested queries. The metadata includes the webpage title, description, and keywords.

### UI Logic
This section handles various UI elements like showing/hiding elements, updating message content, and displaying query suggestions.

### Styles
- The application features a flexible layout with separate sections for the chat interface and suggestions.
- Styles are applied to differentiate between user and AI messages.
- Suggestions have hover effects for better user interaction.

## Demo
![Screenshot 2024-10-15 at 8 37 15 PM](https://github.com/user-attachments/assets/c595f564-8c75-45ea-97c9-e9829eb2c8a0)

## Implementation Approach and Key Design Decisions
- Focused on building an on-device LLM chatbot using WebLLM.
- Incorporated a model selection dropdown for user flexibility.
- Leveraged webpage metadata to generate contextually relevant query suggestions.
- Designed the UI with separate panels for chat interactions and query suggestions, enhancing user experience.

## Challenges Faced and Solutions
- Managed on-device resource constraints, optimizing model loading for smooth performance.
- Implemented real-time progress tracking during model downloads.
- Minimized UI updates to maintain responsive interactions.

## Performance Analysis and Optimization
- Reduced loading overhead by initializing components only when needed.
- Cached metadata for quicker query suggestions, minimizing latency during user interactions.

## Limitations and Potential Improvements
- Response time may vary depending on model size and device capability.
- Potential improvements include adding support for lightweight models and using model compression techniques for offline functionality.




## License
This project is licensed under the MIT License.

