// import mongoose from 'mongoose';

// export async function connectMongoDB() {
//     try {
//         mongoose.connect(process.env.MONGODB_URI!);
// const connection = mongoose.connection;

// connection.on('connected', () => {
//     console.log('MongoDB connected successfully');
// })

// connection.on('error', (err) => {
//     console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
//     process.exit();
// })

//     } catch (error) {
//         console.log('Something goes wrong!');
//         console.log(error);

//     }
// }

import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

console.log(MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Extend the global object to include a mongoose property
declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

// Global cache to store connection promise
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectMongoDB(): Promise<Mongoose> {
    if (cached.conn) {
        console.log("DB already connected!");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        }).catch((err) => {
            console.log("Error from dbConfig:");
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};
