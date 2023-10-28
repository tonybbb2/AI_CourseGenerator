import CourseSideBar from '@/components/ui/CourseSideBar'
import MainVideoSummary from '@/components/ui/MainVideoSummary'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params : {
        slug : string[];
    };
}

const CoursePage = async ({params : {slug} }: Props) => {
    const [courseId, unitIndexParam, chapterIndexParam] = slug;
    const course = await prisma.course.findUnique({
      where : {id : courseId},
      include : {
        units : {
          include : {
            chapters : {
              include : {
                questions : true
              },
          }}
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

    console.log(unit);
    
    const chapter = unit.chapters[chapterIndex];
    if (!chapter){
      return redirect('/gallery')
    }

    return (
      <div>
        <CourseSideBar course={course} currentChapterId={chapter.id}/>
        <div>
          <div className='ml-[400px] px-8'>
              <div className='flex'>
                <MainVideoSummary 
                  chapter={chapter}
                  chapterIndex={chapterIndex}
                  unit={unit}
                  unitIndex={unitIndex}
                />
              </div>
          </div>
        </div>
      </div>
    )
}

export default CoursePage