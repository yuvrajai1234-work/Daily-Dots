import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  return (
    <div className="p-8 bg-black min-h-screen font-sans text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-gray-700 shadow-lg">
                <AvatarImage src="/placeholder.svg" alt="Jill Anderson" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-white">Jill Anderson</h1>
              <p className="text-red-500">UI Designer</p>
              <p className="mt-4 text-gray-400 italic">"I'm looking for a site that will simplify the planning of my business trips."</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4 text-white">
                <div className="flex justify-between">
                  <span className="font-semibold">Age:</span>
                  <span>26</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>Single</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Location:</span>
                  <span>Brooklyn</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Archetype:</span>
                  <span>Frequent Flyer</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="destructive">Organized</Badge>
                <Badge variant="destructive">Proactive</Badge>
                <Badge variant="destructive">Hardworking</Badge>
                <Badge variant="destructive">Punctual</Badge>
                <Badge variant="destructive">Resilient</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Jill is a Regional Director who travels 4-6 times each month for work. She has a specific region in which she travels, and she often visits the same cities and stays at the same hotel. She is frustrated by the fact that no matter how frequently she takes similar trips, she spends hours of her day booking travel. She expects her travel solutions to be as organized as she is.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Personality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Introvert</span>
                    <span>Extrovert</span>
                  </div>
                  <Slider defaultValue={[30]} max={100} step={1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Analytical</span>
                    <span>Creative</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Loyal</span>
                    <span>Fickle</span>
                  </div>
                  <Slider defaultValue={[20]} max={100} step={1} />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Passive</span>
                    <span>Active</span>
                  </div>
                  <Slider defaultValue={[60]} max={100} step={1} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Motivations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <Progress value={40} className="h-2 bg-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Combat</p>
                  <Progress value={80} className="h-2 bg-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Convenience</p>
                  <Progress value={90} className="h-2 bg-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Speed</p>
                  <Progress value={30} className="h-2 bg-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Loyalty/Miles</p>
                  <Progress value={60} className="h-2 bg-gray-700" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Frustrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Too much time spent booking - she's busy!</li>
                <li>Too many websites visited per trip</li>
                <li>Not terribly tech-savvy - doesn't like the process</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Favourite Brands</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-around flex-wrap gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" className="h-8 filter invert"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="h-8 filter invert"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-8"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="h-8 filter invert"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" alt="Zara" className="h-8 filter invert"/>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Find a simple, all-in-one travel booking solution.</li>
                  <li>Reduce time spent on travel planning.</li>
                  <li>Have a seamless and organized travel experience.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
