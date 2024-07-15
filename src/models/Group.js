import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    members: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    expenses: [
        {
            expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }
        }
    ]
});

export default mongoose.models.Group || mongoose.model('Group', groupSchema);
