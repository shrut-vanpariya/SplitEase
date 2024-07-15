import User from "@/models/User";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import { auth } from "@/auth";


export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email');
    const userId = searchParams.get('uid');

    if (!email && !userId) {
        return new Response(JSON.stringify({ error: 'Email or userId is required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        await connectMongoDB();
        let user
        if(email) {
            user = await User.findOne({email:email});        
        }
        else {
            user = await User.findById(userId)
        }
        return new Response(JSON.stringify({user: user}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error fetching users", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}

export async function POST(req: Request) {
    const res = await req.json();
    console.log(res);

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}