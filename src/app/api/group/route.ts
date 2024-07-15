import Group from "@/models/Group";
import User from "@/models/User";
import { connectMongoDB } from "@/dbConfig/dbConfig";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('uid');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID (uid) is required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        await connectMongoDB();

        // const groups = await Group.find({ 'members.userId': userId });

        const groups = await Group.find({ 'members.userId': userId })
            .populate({
                path: 'members.userId',
                select: 'username email image'
            });

        return new Response(JSON.stringify(groups), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error fetching groups", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}


export async function POST(req: Request) {
    try {
        await connectMongoDB();

        const { name, createdBy, members } = await req.json();

        // Validate members
        if (!Array.isArray(members) || members.length === 0 || !createdBy || !name) {
            return new Response(JSON.stringify({ error: 'Enter proper details.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Include the creator in the members list if not already included
        if (!members.includes(createdBy)) {
            members.push(createdBy);
        }

        console.log(members);

        const newGroup = new Group({
            name,
            createdBy,
            createdAt: new Date(),
            members: members.map(userId => ({
                userId,
                joinedAt: new Date()
            }))
        });

        await newGroup.save();

        // Add the new group ID to each member's groups array
        const groupId = newGroup._id;
        await User.updateMany(
            { _id: { $in: members } },
            { $push: { groups: { groupId, joinedAt: new Date() } } }
        );

        return new Response(JSON.stringify({ message: "Group created successfully" }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error Creating Group", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}