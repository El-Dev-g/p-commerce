
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  async function addTodo(formData: FormData) {
    'use server'

    const title = formData.get('title') as string;
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { error } = await supabase.from('todos').insert({ title });

    if (!error) {
        revalidatePath('/todos')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <form action={addTodo} className="flex gap-2 mb-4">
        <input name="title" className="border rounded p-2 flex-grow" placeholder="Add a new todo..." />
        <button className="bg-primary text-primary-foreground rounded p-2">Add</button>
      </form>
      <ul className="list-disc pl-5">
        {todos?.map((todo: any) => (
          <li key={todo.id} className="mb-2">{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
