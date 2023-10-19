import CourseSideBar from '@/components/ui/CourseSideBar'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params : {
        slug : string[]
    }
}

const CoursePage = async ({params : {slug} }: Props) => {
    const [courseId, unitIndexParam, chapterIndexParam] = slug;
    const course = await prisma.course.findUnique({
      where : {id : courseId},
      include : {
        units : {
          include : {chapters : true}
        }
      }
    })
    if(!course) {
      return redirect('/gallery')
    }

    let unitIndex = parseInt(unitIndexParam);
    let chapterIndex = parseInt(chapterIndexParam);

    const unit = course.units[unitIndex];
    if(!unit){
      return redirect('/gallery');
    }
    return (
      <CourseSideBar course={course}/>

    )
}

export default CoursePage