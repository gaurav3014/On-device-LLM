import * as webllm from "https://esm.run/@mlc-ai/web-llm";

/*************** WebLLM logic ***************/
const messages = [
  {
    content: "You are a helpful AI agent helping users.",
    role: "system",
  },
];

const availableModels = webllm.prebuiltAppConfig.model_list.map(
  (m) => m.model_id,
);
let selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-1k";

// Callback function for initializing progress
function updateEngineInitProgressCallback(report) {
  console.log("initialize", report.progress);
  document.getElementById("download-status").textContent = report.text;
}

// Create engine instance
const engine = new webllm.MLCEngine();
engine.setInitProgressCallback(updateEngineInitProgressCallback);

async function initializeWebLLMEngine() {
  document.getElementById("download-status").classList.remove("hidden");
  selectedModel = document.getElementById("model-selection").value;
  const config = {
    temperature: 1.0,
    top_p: 1,
  };
  await engine.reload(selectedModel, config);
}

async function streamingGenerating(messages, onUpdate, onFinish, onError) {
  try {
    let curMessage = "";
    let usage;
    const completion = await engine.chat.completions.create({
      stream: true,
      messages,
      stream_options: { include_usage: true },
    });
    for await (const chunk of completion) {
      const curDelta = chunk.choices[0]?.delta.content;
      if (curDelta) {
        curMessage += curDelta;
      }
      if (chunk.usage) {
        usage = chunk.usage;
      }
      onUpdate(curMessage);
    }
    const finalMessage = await engine.getMessage();
    onFinish(finalMessage, usage);
  } catch (err) {
    onError(err);
  }
}

/*************** Chat with Page ***************/
let contextMessages = [];

// Function to extract main content from the current web page
function extractMainContent() {
  const mainContent = document.querySelector("main") || document.querySelector("body");
  return mainContent ? mainContent.innerText : "No main content found.";
}

// Function to update context with main content
function updateContextWithMainContent() {
  const mainContent = extractMainContent();
  contextMessages.push({
    content: mainContent,
    role: "system", // Providing context
  });
}

// Overriding the onMessageSend function to include the context
function onMessageSend() {
  const input = document.getElementById("user-input").value.trim();
  if (input.length === 0) return;

  const message = {
    content: input,
    role: "user",
  };
  messages.push(message);
  contextMessages.push(message); // Add user message to context
  appendMessage(message);

  document.getElementById("user-input").value = "";
  document.getElementById("user-input").setAttribute("placeholder", "Generating...");

  const aiMessage = {
    content: "typing...",
    role: "assistant",
  };
  appendMessage(aiMessage);

  // Stream the generation with the updated context
  streamingGenerating(contextMessages, updateLastMessage, onFinishGenerating, console.error);
}

// Function to finish generating and update the UI
const onFinishGenerating = (finalMessage, usage) => {
  updateLastMessage(finalMessage);
  document.getElementById("send").disabled = false;
  const usageText =
    `prompt_tokens: ${usage.prompt_tokens}, ` +
    `completion_tokens: ${usage.completion_tokens}, ` +
    `prefill: ${usage.extra.prefill_tokens_per_s.toFixed(4)} tokens/sec, ` +
    `decoding: ${usage.extra.decode_tokens_per_s.toFixed(4)} tokens/sec`;
  document.getElementById("chat-stats").classList.remove("hidden");
  document.getElementById("chat-stats").textContent = usageText;
};

function appendMessage(message) {
  const chatBox = document.getElementById("chat-box");
  const container = document.createElement("div");
  container.classList.add("message-container");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = message.content;

  if (message.role === "user") {
    container.classList.add("user");
  } else {
    container.classList.add("assistant");
  }

  container.appendChild(newMessage);
  chatBox.appendChild(container);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

function updateLastMessage(content) {
  const messageDoms = document
    .getElementById("chat-box")
    .querySelectorAll(".message");
  const lastMessageDom = messageDoms[messageDoms.length - 1];
  lastMessageDom.textContent = content;
}

/*************** Query Suggestion ***************/
// Function to extract metadata from the current page
function extractMetadata() {
  const title = document.title || "No title available.";
  const description = document.querySelector('meta[name="description"]')?.content || "No description available.";
  const keywords = document.querySelector('meta[name="keywords"]')?.content || "No keywords available.";
  
  return { title, description, keywords };
}

// Function to generate suggested queries based on metadata
async function generateSuggestedQueries() {
  const metadata = extractMetadata();
  const prompt = `Based on the following metadata, suggest related queries:\nTitle: ${metadata.title}\nDescription: ${metadata.description}\nKeywords: ${metadata.keywords}`;
  
  const suggestions = await engine.chat.completions.create({
    messages: [{ content: prompt, role: "user" }],
  });
  
  return suggestions.choices[0]?.message.content || "No suggestions found.";
}

// Function to display suggestions to the user
async function onShowSuggestions() {
  const suggestions = await generateSuggestedQueries();
  const suggestionsContainer = document.getElementById("suggestions-container");
  
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions
  const suggestionList = suggestions.split("\n").filter(s => s); // Split by newline and filter out empty lines

  if (suggestionList.length === 0) {
    suggestionsContainer.innerHTML = "<div class='no-suggestions'>No suggestions found.</div>";
    return;
  }

  suggestionList.forEach((suggestion) => {
    const suggestionElement = document.createElement("div");
    suggestionElement.classList.add("suggestion");
    suggestionElement.textContent = suggestion;

    // Add click event to each suggestion
    suggestionElement.addEventListener("click", () => {
      document.getElementById("user-input").value = suggestion; // Populate input with clicked suggestion
    });
    
    suggestionsContainer.appendChild(suggestionElement);
  });
}

/*************** UI logic ***************/
// Initialize the context with the main content
updateContextWithMainContent();

availableModels.forEach((modelId) => {
  const option = document.createElement("option");
  option.value = modelId;
  option.textContent = modelId;
  document.getElementById("model-selection").appendChild(option);
});
document.getElementById("model-selection").value = selectedModel;
document.getElementById("download").addEventListener("click", function () {
  initializeWebLLMEngine().then(() => {
    document.getElementById("send").disabled = false;
  });
});
document.getElementById("send").addEventListener("click", function () {
  onMessageSend();
});

// Button event listener to show suggestions
document.getElementById("show-suggestions").addEventListener("click", onShowSuggestions);
