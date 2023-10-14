// /api/course/createChapter

import { NextResponse } from "next/server"
import { createChaptersSchema } from "@/components/validators/course"
import { ZodError } from "zod"
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response){
    try {
        const body = await req.json()
        const {title, units} = createChaptersSchema.parse(body);

        type outputUnits = {
            title : string;
            chapters : {
                youtube_search_query : string;
                chapter_title : string;
            }[];
        };

        let output_units : outputUnits = await strict_output(
            'You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter.', 
            new Array(units.length).fill(
                `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
            ),
            {
                title : 'title of the unit',
                chapters : 'an array of chapters, each chapter should have a youtube_search_query and a chapter_title ket in the JSON object.'
            }
        );

        const imageSearchTerm = await strict_output(
            'You are an AI capable of finding the most relevant image for a course',
            `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good result.`,
            {
                image_search_term : 'a good search term for the title of the course'
            }
        )

        const course_image = await getUnsplashImage(
            imageSearchTerm.image_search_term
        )

        // const course = await prisma
    
        return NextResponse.json([output_units, imageSearchTerm, course_image]);
    } catch (error) {
        if(error instanceof ZodError){
            return new NextResponse("invalid body", {status:400})
        }  else {
            console.log(error)
            // Handle other types of errors here and return an appropriate response
            return new NextResponse("An error occurred", { status: 500 });
        }
    }
} 

