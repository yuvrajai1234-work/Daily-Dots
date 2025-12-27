
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const AIAssistant = () => {
  const { session } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://us-central1-daily-dots.cloudfunctions.net/askAIAssistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      setResponse(data.text);

      if (session) {
        const today = new Date().toISOString().slice(0, 10);
        const { error } = await supabase.auth.updateUser({
          data: {
            ...session.user.user_metadata,
            ai_quest_completed_on: today,
          },
        });
        if (error) {
          console.error("Error updating user metadata for AI quest:", error);
        }
      }
    } catch (error) {
      console.error("Error asking AI assistant:", error);
      setResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your AI assistant for help with your habits..."
              className="mb-4"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </form>
          {response && (
            <div className="mt-4">
              <h3 className="font-semibold">Response:</h3>
              <p>{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
