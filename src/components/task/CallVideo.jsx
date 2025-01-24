import React, { useEffect, useState } from "react";
import getConnection from "../../hub/signalRConnection";

const CallVideo = ({
  setOpenCallVideo,
  maCongViec,
  videoWidth = "75%", // Chiều rộng mặc định của video section
  chatWidth = "25%", // Chiều rộng mặc định của chat section
  height = "90vh", // Chiều cao mặc định của modal
}) => {
  const [messages, setMessages] = useState([]);
  const [newConnection,setConnection]=useState(null)
  const [messageInput, setMessageInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true); // Trạng thái đóng/mở khung chat
  useEffect(()=>{
    const connection=getConnection();
    const startConnection = async () => {
        try {
          if (connection && connection.state === "Disconnected") {
            await connection.start();
          }
          setConnection(connection)
          await connection.invoke("JoinCallVideo",maCongViec+"")
          connection.off("CallVideo")
          connection.off("ReceiveMessageCall")
          connection.on("CallVideo", async (message) => {
                    try {
                      console.log(message)
                    } catch (error) {
                      
                    }
                  });
         await connection.on("ReceiveMessageCall",(message)=>{
            if(message.maCongViec===maCongViec+""){
                console.log(message)
                setMessages((prevMessages) => [...prevMessages, message.message]);
            }
            console.log(message)
                  })
        } catch (err) {
          console.error("Error while starting connection: ", err);
        }
        
      };
      startConnection();
      return () => {
        if (connection) {
          connection.off("CallVideo")
          connection.off("ReceiveMessageCall")
        }
      };
  },[])
  const handleSendMessage =async () => {
    if (messageInput.trim()) {
      await newConnection.invoke("ChatCallVideo",maCongViec+"",messageInput)
      setMessageInput("");
    }
  };

  const handleEndCall = () => {
    setOpenCallVideo(false); // Đóng giao diện gọi video
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Đóng hoặc mở khung chat
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="relative bg-white rounded-lg overflow-hidden flex shadow-lg"
        style={{
          width: isChatOpen
            ? `calc(${videoWidth} + ${chatWidth})`
            : videoWidth, // Nếu khung chat đóng, chỉ hiển thị phần video
          height: height,
        }}
      >
        {/* Video Section */}
        <div
          className="bg-black grid grid-cols-2 gap-2 p-4"
          style={{ width: videoWidth }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-700 rounded-lg flex items-center justify-center text-white"
            >
              Participant {i + 1}
            </div>
          ))}

          {/* Toggle Chat Button */}
          <button
            onClick={toggleChat}
            className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 z-10"
          >
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
        </div>

        {/* Chat Section */}
        {isChatOpen && (
          <div
            className="flex flex-col bg-gray-100"
            style={{ width: chatWidth }}
          >
            {/* Header */}
            <div className="p-4 bg-gray-200 border-b">
              <h2 className="text-lg font-bold">Chat</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg"
                >
                  {message}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>

            {/* End Call Button */}
            <div className="p-4 bg-gray-200 text-center border-t">
              <button
                onClick={handleEndCall}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallVideo;
