import { useState } from 'react'
import { Plus, Pencil, Trash2, StickyNote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useNotes } from '@/context/NotesContext'
import { cn } from '@/utils/cn'

function formatDate(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Notes() {
  const { state, addNote, updateNote, deleteNote } = useNotes()
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  const handleAdd = () => {
    if (!newContent.trim()) return
    addNote({ content: newContent.trim() })
    setNewContent('')
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const saveEdit = (id) => {
    if (!editContent.trim()) return
    updateNote({ id, content: editContent.trim() })
    setEditingId(null)
    setEditContent('')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Add note */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Textarea
            id="new-note-input"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Capture a thought, idea, or anything..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleAdd()
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ctrl+Enter to save</p>
            <Button
              variant="brand"
              size="sm"
              onClick={handleAdd}
              id="add-note-btn"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {state.notes.length} Note{state.notes.length !== 1 ? 's' : ''}
        </h2>

        {state.notes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <StickyNote className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notes yet</p>
            <p className="text-sm mt-1">Capture your first thought above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.notes.map((note) => (
              <Card
                key={note.id}
                className="group hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="brand"
                          onClick={() => saveEdit(note.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => startEdit(note)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 hover:text-destructive"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
