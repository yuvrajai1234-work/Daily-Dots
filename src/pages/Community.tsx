
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Community = () => {
  const { session } = useAuth();
  const [reflections, setReflections] = useState<any[]>([]);
  const [newReflection, setNewReflection] = useState("");
  const [page, setPage] = useState(1);
  const reflectionsPerPage = 5;

  const fetchReflections = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*, user:profiles(*)")
      .order("created_at", { ascending: false })
      .range((page - 1) * reflectionsPerPage, page * reflectionsPerPage - 1);
    if (error) console.error("Error fetching reflections:", error);
    else setReflections(data);
  };

  useEffect(() => {
    fetchReflections();
  }, [page]);

  const handleShare = async () => {
    if (!newReflection.trim() || !session) return;

    const { error } = await supabase.from("journal_entries").insert([
      {
        content: newReflection,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.error("Error sharing reflection:", error);
    } else {
      setNewReflection("");
      fetchReflections(); // Refresh reflections after sharing

      const today = new Date().toISOString().slice(0, 10);
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          ...session.user.user_metadata,
          community_post_completed_on: today,
        },
      });
      if (userError) {
        console.error("Error updating user metadata for community quest:", userError);
      }
    }
  };

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Share a Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            placeholder="What's on your mind today?"
            className="mb-4"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleShare}>Share</Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {reflections.map((reflection) => (
          <Card key={reflection.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={reflection.user.avatar_url} />
                  <AvatarFallback>{reflection.user.full_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{reflection.user.full_name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">{new Date(reflection.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{reflection.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(p => Math.max(1, p - 1));
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // This is a simplification. A robust implementation would check if there are more pages.
                setPage(p => p + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Community;
