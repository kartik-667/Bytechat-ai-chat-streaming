

//  function handler(req,res){
//     if(req.method=="GET"){
//         return res.status(200).json({
//             msg:"this is msg from api backend"
//         })
//     }

//     if(req.method=="POST"){
//         return res.status(200).json({
//             msg:"this is a post req from backend"
//         })
//     }
// }

export async function GET(request){
    try {
    //     return res.status(200).json({
    //            msg:"this is msg from api backend"
    //    })
    return Response.json( {msg:"this is msg from api backend"})
        
    } catch (error) {
        
        console.log(error);
        
    }

}