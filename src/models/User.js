import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'blocked'], default: 'pending' },
    friendRequestSendBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        // unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [
            function (value) {
                return (this.authProvider === "credentials")
            },
            "Please provide a password"],
    },
    image: {
        type: String,
        default: "",
    },
    authProvider: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    friends: [friendSchema],
    groups: [
        {
            groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
            joinedAt: { type: Date, default: Date.now }
        }
    ]
})

// const User = mongoose.models?.users || mongoose.model("users", userSchema);
const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;