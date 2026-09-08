import { Play, Clock } from 'lucide-react';
import { Card } from '@mui/material';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MyCoursesProps {
  onSelectCourse: (courseId: number) => void;
}

export function MyCourses({ onSelectCourse }: MyCoursesProps) {
  const enrolledCourses = [
    {
      id: 1,
      title: 'Dominação Absoluta',
      subtitle: 'Controle Total',
      progress: 45,
      totalLessons: 5,
      completedLessons: 2,
      timeLeft: '2h 15min',
      image: 'https://images.unsplash.com/photo-1559335185-5b7ddef49716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Arte da Conquista',
      subtitle: 'Sedução Refinada',
      progress: 72,
      totalLessons: 4,
      completedLessons: 3,
      timeLeft: '1h 10min',
      image: 'https://images.unsplash.com/photo-1567115702188-ea12a355f14a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Psicologia Dark',
      subtitle: 'Manipulação Ética',
      progress: 18,
      totalLessons: 4,
      completedLessons: 1,
      timeLeft: '3h 20min',
      image: 'https://images.unsplash.com/photo-1700739746391-26561c282181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Linguagem Corporal',
      subtitle: 'Presença Alpha',
      progress: 60,
      totalLessons: 3,
      completedLessons: 2,
      timeLeft: '45min',
      image: 'https://images.unsplash.com/photo-1757196892661-dd9d35f2d6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="bg-gradient-to-b from-[#0A1A3A] to-black p-6 pb-8">
        <h1 className="text-white text-3xl mb-1" style={{ fontWeight: 900 }}>Meus Cursos</h1>
        <p className="text-[#999] text-sm">{enrolledCourses.length} cursos ativos</p>
      </div>

      <div className="px-4 md:px-6 -mt-4">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-x-visible md:snap-none">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="relative group cursor-pointer flex-shrink-0 w-[65vw] snap-start md:w-auto md:flex-shrink"
            >
              <Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A', overflow: 'hidden' }}>
                <div className="relative aspect-[9/16] overflow-hidden">
                  {/* Image */}
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center top' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Progress badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-[#4169FF]">
                    <span className="text-[#4169FF] text-xs" style={{ fontWeight: 900 }}>{course.progress}%</span>
                  </div>

                  {/* Meta info */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Clock size={11} className="text-[#999]" />
                    <span className="text-[#999] text-[10px]">{course.timeLeft}</span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                    <p className="text-[#4169FF] text-xs mb-1" style={{ fontWeight: 800 }}>{course.subtitle}</p>
                    <h4 className="text-white text-2xl leading-tight mb-6" style={{ fontWeight: 900 }}>{course.title}</h4>

                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4169FF] rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[#4169FF] text-xs" style={{ fontWeight: 800 }}>
                          {course.completedLessons}/{course.totalLessons} Aulas
                        </p>
                        <Play size={18} className="text-[#4169FF]" fill="#4169FF" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}