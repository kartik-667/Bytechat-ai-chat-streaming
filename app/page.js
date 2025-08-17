
"use client";

import Link from "next/link";
import React, { useState } from "react";

function Page() {
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [response, setresponse] = useState("Send a message to show result");
  const [streamdata, setstreamdata] = useState("");
  const [streaming, setstreaming] = useState(false);

  async function getdata() {
    let res1 = await fetch("/api/test");
    if (res1.ok) console.log("api called");
    else {
      console.log("api failed");
      return;
    }

    let res2 = await res1.json();

    console.log(res2);
    return;
  }

  async function testapi_func() {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChat = async () => {
    setloading(true);
    setresponse("");
    // setmessage("") //reset the old msg

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data) setresponse(data.response);

      return;
    } catch (error) {
      console.log(error, "error occured");
      // @ts-ignore
      setresponse("Error " + error.message);
    } finally {
      setloading(false);
    }
  };


    const handleStreamchat=async ()=>{
    console.log("stream fnc called");
    
    setstreaming(true)
    setstreamdata("")

    try {
      const res=await fetch("/api/chat-stream",{
        method:"POST",
        body:JSON.stringify({message}),
        headers:{
          "Content-Type":"application/json"
        }
      })

      //now res is getting stream not text
      const reader=res.body.getReader()
      const decoder=new TextDecoder()

      
      while(true){
        const {done,value}=await reader.read()
        if(done) break;

        const chunk=decoder.decode(value)
        const lines=chunk.split("\n")
        lines.forEach((line)=>{
          if(line.startsWith("data: ")){

            const data=JSON.parse(line.slice(6))
            setstreamdata((prev)=> prev+data.content) //this is how to access the prev value of a state using callback
          }

        })

      }

      
    } catch (error) {
      console.log("error",error);
      setstreamdata("error"+error)
      
    }finally{
      setstreaming(false)
    }

  }

  function handleReset(){
    setstreamdata("")
    setmessage("")
    setresponse("Send a message to show result")
    
  }




  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-100">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Byte-Chat</h1>
            <p className="text-zinc-400 text-sm md:text-base mt-1">Type a message and get a response or a streaming reply.</p>
          </div>
          
        </header>

       
       

        {/* Input Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="p-5 md:p-6">
            <label htmlFor="t1" className="block text-sm font-medium text-zinc-300 mb-2">
              Enter message
            </label>
            <textarea
              rows={5}
              cols={20}
              placeholder="enter your message here "
              id="t1"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-zinc-700 placeholder-zinc-500 resize-y"
            ></textarea>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  handleChat();
                  
                }}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium shadow-md hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Get Response
              </button>
              <button
                onClick={() => {
                  
                  handleStreamchat();
                }}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium shadow-md hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Stream Response
              </button>
              <button
                onClick={() => {
                  handleReset();
                  
                }}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium shadow-md hover:bg-red-500 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Reset chat
              </button>

              {loading && (
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Loading...
                </span>
              )}

              {streaming && (
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Streaming...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Response */}
        {response && (
          <section className="mt-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl overflow-hidden">
              <div className="border-b border-zinc-800 px-5 py-3">
                <h2 className="text-lg font-semibold tracking-tight">Response</h2>
              </div>
              <div className="p-5 md:p-6">
                <p className="text-base leading-relaxed text-zinc-200 whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Streaming */}
        {streamdata && (
          <section className="mt-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-xl overflow-hidden">
              <div className="border-b border-zinc-800 px-5 py-3">
                <h2 className="text-lg font-semibold tracking-tight">Streaming data</h2>
              </div>
              <div className="p-5 md:p-6">
                <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4">
                  <p className="text-zinc-200 text-base leading-relaxed whitespace-pre-wrap ">
                    {streamdata}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

       
      </div>
    </div>
  );
}

export default Page;
