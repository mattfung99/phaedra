import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'

interface TipTapEditorProps {
  value: string
  onChange: (html: string) => void
}

export function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'post-content min-h-[16rem] rounded-md border bg-transparent px-3 py-2 focus:outline-none',
      },
    },
  })

  // Keep the editor in sync when the parent resets content (e.g. loading an edit).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  if (!editor) return null

  const tools = [
    {
      icon: Bold,
      label: 'Bold',
      run: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      run: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: List,
      label: 'Bullet list',
      run: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Ordered list',
      run: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Quote',
      run: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive('blockquote'),
    },
    {
      icon: Undo,
      label: 'Undo',
      run: () => editor.chain().focus().undo().run(),
      active: false,
    },
    {
      icon: Redo,
      label: 'Redo',
      run: () => editor.chain().focus().redo().run(),
      active: false,
    },
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 rounded-md border p-1">
        {tools.map(({ icon: Icon, label, run, active }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-pressed={active}
            onClick={run}
            className={cn(
              'size-8',
              active && 'bg-accent text-accent-foreground',
            )}
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
