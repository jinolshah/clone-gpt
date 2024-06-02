"use server";
import { connect,connection } from 'mongoose';

const mongoDBUri = process.env.MONGODB_URI!

export default async function ConnectDB() {
    try {
        if (connection?.readyState) {
            return;
        }
        await connect(mongoDBUri)
    } catch (err) {
        console.log(err);
    }
}