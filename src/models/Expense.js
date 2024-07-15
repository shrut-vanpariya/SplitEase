import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amountOwed: { type: Number },
    share: { type: Number }, // Optional, only if splitMode is BY_SHARES
    percentage: { type: Number } // Optional, only if splitMode is BY_PERCENTAGE
});

const expenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['individual', 'group'], required: true },
    participants: [participantSchema],
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Optional, only if type is group
    splitMode: { type: String, enum: ['EVENLY', 'BY_SHARES', 'BY_PERCENTAGE', 'BY_AMOUNT'], required: true },
    settled: { type: Boolean, default: false }
});

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
