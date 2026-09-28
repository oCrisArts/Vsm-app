import { FormEvent, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Edit3, Eye, EyeOff, FileText, HelpCircle, Layers, Plus, Trash2, Video, X } from 'lucide-react';
import {
  learningAdmin,
  removeLearningAsset,
  uploadLearningAsset,
  useAdminLearning,
  type AdminCourse,
  type AdminLesson,
  type AdminQuiz,
} from '../../../lib/hooks/useAdminLearning';
import type { Course, LessonBlock, Module, QuizQuestion } from '../../../lib/types';

const BG = '#121212';
const SURFACE = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER = '#2A2A2A';
const PRIMARY = '#7C3AED';
const TEXT2 = '#9E9E9E';
const TEXT3 = '#666666';

type Tab = 'cursos' | 'modulos' | 'aulas' | 'quiz';
type Editor =
  | { kind: 'course'; item?: AdminCourse }
  | { kind: 'module'; item?: Module }
  | { kind: 'lesson'; item?: AdminLesson }
  | { kind: 'quiz'; item?: AdminQuiz }
  | { kind: 'block'; item?: LessonBlock; parentId: string }
  | { kind: 'question'; item?: QuizQuestion; parentId: string };

const inputStyle = { backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '11px 12px', fontSize: 13 };
const labelStyle = { color: TEXT3, fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 6 } as const;
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

function Actions({ onEdit, onDelete, onToggle, published, extra }: { onEdit: () => void; onDelete: () => void; onToggle?: () => void; published?: boolean; extra?: React.ReactNode }) {
  return <div className="flex items-center gap-1.5 flex-shrink-0">
    {extra}
    {onToggle && <button title={published ? 'Despublicar' : 'Publicar'} onClick={onToggle} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: published ? '#86EFAC' : TEXT3, backgroundColor: SURFACE2 }}>{published ? <Eye size={14} /> : <EyeOff size={14} />}</button>}
    <button title="Editar" onClick={onEdit} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: TEXT2, backgroundColor: SURFACE2 }}><Edit3 size={14} /></button>
    <button title="Excluir" onClick={onDelete} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#EF4444', backgroundColor: SURFACE2 }}><Trash2 size={14} /></button>
  </div>;
}

