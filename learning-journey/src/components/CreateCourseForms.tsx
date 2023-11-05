'use client'
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import z from 'zod'
import { createChaptersSchema } from './validators/course'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { Plus, SubscriptIcon, Trash } from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import axios from "axios";
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import SubscriptIconAction from './SubscriptIconAction'

type Props = {
    isPro : boolean
}

type Input = z.infer<typeof createChaptersSchema>

const CreateCourseForms = ({isPro}: Props) => {
    const router = useRouter();
    const {toast} = useToast();
    const {mutate : createChapters, isLoading} = useMutation({
        mutationFn : async({title, units} : Input) => {
            const response = await axios.post('/api/course/createChapter', {title, units})
            return response.data

        }
    })

  const form = useForm<Input>({
    resolver : zodResolver(createChaptersSchema),
    defaultValues : {
        title : '',
        units : ['', '', '']
    },
  })

  function onSubmit(data : Input){
      if(data.units.some(unit=>unit==='')){
        toast({
            title : "Error",
            description : "Please fill all the units",
            variant : "destructive"
        });
        return;
      }
      createChapters(data, {
          onSuccess : ({course_id}) => {
            toast({
                title : "success",
                description : "Course created succesfully!"
            });
            router.push(`/creation/${course_id}`)
          },
          onError : (error) => {
            toast({
                title : "Error",
                description : "Something went wrong behind the server.",
                variant : "destructive"
            });
            return;
          }
      })
  }

  console.log(form.watch())

  return (
    <div className='w-full'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-4'>
            <FormField 
            control={form.control}
            name="title"
            
            render={({field}) => {
                return (
                <FormItem className='flex flex-col items-start w-full sm:items-center flex-row'>
                    <FormLabel className='flex-[1] text-xl'>
                        Title
                    </FormLabel>
                    <FormControl className='flex-[6]'>
                        <Input placeholder="Enter the main topic of the course" {...field}/>
                    </FormControl>
                </FormItem>
                );
            }}
            />
            <AnimatePresence>
                {form.watch('units').map((_, index) => {
                    return (
                        <motion.div key={index}
                        initial={{opacity :0, height: 0}}
                        animate={{opacity:1, height:"auto"}}
                        exit={{opacity:0, height:0}}
                        transition={{
                            opacity : {duration: 0.2},
                            height: {duration: 0.2},
                        }}>
                            <FormField key={index} control={form.control} name={`units.${index}`} 
                            render={({field})=>{
                                return (
                                    <FormItem className='flex flex-col items-start w-full sm:items-center flex-row'>
                                        <FormLabel className='flex-[1]'>
                                            Unit {index + 1}
                                        </FormLabel>
                                        <FormControl className='flex-[6]'>
                                            <Input
                                                placeholder='Enter a subtopic of the course' {...field}
                                                />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            <div className='flex items-center justify-center mt-4'>
                <Separator className='flex-[1]'/>
                <div className='mx-4'>
                    <Button variant='secondary' className='font-semibold' onClick={() => {
                        form.setValue('units', [...form.watch('units'), ''])
                    }}>
                        Add Unit
                        <Plus className='w-4 h-4 ml-2 text-green-500'/>
                    </Button>
                    <Button variant='secondary' className='font-semibold ml-2' onClick={() => {
                        form.setValue('units', form.watch('units').slice(0, -1))
                    }}> 
                        Remove Unit
                        <Trash className='w-4 h-4 ml-2 text-red-500'/>
                    </Button>
                </div>
                <Separator className='flex-[1]'/>
            </div>
            <Button disabled={isLoading} type='submit' className='w-full mt-6' size='lg'>
                Start course
            </Button>

            </form>
        </Form>
        {!isPro && 
            <SubscriptIconAction />
        }
    </div>
  )
}

export default CreateCourseForms