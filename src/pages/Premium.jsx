import { Suspense } from "react";

const Premium = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto text-gray-800">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          <div className="premium-page">
            <h1>Premium Features</h1>
            <p>Upgrade to Premium for exclusive features and benefits!</p>
            {/* Add more content related to premium features here */}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Premium;
