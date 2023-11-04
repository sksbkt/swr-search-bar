'use client'

import { Post, User } from "@prisma/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import useSWR from 'swr'

const fetchPosts = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok)
        throw new Error('failed to load posts');
    return response.json();
}

const Search = () => {
    const search = useSearchParams();
    const searchQuery = search ? search.get('q') : null;
    const encodedSearchQuery = encodeURI(searchQuery || '');
    const { data, isLoading } = useSWR<{ posts: Array<Post & { author: User }> }>(
        `/api/search?q=${encodedSearchQuery}`,
        fetchPosts
    );

    if (!isLoading && data && data.posts)
        return (
            <>
                {
                    data.posts.map((post, index) => (
                        <div key={index} className="flex border-[0.1px] border-zinc-700 rounded-xl w-4/6 max-w-5xl mt-3">
                            <div className="flex flex-row p-3 gap-4">

                                <Image
                                    src={post.author.imageUrl}
                                    alt={post.author.name}
                                    height={52}
                                    width={52}
                                    className="render-full"
                                />
                                <div className="flex flex-col gap-2">
                                    <span className="text-xl font-semibold">{post.author.name}</span>
                                    <span className="text-xs font-thin">{post.body}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </>
        );
    else
        return (
            <div>loading!</div>)
};

export default Search