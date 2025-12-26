
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const subscriptionPlans = [
    {
      title: "Weekly",
      price: "399",
      coins: "100 P Coins",
      features: [
        "100 P Coins",
        "Ad-Free Experience",
        "Exclusive Badge"
      ]
    },
    {
      title: "Monthly",
      price: "1199",
      coins: "500 P Coins",
      recommended: true,
      features: [
        "500 P Coins",
        "Ad-Free Experience",
        "Exclusive Badge",
        "Premium Content Access",
      ]
    },
    {
      title: "6 Months",
      price: "6399",
      coins: "3000 P Coins",
      features: [
        "3000 P Coins",
        "Everything in Monthly",
        "Bonus Event Coins",
      ]
    },
    {
      title: "Yearly",
      price: "11999",
      coins: "7000 P Coins",
      features: [
        "7000 P Coins",
        "Everything in 6 Months",
        "Early Access to Features"
      ]
    },
];

const EarnCoins = () => {
  const { session } = useAuth();
  const [adViews, setAdViews] = useState(0);
  const [lastAdViewDate, setLastAdViewDate] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      const userMetadata = session.user.user_metadata;
      const today = new Date().toISOString().split("T")[0];
      if (userMetadata?.last_ad_view_date === today) {
        setAdViews(userMetadata?.ad_views_today || 0);
      } else {
        setAdViews(0);
      }
      setLastAdViewDate(userMetadata?.last_ad_view_date || null);
    }
  }, [session]);

  const canWatchAd = () => {
    if (!session) return false;
    const today = new Date().toISOString().split("T")[0];
    if (lastAdViewDate !== today) return true;
    return adViews < 5;
  };

  const handleWatchAd = async () => {
    if (!session) {
      toast.error("You must be logged in to watch ads.");
      return;
    }
    
    if (!canWatchAd()) {
      toast.error("You have reached the daily limit for watching ads.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newAdViews = lastAdViewDate === today ? adViews + 1 : 1;

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ad_views_today: newAdViews,
        last_ad_view_date: today,
        coins: {
          ...session.user.user_metadata.coins,
          b_coins: (session.user.user_metadata.coins?.b_coins || 0) + 10,
        },
      },
    });

    if (error) {
      toast.error("Failed to update your coin balance.");
    } else {
      toast.success("You've earned 10 B Coins!");
      setAdViews(newAdViews);
      setLastAdViewDate(today);
      supabase.auth.refreshSession();
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4 sm:p-6 md:p-8">
        <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
            <h2 className="text-sm font-bold text-blue-400 tracking-widest uppercase">How Much Does It Cost?</h2>
            <h1 className="text-4xl md:text-5xl font-bold mt-2">Our Subcriptions</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {subscriptionPlans.map((plan, index) => (
                <Card key={index} className={`bg-zinc-900 border-zinc-800 rounded-xl flex flex-col ${plan.recommended ? 'border-2 border-blue-500' : ''} relative`}>
                    {plan.recommended && (
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Recommended</div>
                    )}
                    <CardHeader className="text-center pt-10">
                        <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                        <p className="text-gray-400 text-sm">{plan.coins}</p>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between text-center px-6 pb-6">
                        <div>
                            <p className="text-gray-400 text-sm">Starts at</p>
                            <p className="text-5xl font-bold my-1">₹{plan.price}</p>
                            <p className="text-gray-400 text-sm">/ {plan.title.toLowerCase()}</p>
                            <ul className="text-left my-6 space-y-2 text-gray-300 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg mt-4">Buy Now</Button>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="max-w-4xl mx-auto">
            <Card className="mt-8 bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Earn B-Coins for Free</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">An alternative to subscriptions.</p>
                    </div>
                    <Button onClick={handleWatchAd} disabled={!canWatchAd()} className="bg-blue-500 hover:bg-blue-600 whitespace-nowrap">
                        Watch Ad ({5 - adViews} left)
                    </Button>
                </CardHeader>
            </Card>
        </div>
    </div>
  );
};

export default EarnCoins;
