"use client"

import Link from 'next/link'
import React from 'react'
function page() {

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

  return (
    <div>
      <h1>hey wassup guys </h1>
      <h1 className='text-4xl white ml-4 mt-4'>hiheheh</h1>
      <Link href="/route1">
      <button className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Route 1</button>

      
      </Link>
      <button onClick={getdata} className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Fetch data</button>
      <button onClick={testapi_func} className='bg-white text-black cursor-pointer m-2 p-2 rounded-md '>Test API</button>
      
    </div>
  )
}

export default page
