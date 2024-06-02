"use server";
import ConnectDB from '@/utils/mongoose.server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api')) {
        console.log("Connect")
    }
}