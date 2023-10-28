import { getAuthSession } from '@/lib/auth';
import { Info } from 'lucide-react'
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import ConfirmChapters from '@/components/ui/ConfirmChapters';

type Props = {
    params : {
        courseId : string;
    }
}

const createChapters = async ({params : {courseId}}: Props) => {
    const session = await getAuthSession()
    if(!session?.user){
        return redirect('/gallery')
    }

    const course = await prisma.course.findUnique({
        where : {
            id : courseId
        },
        include : {
            units : {
                include : {
                    chapters : true
                }
            }
        }
    });

    if(!course){
        return redirect("/creation")
    }

    return (
        <div className='flex flex-col items-start max-w-xl mx-auto my-16'>
            <h5 className='text-sm uppercase text-secondary-foreground/60'>
                Course Name
            </h5>
            <h1 className='text-5xl font-bold'>{course.name}</h1>
            <div className='flex p-4 mt-5 border-none bg-secondary'>
                <Info className='w-12 h-12 mr-3 text-blue-400'></Info>
                <div>
                    We generated chapters for each of your units. Look over them and comfirm to continue.
                </div>
            </div>
            <ConfirmChapters course={course}/>
        </div>
    )
}

export default createChapters