import prisma from "@/prisma/client";
import { Post, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    try {

        const query = url.searchParams.get('q');


        if (typeof query !== 'string')
            throw new Error(`invalid query type: ${typeof query}`);

        const posts: Array<Post & { author: User }> = await prisma.post.findMany({
            where: {
                OR: [
                    {
                        body: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        author: {
                            name: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            },
            include: {
                author: true
            }
        });
        //* we need to add {posts: posts} so we wont have conflict with the schema that we are looking for in the frontend (data.posts)
        return new Response(JSON.stringify({ posts: posts }), { status: 200 });
    } catch (error) {
        console.log('error', error);

        return new Response(JSON.stringify(error), { status: 500 });
    }
}
