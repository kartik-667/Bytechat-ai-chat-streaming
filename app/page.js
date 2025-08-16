"use client"

import Link from 'next/link'
import React, { useState } from 'react'
function page() {
  const [loading, setloading] = useState(false)
  const [message, setmessage] = useState("")
  const [response, setresponse] = useState("hey wassup guys")

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
         <button onClick={handleChat} className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Chat now </button>
      </div>

      {loading && (
        <h1>Loading...</h1>
      )}

      {response && (
        <div className='border-red-400'>
          <h1 className='text-4xl p-3 border-1 min-w-3xs'>{response}</h1>
        </div>
      )}
      
    </div>
  )
}

export default page