export function EnsinoAdminPage() {
  const { courses, quizzes, loading, error, reload } = useAdminLearning();
  const [activeTab, setActiveTab] = useState<Tab>('cursos');
  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [blockLesson, setBlockLesson] = useState<AdminLesson | null>(null);
  const [questionQuiz, setQuestionQuiz] = useState<AdminQuiz | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedCourseId = courseId || courses[0]?.id || '';
  const selectedCourse = courses.find(course => course.id === selectedCourseId);
  const modules = selectedCourse?.modules ?? [];
  const selectedModuleId = moduleId && modules.some(module => module.id === moduleId) ? moduleId : modules[0]?.id || '';
  const lessons = modules.find(module => module.id === selectedModuleId)?.lessons ?? [];
  const selectedQuizzes = quizzes.filter(quiz => quiz.course_id === selectedCourseId);

  const allModules = useMemo(() => courses.flatMap(course => course.modules), [courses]);
  const allLessons = useMemo(() => allModules.flatMap(module => module.lessons), [allModules]);

  const notify = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), 3500);
  };

  const run = async (operation: () => Promise<{ error: { message: string } | null }>, success: string) => {
    setBusy(true);
    try {
      const result = await operation();
      if (result.error) throw result.error;
      await reload();
      setEditor(null);
      notify('success', success);
    } catch (cause) {
      notify('error', cause instanceof Error ? cause.message : 'Não foi possível concluir a operação.');
    } finally {
      setBusy(false);
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    let uploaded: { bucket: 'course-covers' | 'lesson-media'; path: string } | null = null;
    try {
      let result: { error: { message: string } | null };
      if (editor.kind === 'course') {
        const cover = data.get('cover') as File;
        let imageUrl = editor.item?.image_url ?? null;
        if (cover?.size) {
          imageUrl = await uploadLearningAsset('course-covers', cover, 'covers');
          uploaded = { bucket: 'course-covers', path: imageUrl };
        }
        const payload = {
          title: String(data.get('title') || '').trim(), subtitle: String(data.get('subtitle') || '').trim(),
          slug: slugify(String(data.get('slug') || data.get('title') || '')), description: String(data.get('description') || '').trim(),
          tag: String(data.get('tag') || '').trim(), image_url: imageUrl, order_index: Number(data.get('order_index') || 0),
          is_published: data.get('is_published') === 'on',
        };
        result = editor.item ? await learningAdmin.updateCourse(editor.item.id, payload) : await learningAdmin.createCourse(payload);
        if (!result.error && editor.item && imageUrl !== editor.item.image_url) await removeLearningAsset('course-covers', editor.item.image_url);
      } else if (editor.kind === 'module') {
        const payload = { course_id: String(data.get('course_id')), title: String(data.get('title') || '').trim(), description: String(data.get('description') || '').trim(), order_index: Number(data.get('order_index') || 0) };
        result = editor.item ? await learningAdmin.updateModule(editor.item.id, payload) : await learningAdmin.createModule(payload);
      } else if (editor.kind === 'lesson') {
        const payload = { module_id: String(data.get('module_id')), title: String(data.get('title') || '').trim(), description: String(data.get('description') || '').trim(), duration: String(data.get('duration') || '').trim(), order_index: Number(data.get('order_index') || 0), is_published: data.get('is_published') === 'on' };
        result = editor.item ? await learningAdmin.updateLesson(editor.item.id, payload) : await learningAdmin.createLesson(payload);
      } else if (editor.kind === 'quiz') {
        const lessonId = String(data.get('lesson_id') || '');
        const payload = { course_id: String(data.get('course_id')), lesson_id: lessonId || null, title: String(data.get('title') || '').trim(), description: String(data.get('description') || '').trim() };
        result = editor.item ? await learningAdmin.updateQuiz(editor.item.id, payload) : await learningAdmin.createQuiz(payload);
      } else if (editor.kind === 'block') {
        const media = data.get('media') as File;
        let mediaUrl = editor.item?.media_url ?? null;
        if (media?.size) {
          mediaUrl = await uploadLearningAsset('lesson-media', media, editor.parentId);
          uploaded = { bucket: 'lesson-media', path: mediaUrl };
        }
        const payload = { lesson_id: editor.parentId, type: String(data.get('type')), title: String(data.get('title') || '').trim() || null, content: String(data.get('content') || '').trim(), media_url: mediaUrl, order_index: Number(data.get('order_index') || 0) };
        result = editor.item ? await learningAdmin.updateBlock(editor.item.id, payload) : await learningAdmin.createBlock(payload);
        if (!result.error && editor.item && mediaUrl !== editor.item.media_url) await removeLearningAsset('lesson-media', editor.item.media_url);
      } else {
        const options = String(data.get('options') || '').split('\n').map(value => value.trim()).filter(Boolean);
        const correctAnswer = Number(data.get('correct_answer') || 0);
        if (options.length < 2 || correctAnswer < 0 || correctAnswer >= options.length) throw new Error('Informe ao menos duas alternativas e uma resposta correta válida.');
        const payload = { quiz_id: editor.parentId, question: String(data.get('question') || '').trim(), options, correct_answer: correctAnswer, order_index: Number(data.get('order_index') || 0) };
        result = editor.item ? await learningAdmin.updateQuestion(editor.item.id, payload) : await learningAdmin.createQuestion(payload);
      }
      if (result.error) throw result.error;
      await reload();
      setEditor(null);
      notify('success', 'Conteúdo salvo com sucesso.');
    } catch (cause) {
      if (uploaded) await removeLearningAsset(uploaded.bucket, uploaded.path);
      notify('error', cause instanceof Error ? cause.message : 'Não foi possível salvar.');
    } finally { setBusy(false); }
  };

  const remove = async (kind: Editor['kind'], item: AdminCourse | Module | AdminLesson | AdminQuiz | LessonBlock | QuizQuestion) => {
    if (!window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) return;
    await run(async () => {
      if (kind === 'course') {
        const result = await learningAdmin.deleteCourse(item.id);
        if (!result.error) await removeLearningAsset('course-covers', (item as AdminCourse).image_url);
        return result;
      }
      if (kind === 'module') return learningAdmin.deleteModule(item.id);
      if (kind === 'lesson') return learningAdmin.deleteLesson(item.id);
      if (kind === 'quiz') return learningAdmin.deleteQuiz(item.id);
      if (kind === 'block') {
        const result = await learningAdmin.deleteBlock(item.id);
        if (!result.error) await removeLearningAsset('lesson-media', (item as LessonBlock).media_url);
        return result;
      }
      return learningAdmin.deleteQuestion(item.id);
    }, 'Item excluído com sucesso.');
  };

  const toggle = (kind: 'course' | 'lesson', item: AdminCourse | AdminLesson) => run(
    () => kind === 'course' ? learningAdmin.updateCourse(item.id, { is_published: !item.is_published }) : learningAdmin.updateLesson(item.id, { is_published: !item.is_published }),
    item.is_published ? 'Conteúdo despublicado.' : 'Conteúdo publicado.',
  );

  const openNew = () => {
    if (activeTab === 'cursos') setEditor({ kind: 'course' });
    if (activeTab === 'modulos') setEditor({ kind: 'module' });
    if (activeTab === 'aulas') setEditor({ kind: 'lesson' });
    if (activeTab === 'quiz') setEditor({ kind: 'quiz' });
  };

  const tabs = [
    { id: 'cursos' as const, label: 'Cursos', Icon: BookOpen }, { id: 'modulos' as const, label: 'Módulos', Icon: Layers },
    { id: 'aulas' as const, label: 'Aulas', Icon: Video }, { id: 'quiz' as const, label: 'Quiz', Icon: HelpCircle },
  ];

  return <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
    <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}><h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500 }}>Ensinar</h1><p style={{ color: TEXT2, fontSize: 13 }}>Cursos, módulos, aulas e quiz</p></div>
    {feedback && <div className="mx-5 mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: feedback.type === 'success' ? '#16A34A20' : '#EF444420', color: feedback.type === 'success' ? '#86EFAC' : '#FCA5A5', border: `1px solid ${feedback.type === 'success' ? '#16A34A' : '#EF4444'}40`, fontSize: 12 }}>{feedback.text}</div>}
    <div className="px-5 mb-5 flex gap-1 overflow-x-auto no-scrollbar">{tabs.map(({ id, label, Icon }) => <button key={id} onClick={() => setActiveTab(id)} className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4" style={{ borderRadius: 100, backgroundColor: activeTab === id ? PRIMARY : 'transparent', color: activeTab === id ? '#fff' : TEXT2, fontSize: 12 }}><Icon size={13} />{label}</button>)}</div>

    {activeTab !== 'cursos' && <div className="px-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
      <select value={selectedCourseId} onChange={event => { setCourseId(event.target.value); setModuleId(''); }} className="text-white outline-none" style={inputStyle}>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select>
      {activeTab === 'aulas' && <select value={selectedModuleId} onChange={event => setModuleId(event.target.value)} className="text-white outline-none" style={inputStyle}>{modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select>}
    </div>}

    {loading && <div className="px-5 py-8" style={{ color: TEXT3, fontSize: 13 }}>Carregando conteúdo...</div>}
    {(error || (!loading && courses.length === 0)) && <div className="px-5 py-8" style={{ color: error ? '#FCA5A5' : TEXT3, fontSize: 13 }}>{error || 'Nenhum curso cadastrado.'}</div>}

    {!loading && activeTab === 'cursos' && <div className="px-5 grid grid-cols-2 lg:grid-cols-4 gap-4">{courses.map(course => <div key={course.id} className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      {course.cover_src && <img src={course.cover_src} alt={course.title} className="absolute inset-0 w-full h-full object-cover object-top" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,.55) 55%, rgba(30,64,175,.08) 100%)' }} />
      <div className="absolute top-2 right-2"><Actions onEdit={() => setEditor({ kind: 'course', item: course })} onDelete={() => void remove('course', course)} onToggle={() => void toggle('course', course)} published={course.is_published} /></div>
      <div className="absolute bottom-0 left-0 right-0 p-3"><p style={{ color: '#93C5FD', fontSize: 9 }}>{course.subtitle}</p><h4 className="text-white mb-2" style={{ fontSize: 14, fontWeight: 500 }}>{course.title}</h4><div className="flex justify-between"><span style={{ color: TEXT3, fontSize: 9 }}>{course.modules.flatMap(module => module.lessons).length} aulas</span><span style={{ color: course.is_published ? '#86EFAC' : TEXT3, fontSize: 9 }}>{course.is_published ? 'Publicado' : 'Rascunho'} · #{course.order_index}</span></div></div>
    </div>)}</div>}

    {!loading && activeTab === 'modulos' && <div className="px-5 space-y-2">{modules.length === 0 && <p style={{ color: TEXT3, fontSize: 13 }}>Nenhum módulo neste curso.</p>}{modules.map(module => <div key={module.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: PRIMARY + '20' }}><Layers size={16} style={{ color: PRIMARY }} /></div><div className="flex-1"><p className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{module.title}</p><p style={{ color: TEXT3, fontSize: 11 }}>{module.lessons.length} aulas · ordem {module.order_index}</p></div><Actions onEdit={() => setEditor({ kind: 'module', item: module })} onDelete={() => void remove('module', module)} /></div>)}</div>}

    {!loading && activeTab === 'aulas' && <div className="px-5 space-y-2">{lessons.length === 0 && <p style={{ color: TEXT3, fontSize: 13 }}>Nenhuma aula neste módulo.</p>}{lessons.map(lesson => <div key={lesson.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E40AF20' }}><Video size={16} style={{ color: '#93C5FD' }} /></div><div className="flex-1 min-w-0"><p className="text-white truncate" style={{ fontSize: 13, fontWeight: 500 }}>{lesson.title}</p><p style={{ color: TEXT3, fontSize: 11 }}>{lesson.duration} · {lesson.lesson_blocks.length} blocos · ordem {lesson.order_index}</p></div><Actions onEdit={() => setEditor({ kind: 'lesson', item: lesson })} onDelete={() => void remove('lesson', lesson)} onToggle={() => void toggle('lesson', lesson)} published={lesson.is_published} extra={<button title="Conteúdo da aula" onClick={() => setBlockLesson(lesson)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#93C5FD', backgroundColor: SURFACE2 }}><FileText size={14} /></button>} /></div>)}</div>}

    {!loading && activeTab === 'quiz' && <div className="px-5 space-y-2">{selectedQuizzes.length === 0 && <p style={{ color: TEXT3, fontSize: 13 }}>Nenhum quiz neste curso.</p>}{selectedQuizzes.map(quiz => <div key={quiz.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FF8C4220' }}><HelpCircle size={16} style={{ color: '#FF8C42' }} /></div><div className="flex-1"><p className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{quiz.title}</p><p style={{ color: TEXT3, fontSize: 11 }}>{quiz.quiz_questions.length} questões{quiz.lesson_id ? ` · ${allLessons.find(lesson => lesson.id === quiz.lesson_id)?.title || 'Aula'}` : ''}</p></div><Actions onEdit={() => setEditor({ kind: 'quiz', item: quiz })} onDelete={() => void remove('quiz', quiz)} extra={<button title="Perguntas" onClick={() => setQuestionQuiz(quiz)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#FF8C42', backgroundColor: SURFACE2 }}><HelpCircle size={14} /></button>} /></div>)}</div>}

    <button onClick={openNew} disabled={busy || (activeTab !== 'cursos' && !selectedCourseId)} className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg disabled:opacity-50" style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100 }}><Plus size={18} className="text-white" /><span className="text-white" style={{ fontSize: 13 }}>{activeTab === 'cursos' ? 'Novo Curso' : activeTab === 'modulos' ? 'Novo Módulo' : activeTab === 'aulas' ? 'Nova Aula' : 'Novo Quiz'}</span></button>

    <ManagerSheet title={blockLesson?.title || ''} open={Boolean(blockLesson)} onClose={() => setBlockLesson(null)} addLabel="Novo bloco" onAdd={() => blockLesson && setEditor({ kind: 'block', parentId: blockLesson.id })}>{blockLesson?.lesson_blocks.map(block => <div key={block.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: SURFACE2 }}><div className="flex-1"><p className="text-white" style={{ fontSize: 13 }}>{block.title || block.type}</p><p style={{ color: TEXT3, fontSize: 10 }}>{block.type} · ordem {block.order_index}</p></div><Actions onEdit={() => setEditor({ kind: 'block', item: block, parentId: blockLesson.id })} onDelete={() => void remove('block', block)} /></div>)}</ManagerSheet>
    <ManagerSheet title={questionQuiz?.title || ''} open={Boolean(questionQuiz)} onClose={() => setQuestionQuiz(null)} addLabel="Nova pergunta" onAdd={() => questionQuiz && setEditor({ kind: 'question', parentId: questionQuiz.id })}>{questionQuiz?.quiz_questions.map(question => <div key={question.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: SURFACE2 }}><div className="flex-1"><p className="text-white" style={{ fontSize: 13 }}>{question.question}</p><p style={{ color: TEXT3, fontSize: 10 }}>{question.options.length} alternativas · ordem {question.order_index}</p></div><Actions onEdit={() => setEditor({ kind: 'question', item: question, parentId: questionQuiz.id })} onDelete={() => void remove('question', question)} /></div>)}</ManagerSheet>
    <EditorSheet editor={editor} courses={courses} selectedCourseId={selectedCourseId} selectedModuleId={selectedModuleId} allLessons={allLessons} busy={busy} onClose={() => setEditor(null)} onSave={save} />
  </div>;
}

function ManagerSheet({ title, open, onClose, onAdd, addLabel, children }: { title: string; open: boolean; onClose: () => void; onAdd: () => void; addLabel: string; children: React.ReactNode }) {
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] flex items-end"><div className="absolute inset-0 bg-black/70" onClick={onClose} /><motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative z-10 w-full max-h-[85vh] overflow-y-auto space-y-3" style={{ backgroundColor: SURFACE, borderRadius: '16px 16px 0 0', padding: '22px 20px 40px', border: `1px solid ${BORDER}` }}><div className="flex items-center justify-between"><div><p style={{ color: TEXT3, fontSize: 10 }}>GERENCIAR</p><h3 className="text-white" style={{ fontSize: 18 }}>{title}</h3></div><button onClick={onClose}><X size={18} style={{ color: TEXT2 }} /></button></div>{children}<button onClick={onAdd} className="w-full py-3 flex items-center justify-center gap-2 text-white" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 13 }}><Plus size={15} />{addLabel}</button></motion.div></motion.div>}</AnimatePresence>;
}

function EditorSheet({ editor, courses, selectedCourseId, selectedModuleId, allLessons, busy, onClose, onSave }: { editor: Editor | null; courses: AdminCourse[]; selectedCourseId: string; selectedModuleId: string; allLessons: AdminLesson[]; busy: boolean; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  if (!editor) return null;
  const item = editor.item;
  const title = `${item ? 'Editar' : 'Novo'} ${editor.kind === 'course' ? 'curso' : editor.kind === 'module' ? 'módulo' : editor.kind === 'lesson' ? 'aula' : editor.kind === 'quiz' ? 'quiz' : editor.kind === 'block' ? 'bloco' : 'pergunta'}`;
  const courseDefault = editor.kind === 'module' && item ? item.course_id : editor.kind === 'quiz' && item ? item.course_id || selectedCourseId : selectedCourseId;
  const modules = courses.find(course => course.id === courseDefault)?.modules ?? [];
  return <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-end"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} /><motion.form onSubmit={onSave} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative z-10 w-full max-h-[90vh] overflow-y-auto space-y-4" style={{ backgroundColor: SURFACE, borderRadius: '16px 16px 0 0', border: `1px solid ${BORDER}`, padding: '22px 20px 42px' }}><div className="flex items-center justify-between"><h3 className="text-white" style={{ fontSize: 18 }}>{title}</h3><button type="button" onClick={onClose}><X size={18} style={{ color: TEXT2 }} /></button></div>
    {(editor.kind === 'module' || editor.kind === 'quiz') && <Field label="CURSO"><select name="course_id" defaultValue={courseDefault} required className="w-full text-white outline-none" style={inputStyle}>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></Field>}
    {editor.kind === 'lesson' && <Field label="MÓDULO"><select name="module_id" defaultValue={item?.module_id || selectedModuleId} required className="w-full text-white outline-none" style={inputStyle}>{modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}</select></Field>}
    {editor.kind === 'quiz' && <Field label="AULA (OPCIONAL)"><select name="lesson_id" defaultValue={item?.lesson_id || ''} className="w-full text-white outline-none" style={inputStyle}><option value="">Quiz do curso</option>{allLessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></Field>}
    {editor.kind === 'block' && <Field label="TIPO"><select name="type" defaultValue={item?.type || 'text'} className="w-full text-white outline-none" style={inputStyle}><option value="text">Texto</option><option value="video">Vídeo</option><option value="image">Imagem</option><option value="audio">Áudio</option></select></Field>}
    {editor.kind !== 'question' && <Field label="TÍTULO"><input name="title" defaultValue={item?.title || ''} required={editor.kind !== 'block'} className="w-full text-white outline-none" style={inputStyle} /></Field>}
    {editor.kind === 'course' && <><Field label="SUBTÍTULO"><input name="subtitle" defaultValue={item?.subtitle || ''} required className="w-full text-white outline-none" style={inputStyle} /></Field><Field label="SLUG"><input name="slug" defaultValue={item?.slug || ''} placeholder="Gerado a partir do título" className="w-full text-white outline-none" style={inputStyle} /></Field><Field label="TAG"><input name="tag" defaultValue={item?.tag || ''} required className="w-full text-white outline-none" style={inputStyle} /></Field><Field label="CAPA"><input name="cover" type="file" accept="image/*" className="w-full text-white" style={{ fontSize: 12 }} /></Field></>}
    {(editor.kind === 'course' || editor.kind === 'module' || editor.kind === 'lesson' || editor.kind === 'quiz') && <Field label="DESCRIÇÃO"><textarea name="description" defaultValue={item?.description || ''} rows={3} className="w-full text-white outline-none resize-none" style={inputStyle} /></Field>}
    {editor.kind === 'lesson' && <Field label="DURAÇÃO"><input name="duration" defaultValue={item?.duration || ''} placeholder="Ex.: 12 min" required className="w-full text-white outline-none" style={inputStyle} /></Field>}
    {editor.kind === 'block' && <><Field label="CONTEÚDO / TRANSCRIÇÃO"><textarea name="content" defaultValue={item?.content || ''} rows={5} className="w-full text-white outline-none resize-none" style={inputStyle} /></Field><Field label="ARQUIVO DE MÍDIA"><input name="media" type="file" accept="image/*,video/*,audio/*" className="w-full text-white" style={{ fontSize: 12 }} /></Field></>}
    {editor.kind === 'question' && <><Field label="PERGUNTA"><textarea name="question" defaultValue={item?.question || ''} required rows={3} className="w-full text-white outline-none resize-none" style={inputStyle} /></Field><Field label="ALTERNATIVAS (UMA POR LINHA)"><textarea name="options" defaultValue={item?.options.join('\n') || ''} required rows={5} className="w-full text-white outline-none resize-none" style={inputStyle} /></Field><Field label="ÍNDICE DA RESPOSTA CORRETA (COMEÇA EM 0)"><input name="correct_answer" type="number" min="0" defaultValue={item?.correct_answer ?? 0} required className="w-full text-white outline-none" style={inputStyle} /></Field></>}
    {(editor.kind !== 'quiz') && <Field label="ORDEM"><input name="order_index" type="number" min="0" defaultValue={'order_index' in (item || {}) ? (item as { order_index: number }).order_index : 0} required className="w-full text-white outline-none" style={inputStyle} /></Field>}
    {(editor.kind === 'course' || editor.kind === 'lesson') && <label className="flex items-center gap-2" style={{ color: TEXT2, fontSize: 12 }}><input name="is_published" type="checkbox" defaultChecked={Boolean(item?.is_published)} />Publicado</label>}
    <button disabled={busy} className="w-full py-4 text-white disabled:opacity-60" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14 }}>{busy ? 'Salvando...' : 'Salvar'}</button>
  </motion.form></motion.div></AnimatePresence>;
}
