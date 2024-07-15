import Expense from "@/models/Expense";
import Group from "@/models/Group";
import { connectMongoDB } from "@/dbConfig/dbConfig";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const userId = url.searchParams.get('uid');
    const friendId = url.searchParams.get('fid');
    const groupId = url.searchParams.get('gid');

    // console.log("========================", userId, friendId);


    if (!userId && !friendId && !groupId) {
        return new Response(JSON.stringify({ error: 'User ID or Group ID is required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    let expenses;
    try {
        await connectMongoDB();
        if (userId && friendId) {
            expenses = await Expense.find({
                type: 'individual',
                participants: {
                    $all: [
                        { $elemMatch: { userId: userId } },
                        { $elemMatch: { userId: friendId } }
                    ]
                }
            }).populate({
                path: 'participants.userId',
                select: '_id username email image'
            });
        }
        else if (userId) {
            expenses = await Expense.find({
                'participants.userId': userId
            })
        }
        else if (groupId) {
            expenses = await Expense.find({ groupId }).populate({
                path: 'participants.userId',
                select: '_id username email image'
            });
        }
        // console.log(expenses);

        return new Response(JSON.stringify({ expenses: expenses }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error fetching expenes", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST(req: Request) {

    const { description, amount, currency, createdBy, participants, groupId, type, splitMode } = await req.json();

    if (!participants || participants.length === 0) {
        return new Response(JSON.stringify({ error: 'Participants are required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    let calculatedParticipants = [];
    switch (splitMode) {
        case 'EVENLY':
            const evenAmount = amount / participants.length;
            calculatedParticipants = participants.map((user: any) => ({
                userId: user.userId,
                amountOwed: evenAmount
            }));
            break;
        case 'BY_SHARES':
            const totalShares = participants.reduce((sum: any, p: any) => sum + p.share, 0);
            calculatedParticipants = participants.map((p: any) => ({
                userId: p.userId,
                share: p.share,
                amountOwed: (amount * p.share) / totalShares
            }));
            break;
        case 'BY_PERCENTAGE':
            calculatedParticipants = participants.map((p: any) => ({
                userId: p.userId,
                percentage: p.percentage,
                amountOwed: (amount * p.percentage) / 100
            }));
            break;
        case 'BY_AMOUNT':
            calculatedParticipants = participants;
            break;
        default:
            return new Response(JSON.stringify({ error: 'Invalid split mode.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    }

    console.log(calculatedParticipants);


    try {
        await connectMongoDB();

        const newExpense = new Expense({
            description,
            amount,
            currency,
            createdBy,
            participants: calculatedParticipants,
            groupId,
            type,
            splitMode,
            settled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedExpense = await newExpense.save();

        // If groupId is provided, add the expense to the group's expenses array
        if (groupId) {
            await Group.findByIdAndUpdate(groupId, {
                $push: { expenses: { expenseId: savedExpense._id } }
            });
        }

        return new Response(JSON.stringify({ message: "success" }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error creating expense", error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}
