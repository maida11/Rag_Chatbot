import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="sidebar">
        <UploadBox />
      </div>
      <div className="chat-area">
        <ChatBox />
      </div>
    </div>
  );
}

export default App;