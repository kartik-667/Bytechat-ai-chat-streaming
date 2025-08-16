import OpenAI from "openai";

const openai=new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey:process.env.OPENAI_API_KEY
})


export async function POST(request){
    try {
        const {message}=await request.json()
        if(!message || message.trim().length ==0){
            return Response.json({
                msg:"Message cant be empty"
            },{status:402})
        }

       const stream= await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {role:"user",
                content:message
                }
            ],
            stream:true
        })

        const encoder=new TextEncoder()

        const readable=new ReadableStream({
            async start(controller){
                for await(const chunk of stream){
                    const content=chunk.choices[0]?.delta?.content || ""

                    if(content){
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({content})}\n\n`
                            )
                        )
                    }
    
                }
                controller.close()

            }

        })

        return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream", // SSE header
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });


       
        
    } catch (error) {
        console.log("some error occured",error);
        return Response.json({
            error:"Some error occured"
        },{status:500})
        
        
    }
}
