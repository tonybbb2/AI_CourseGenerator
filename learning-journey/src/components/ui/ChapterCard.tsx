'use client'
import { Chapter } from '@prisma/client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

type Props = {
    chapter : Chapter
    chapterIndex : number
}

export type ChapterCardHandler = {
    triggerLoad : () => void;
}

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(({chapter, chapterIndex}, ref) => {
    const [success, setSuccess] = React.useState<boolean | null>(null);
    const {mutate : getChapterInfo, isLoading} = useMutation({
        mutationFn : async () => {
            const response = await axios.post('/api/chapter/getInfo', {chapterId : chapter.id})
            return response.data
        },
    });

    React.useImperativeHandle(ref, () => ({
        async triggerLoad() {
            getChapterInfo(undefined, {
                onSuccess : () => {
                    console.log("success");
                }
            })
        }
    }))

  return (
    <div key={chapter.id} className={
        cn('px-4 py-2 mt-2 rounded flex justify-between',{
            "bg-secondary" : success === null,
            "bg-red-500" : success === false,
            "bg-green-600" : success === true
        })
    }>
        <h5>
            {chapter.name}
        </h5>
    </div>
  )
}
)

export default ChapterCard