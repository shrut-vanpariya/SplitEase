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

        const user = await User.findById(userId).populate({
            path: 'friends.friendId',
            select: '_id username email image'
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // console.log(user.friends);
        
        const friends = user.friends.map((friend: any) => {
            const { _id, username, email, image } = friend.friendId;            
            const { status } = friend;
            return { _id, username, email, image, status };
        });

        // console.log(friends);


        return new Response(JSON.stringify(friends), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error fetching friends", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST(req: Request) {
    await connectMongoDB();

    const { userEmail, friendEmail } = await req.json();

    console.log(userEmail, friendEmail);


    if (!userEmail || !friendEmail || (userEmail === friendEmail)) {
        return new Response(JSON.stringify({ error: 'User ID and Friend ID are required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return new Response(JSON.stringify({ error: 'User or Friend not found.' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const isAlreadyFriend = user.friends.some((f: any) => f.friendId.toString() === friend._id.toString());
        const isFriendAlreadyUser = friend.friends.some((f: any) => f.friendId.toString() === user._id.toString());

        if (isAlreadyFriend || isFriendAlreadyUser) {
            return new Response(JSON.stringify({ error: 'They are already friends or a request is already pending.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }


        user.friends.push({
            friendId: friend._id,
            status: 'pending',
            friendRequestSendBy:user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        friend.friends.push({
            friendId: user._id,
            status: 'pending',
            friendRequestSendBy:user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await user.save();
        await friend.save();

        return new Response(JSON.stringify({ message: 'Friend request sent.' }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function PATCH(req: Request) {

    const { userId, friendId, status } = await req.json();

    if (!userId || !friendId || !status) {
        return new Response(JSON.stringify({ error: 'User ID, Friend ID, and Status are required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    if (!['accepted', 'rejected', 'blocked'].includes(status)) {
        return new Response(JSON.stringify({ error: 'Invalid status.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        await connectMongoDB();
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return new Response(JSON.stringify({ error: 'User or Friend not found.' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const userFriend = user.friends.find((f: any) => f.friendId.toString() === friendId);
        const friendUser = friend.friends.find((f: any) => f.friendId.toString() === userId);

        if (!userFriend || !friendUser) {
            return new Response(JSON.stringify({ error: 'Friend request not found.' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        userFriend.status = status;
        userFriend.updatedAt = new Date();

        friendUser.status = status;
        friendUser.updatedAt = new Date();

        await user.save();
        await friend.save();

        return new Response(JSON.stringify({ message: `Friend request ${status}.` }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
