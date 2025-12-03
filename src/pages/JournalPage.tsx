
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useStickyState } from "@/hooks/useStickyState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Plus, Trash2, Terminal, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from "sonner";
import { format } from "date-fns";

// Mock function to get AI motivation
const getAIMotivation = async () => {
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The best way to predict the future is to create it.",
    "You are never too old to set another goal or to dream a new dream.",
    "Believe you can and you're halfway there."
  ];
  return Promise.resolve(quotes[Math.floor(Math.random() * quotes.length)]);
};

const moods = ['😄', '😊', '😐', '😢', '😠'];

const JournalPage = () => {
  const { session } = useAuth();
  const [motivation, setMotivation] = useState('');
  
  const [todos, setTodos] = useStickyState([], "journal:todos");
  const [newTodo, setNewTodo] = useState('');
  
  const [dailyReflection, setDailyReflection] = useStickyState('', "journal:dailyReflection");
  const [mistakesReflection, setMistakesReflection] = useStickyState('', "journal:mistakesReflection");
  const [successSteps, setSuccessSteps] = useStickyState('', "journal:successSteps");
  const [mood, setMood] = useStickyState(null, "journal:mood");
  const [lastEntryDate, setLastEntryDate] = useStickyState(null, "journal:lastEntryDate");

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Clear fields if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastEntryDate !== today) {
      setDailyReflection('');
      setMistakesReflection('');
      setSuccessSteps('');
      setTodos([]);
      setMood(null);
      setLastEntryDate(today);
    }
  }, []);

  // Fetch motivation quote
  useEffect(() => {
    getAIMotivation().then(setMotivation);
  }, []);

  // Fetch and subscribe to journal entries
  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", session.user.id);

        if (selectedDate) {
          const from = format(selectedDate, 'yyyy-MM-dd HH:mm:ss');
          const to = format(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss');
          query = query.gte('created_at', from).lt('created_at', to);
        }

        const { data, error: fetchError } = await query.order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setEntries(data || []);
      } catch (err) {
        console.error("Error fetching journal entries:", err.message);
        setError("Permission denied. Make sure RLS policies are enabled for 'journal_entries'.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();

    const channel = supabase
      .channel(`journal-entries-changes:${session.user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journal_entries', filter: `user_id=eq.${session.user.id}` },
        () => fetchEntries()
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Real-time channel error:', err);
          setError("Couldn't connect to real-time updates. Please refresh.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, selectedDate]);
  
  const handleSaveJournal = async () => {
    if (dailyReflection.trim() === '') {
        toast.error("Your daily reflection cannot be empty.");
        return;
    }
    try {
        const entryPayload = {
            user_id: session.user.id,
            daily_reflection: dailyReflection,
            mistakes_reflection: mistakesReflection,
            success_steps: successSteps,
            todos: todos,
            mood: mood,
        };
        const { error: insertError } = await supabase.from('journal_entries').insert(entryPayload);
        if (insertError) throw insertError;
        
        toast.success("Journal entry saved!");
        const today = new Date().toDateString();
        setDailyReflection('');
        setMistakesReflection('');
        setSuccessSteps('');
        setTodos([]);
        setMood(null);
        setLastEntryDate(today);
    } catch (err) {
        console.error("Error saving entry:", err.message);
        toast.error("Failed to save entry. Please try again.");
    }
  };

  const handleDeleteJournal = async (entryId) => {
    try {
      const { error: deleteError } = await supabase.from('journal_entries').delete().eq('id', entryId);
      if (deleteError) throw deleteError;
      setEntries(entries.filter(entry => entry.id !== entryId));
      toast.success("Journal entry deleted.");
    } catch (err) {
      console.error("Error deleting entry:", err.message);
      toast.error("Failed to delete entry. Please try again.");
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
        <CardHeader><CardTitle>AI Motivation</CardTitle></CardHeader>
        <CardContent><p className="text-lg italic">"{motivation}"</p></CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>Select a mood that best describes your day.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-around">
          {moods.map(m => (
            <Button key={m} variant={mood === m ? 'default' : 'outline'} size="icon" onClick={() => setMood(m)} className={`text-2xl rounded-full ${mood === m ? 'transform scale-125' : ''}`}>
              {m}
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Write About Your Day</CardTitle>
            <CardDescription>What was great? What could be better? Get it all down.</CardDescription>
        </CardHeader>
        <CardContent>
            <Textarea 
                value={dailyReflection}
                onChange={(e) => setDailyReflection(e.target.value)}
                placeholder="Start writing your daily reflection..." 
                className="min-h-[150px]" 
            />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>To-Do List</CardTitle>
                <CardDescription>What are your key tasks for today?</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." />
                    <Button onClick={handleAddTodo}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                    {todos.map(todo => (
                        <div key={todo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => handleToggleTodo(todo.id)} />
                                <label htmlFor={`todo-${todo.id}`} className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>{todo.text}</label>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Mistakes and Reflection</CardTitle>
                    <CardDescription>What went wrong, and what did you learn?</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={mistakesReflection}
                        onChange={(e) => setMistakesReflection(e.target.value)}
                        placeholder="Reflect on any setbacks or challenges..." />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Steps Towards Success</CardTitle>
                    <CardDescription>What are the concrete solutions and next actions?</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        value={successSteps}
                        onChange={(e) => setSuccessSteps(e.target.value)}
                        placeholder="Outline your plan to improve and succeed..." />
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="flex justify-center">
          <Button onClick={handleSaveJournal} size="lg">Save Today's Journal</Button>
      </div>

      <div>
        <div className="flex items-center justify-between my-6">
          <h2 className="text-2xl font-bold tracking-tight">Past Entries</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>
          {selectedDate && <Button variant="ghost" onClick={() => setSelectedDate(undefined)}>Clear</Button>}
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading journal entries...</p>
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Fetch Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : entries.length > 0 ? (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {entries.map((entry) => (
                <CarouselItem key={entry.id}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </CardTitle>
                          <CardDescription>{new Date(entry.created_at).toLocaleTimeString()}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.mood && <div className="text-2xl">{entry.mood}</div>}
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this journal entry.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJournal(entry.id)}>Continue</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Daily Reflection</h3>
                          <p className="whitespace-pre-wrap text-muted-foreground">{entry.daily_reflection}</p>
                        </div>
                        {entry.todos && entry.todos.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">To-Do List</h3>
                            <ul className="space-y-2">
                              {entry.todos.map(todo => (
                                <li key={todo.id} className="flex items-center gap-3">
                                  <Checkbox id={`past-todo-${todo.id}`} checked={todo.completed} disabled />
                                  <label htmlFor={`past-todo-${todo.id}`} className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>{todo.text}</label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.mistakes_reflection && (
                          <div>
                            <h3 className="font-semibold mb-2">Mistakes and Reflection</h3>
                            <p className="whitespace-pre-wrap text-muted-foreground">{entry.mistakes_reflection}</p>
                          </div>
                        )}
                        {entry.success_steps && (
                          <div>
                            <h3 className="font-semibold mb-2">Steps Towards Success</h3>
                            <p className="whitespace-pre-wrap text-muted-foreground">{entry.success_steps}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <Card>
            <CardContent className="pt-6"><p className="text-muted-foreground">No entries found for this date.</p></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
