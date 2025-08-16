"use client"

import Link from 'next/link'
import React, { useState } from 'react'
function page() {
  const [loading, setloading] = useState(false)
  const [message, setmessage] = useState("")
  const [response, setresponse] = useState("Send a message to show result")
  const [streamdata, setstreamdata] = useState("")
  const [streaming,setstreaming]=useState(false)

  async function getdata(){
    let res1=await fetch("/api/test")
    if(res1.ok ) console.log("api called");
    else{
      console.log("api failed");
       return;
    } 
    
    
    let res2=await res1.json()

    console.log(res2);
    return;
    
  }

  async function testapi_func(){
    try {
      const res=await fetch("/api/chat")
      const data=await res.json()
      console.log(data);
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleChat= async ()=>{
    setloading(true)
    setresponse("")
    // setmessage("") //reset the old msg

    try {
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({message})
      })

      const data=await res.json()
      if(data) setresponse(data.response)

      return

      
    } catch (error) {
      console.log(error,"error occured");
      setresponse("Error "+error.message)
      
      
    }finally{
      setloading(false)
    }

  }

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

//   const handleStreamchat = async () => {
//   console.log("stream fnc called");

//   setstreaming(true);
//   setstreamdata("");

//   try {
//     const res = await fetch("/api/chat-stream", {
//       method: "POST",
//       body: JSON.stringify({ message }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();
//     let buffer = "";

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });

//       // Split SSE chunks on double newline
//       const parts = buffer.split("\n\n");

//       // Keep last partial chunk in buffer
//       buffer = parts.pop();

//       for (const part of parts) {
//         if (part.startsWith("data:")) {
//           const jsonStr = part.slice(5).trim();
//           if (jsonStr && jsonStr !== "[DONE]") {
//             try {
//               const data = JSON.parse(jsonStr);
//               setstreamdata((prev) => prev + data.content); // ✅ append to state
//             } catch (e) {
//               console.error("JSON parse failed:", e, "for:", jsonStr);
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.log("error", error);
//     setstreamdata("Error: " + error.message);
//   } finally {
//     setstreaming(false);
//   }
// };

//   async function handleStreamchat() {
//       console.log("stream fnc called");
    
//     setstreaming(true)
//     setstreamdata("")
//     try {
//       const res = await fetch("/api/chat-stream", {
//     method: "POST",
//     body: JSON.stringify({ message }),
//   });

//   const reader = res.body.getReader();
//   const decoder = new TextDecoder();
//   let buffer = "";

//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;

//     buffer += decoder.decode(value, { stream: true });

//     buffer.split("\n\n").forEach((part) => {
//       if (part.startsWith("data:")) {
//         const jsonStr = part.replace("data: ", "");
//         try {
//           const data = JSON.parse(jsonStr);
//           // console.log("Streamed content:", data.content);
//           setstreamdata((prev)=> prev+data.content)
//         } 
//       }catch (error) {
//       console.log("error",error);
//       setstreamdata("error"+error)
      
//     }finally{
//       setstreaming(false)
//     }
//     });
//   }
      
//     } 
  
// }


  return (
    <div>
      <Link href="/route1">
      <button className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Route 1</button>

      
      </Link>
      <button onClick={getdata} className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Fetch data</button>
     

      <div>
        <label htmlFor="t1">Enter message</label>
        <br />
        <textarea rows={5} cols={20} placeholder='enter your message here ' name="" id="t1" value={message} onChange={(e)=> setmessage(e.target.value)} className='bg-slate-800'></textarea>
        <br />
         <button onClick={()=>{
          handleChat()
          handleStreamchat()
         }} className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Chat now </button>
      </div>

      {loading && (
        <h1>Loading...</h1>
      )}

      {response && (
        <div className='border-red-400'>
          <h1 className='text-4xl p-3 border-t-2 border-b-2'>{response}</h1>
        </div>
      )}

      {streaming && (
        <h1>Loading streaming response...</h1>
      )}

      {streamdata && (
        <div className='border-red-400'>
          <h1 className='text-4xl'>Streaming data is : </h1>
          <h1 className='text-2xl p-3 border-1  text-center'>{streamdata}</h1>
        </div>

      )}
      
    </div>
  )
}

export default page
