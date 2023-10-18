// /api/chapter/getInfo

import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getTranscript, searchYouTube } from "@/lib/youtube";
import { NextResponse } from "next/server";
import z from "zod";

const bodyParser = z.object({
    chapterId : z.string()
})

export async function POST(req : Request, res : Response){
    try {
        const body = await req.json()
        const {chapterId} = bodyParser.parse(body)
        const chapter = await prisma.chapter.findUnique({
            where : {
                id : chapterId,
            }
        });
        if(!chapter){
            return NextResponse.json(
                {
                    success : false,
                    error : "Chapter not found.",
                },
                {
                    status :404
                }
            );

        }
        const videoId = await searchYouTube(chapter.youtubeQuerySearch)
        const transcript = await getTranscript(videoId)

        const {summary} : {summary : string} = await strict_output(
            'You are an AI capable of summarising a youtube transcript',
            'summarise in 250 words or less and do not talk of the sponsors or anything related to the main topic, also do not introduce what the summary is about. \n'+
            transcript,
            {summary : "summary of the transcript"}
        )
        return NextResponse.json({videoId, transcript, summary})
    } catch (error) {
        if(error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success : false,
                    error : "Invalid body",
                },
                {
                    status :400
                }
            );
        } else {
            return NextResponse.json(
                {
                    success : false,
                    error : 'unknown'
                }
            )
        }
    }
}