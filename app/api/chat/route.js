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

       const completion= await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {role:"user",
                content:message
                }
            ]
        })

        return Response.json({
            response:completion.choices[0].message.content
        },{status:200})
        
    } catch (error) {
        console.log("some error occured",error);
        return Response.json({
            error:"Some error occured"
        },{status:500})
        
        
    }
}

export async function GET(request){
    return Response.json({
        msg:"this is a get route for chat api"
    })
}
