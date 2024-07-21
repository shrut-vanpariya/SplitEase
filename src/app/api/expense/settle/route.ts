import Expense from "@/models/Expense";
import Group from "@/models/Group";
import { connectMongoDB } from "@/dbConfig/dbConfig";

import {
    PriorityQueue, MinPriorityQueue, MaxPriorityQueue,
} from 'datastructures-js';


const settleDebt = (transactions: any) => {
    const debtMap = new Map();

    transactions.forEach(([payer, payee, amount]: any) => {
        debtMap.set(payer, (debtMap.get(payer) || 0) - amount);
        debtMap.set(payee, (debtMap.get(payee) || 0) + amount);
    });

    console.log(debtMap);

    // return

    const minHeap = new MinPriorityQueue();
    const maxHeap = new MaxPriorityQueue();


    debtMap.forEach((amount, person) => {
        if (amount < 0) {
            minHeap.push([amount, person]);
        } else if (amount > 0) {
            maxHeap.push([amount, person]);
        }
    });

    console.log(minHeap.toArray());
    console.log(maxHeap.toArray());


    const settlements = [];

    while (!minHeap.isEmpty()) {
        const [debt, debtor]: any = minHeap.front();
        minHeap.pop();
        const [credit, creditor]: any = maxHeap.front();
        maxHeap.pop();



        if (debt + credit < 0) {
            minHeap.push([debt + credit, debtor]);
            settlements.push({
                from: creditor,
                to: debtor,
                amount: credit
            });
        }
        else {
            maxHeap.push([debt + credit, creditor]);
            settlements.push({
                from: debtor,
                to: creditor,
                amount: Math.abs(debt)
            });
        }
    }

    return settlements;
};


export async function POST(req: Request) {

    const { groupId } = await req.json();

    if (!groupId) {
        return new Response(JSON.stringify({ error: 'Group ID is required.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        await connectMongoDB();
        const group = await Group.findById(groupId).populate('expenses.expenseId');
        if (!group) {
            return new Response(JSON.stringify({ error: 'Group not found.' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }


        const transactions: any[] = [];
        const expenseIds: any[] = [];

        group.expenses.forEach((exp: any) => {
            const expense = exp.expenseId;

            if (!expense.settled) {

                const { participants, amount, createdBy } = expense;

                participants.forEach((participant: any) => {
                    if (participant.userId.toString() !== createdBy.toString()) {
                        transactions.push([
                            participant.userId.toString(),
                            createdBy.toString(),
                            participant.amountOwed
                        ]);
                    }
                });

                expenseIds.push(expense._id)
            }
        });

        const settlements: any[] = settleDebt(transactions);


        settlements.map(async (debt: any) => {
            console.log(debt);

            let calculatedParticipants = [
                {
                    userId: debt.from,
                    amountOwed: 0
                },
                {
                    userId: debt.to,
                    amountOwed: debt.amount
                }
            ];

            const newExpense = new Expense({
                description: `Expense form ${group.name}`,
                amount: debt.amount,
                currency: "INR",
                createdBy: debt.to,
                participants: calculatedParticipants,
                type: "individual",
                splitMode: "BY_AMOUNT",
                settled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // console.log(newExpense);

            const savedExpense = await newExpense.save();
        })

        await Expense.updateMany(
            { _id: { $in: expenseIds } },
            { $set: { settled: true, updatedAt: new Date() } }
        );

        return new Response(JSON.stringify({ message: "ok", transactions: transactions, settlements: settlements }), {
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