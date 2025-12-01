
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { toast } from "sonner";

const Journal = () => {
  const { session } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("journal_entries")
          .select("id, created_at, content")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setEntries(data || []);
      } catch (err) {
        console.error("Error fetching journal entries:", err.message);
        setError("Permission denied. Make sure the correct RLS policies are in place for the 'journal_entries' table.");
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
          setError("Couldn't connect to real-time updates. Your existing entries are shown, but new ones won't appear automatically. Please refresh the page.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleDelete = async (entryId) => {
    try {
      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      if (deleteError) throw deleteError;
      toast.success("Journal entry deleted.");
    } catch (err) {
      console.error("Error deleting entry:", err.message);
      toast.error("Failed to delete entry. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-muted-foreground">Loading journal entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Fetch Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Journal</h1>
      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {new Date(entry.created_at).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this journal entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">You don't have any journal entries yet. Go back to the dashboard to save your first reflection!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Journal;
