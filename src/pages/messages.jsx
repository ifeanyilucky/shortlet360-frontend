import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([
    // {
    //   sender: "AlexBreeCoop",
    //   text: "Hiii, thanks for checking me out, here's a few cheeky teasers 😜",
    // },
    // {
    //   sender: "Lizzy & Elle",
    //   text: "Hi there! Thank you for following! Our names are Lizzy and Elle and we're two...",
    // },
    // {
    //   sender: "Karen Cif",
    //   text: "Thank you for following. Suscríbete para ver todo mi contenido explícito sin...",
    // },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { sender: "You", text: inputValue }]);
      setInputValue("");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3   p-4">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <input
          type="text"
          placeholder="Search Conversations"
          className="w-full p-2 mb-4 rounded  "
        />
        <div className="flex justify-between mb-4">
          <button className=" px-3 py-1 rounded">Followed 2</button>
          <button className=" px-3 py-1 rounded">Subscribed 2</button>
          <button className=" px-3 py-1 rounded">All 2</button>
        </div>
        <div>
          {messages.map((message, index) => (
            <div key={index} className="mb-2 p-2  rounded">
              <div className="font-bold">{message.sender}</div>
              <div className="text-sm">{message.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3   p-4">
        <>
          {messages.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AlexBreeCoop</h2>
                <button className="">
                  <Icon fontSize={24} icon="ri:more-fill" />
                </button>
              </div>
              <div className="p-4 rounded mb-4">
                {/* <div className="mb-2">
            Hiii, thanks for checking me out, here's a few cheeky teasers 😜
          </div>
          <button className="bg-blue-500 px-3 py-1 rounded">
            View Content
          </button> */}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message @alexbreecoop"
                  className="flex-1 p-2 rounded  "
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 p-2 px-4 rounded bg-blue-500 "
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              Please subscribe to a creator to access this feature.
            </div>
          )}
        </>
      </div>
    </div>
  );
}
