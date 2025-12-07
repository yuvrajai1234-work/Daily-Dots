
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays, addDays } from "date-fns";

export const EntryViewer = ({ entries, browsingDate, setBrowsingDate, handleDeleteJournal }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden relative">
        <div className="flex transition-transform duration-300 ease-in-out">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry.id} className="w-full flex-shrink-0">
                <div className="p-1">
                  <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                      <div className="flex items-center">
                        <div>
                            <CardTitle className="text-xl">
                            {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardTitle>
                            <CardDescription>{new Date(entry.created_at).toLocaleTimeString()}</CardDescription>
                        </div>
                        {entry.mood && <span className="text-2xl ml-4">{entry.mood}</span>}
                      </div>
                      <div className="flex items-center gap-2">
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
              </div>
            ))
          ) : (
            <div className="w-full flex-shrink-0">
              <div className="p-1">
                <Card>
                  <CardContent className="pt-6 flex items-center justify-center h-48">
                    <p className="text-muted-foreground">No journal recorded for {format(browsingDate, "PPP")}.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12"
        onClick={() => setBrowsingDate(subDays(browsingDate, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12"
        onClick={() => setBrowsingDate(addDays(browsingDate, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
