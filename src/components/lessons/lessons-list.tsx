import { useRef, useState } from 'react'
// import type { } from '@types'
import { Button } from 'antd'
import dayjs from "dayjs";
import type { GroupLessonsType, Lesson } from '../../types/lessons';
const LessonsList = ({lessons}:GroupLessonsType) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScroll =()=>{
      if(containerRef.current){
        setScrollPosition(containerRef.current.scrollLeft)
      }
  }
  const goNext =()=>{
    if(containerRef.current){
      containerRef.current.scrollBy({left: 50, behavior: 'smooth'})
    }
  }
  const goPrev =()=>{
    if(containerRef.current){
      containerRef.current.scrollBy({left: -50, behavior: 'smooth'})
    }
  }
  const isStartDisabled =()=>{
    if(!containerRef.current) return true;
    return scrollPosition <= 5
  }
  const isEndDisabled =()=>{
    if(!containerRef.current) return true;
    const container = containerRef.current
    return scrollPosition + container.clientWidth >= container.scrollWidth - 3
  }
  return (
    <div className='flex gap-2 items-center'>
      <Button type='primary' onClick={goPrev} disabled={isStartDisabled()}>prev</Button>
      <div className='overflow-scroll flex gap-1 [&::-webkit-scrollbar]:hidden' ref={containerRef} onScroll={handleScroll}>
        {
        lessons.map((lesson:Lesson, index:number)=>{
          console.log(index);
          
          return <div key={lesson.id} className='bg-[#ccc] rounded-sm cursor-pointer'><span className='text-[13px]'>{dayjs(lesson.date).format('DD-MM')}</span></div>
        })
      }
      </div>
      <Button type='primary' onClick={goNext} disabled={isEndDisabled()}>next!</Button>
    </div>
  )
}

export default LessonsList