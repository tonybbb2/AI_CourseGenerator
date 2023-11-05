import CreateCourseForms from '@/components/CreateCourseForms';
import { checkSubscription } from '@/lib/Subscription';
import { getAuthSession } from '@/lib/auth'
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const CreatePage = async (props: Props) => {

    const session = await getAuthSession();
    if(!session?.user){
        return redirect('/gallery')
    }

    const isPro = await checkSubscription();

    return (
        <div className='flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0'>
            <h1 className='self-center text-3xl font-bold text-center sm:text-6xl'>
                Welcome!
            </h1>
            <div className='flex p-4 mt-5 border-none bg-secondary'>
                <InfoIcon className='w-12 h-12 mr-3 text-blue-400'/>
                <div>
                    Enter in a course title, or what you would like to learn about. 
                    Then enter a list of units, which are the specifics you want to learn. 
                </div>
            </div>
            <CreateCourseForms isPro={isPro}/>

        </div>
    )
}

export default CreatePage;