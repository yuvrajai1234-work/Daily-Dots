
import { Button } from "@/components/ui/button";

const Inbox = () => {
  return (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <div className="bg-gray-900 p-2 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">PROGRESS</span>
              <span className="text-sm">0/8</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-1">
              <div className="bg-green-500 h-2.5 rounded-full w-0"></div>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Expires in: 14 Days
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Login</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <img src="/A coins.png" alt="Coin" className="w-8 h-8" />
                      <div>
                        <p className="text-sm">Coin</p>
                        <p className="text-xs">x5</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button className="bg-blue-500 hover:bg-blue-600">GO</Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Open the Pack</h2>
                  <p className="text-sm text-gray-400">Acquire 7 Captains Packs</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <img src="https://i.imgur.com/bWOfS9T.png" alt="Captains Base Pack" className="w-8 h-8" />
                      <div>
                        <p className="text-sm">Captains Base Pack</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img src="https://i.imgur.com/pRiVEeA.png" alt="Captains Pass Point" className="w-8 h-8" />
                      <div>
                        <p className="text-sm">Captains Pass Point</p>
                        <p className="text-xs">x100</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img src="https://i.imgur.com/sC9aG1s.png" alt="Captains Point" className="w-8 h-8" />
                      <div>
                        <p className="text-sm">Captains Point</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                <Button className="bg-blue-500 hover:bg-blue-600">GO</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">REWARDS</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="https://i.imgur.com/eZcRNL0.png" alt="Captain Power" className="w-12 h-12" />
                <div className="ml-4">
                  <p>CAPTAIN POWER</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="https://i.imgur.com/pRiVEeA.png" alt="Captains Pass Point" className="w-12 h-12" />
                <div className="ml-4">
                  <p>Captains Pass Point</p>
                  <p className="text-xs">x1,000</p>
                </div>
              </div>
              <div className="flex items-center">
                <img src="https://i.imgur.com/sC9aG1s.png" alt="Captains Point" className="w-12 h-12" />
                <div className="ml-4">
                  <p>Captains Point</p>
                  <p className="text-xs">x50</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600" disabled>CLAIM</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
