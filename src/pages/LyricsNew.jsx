import React, { Suspense } from "react";

const Footer = React.lazy(() => import("../components/common/Footer"));

const Lyrics = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
          <div className="flex justify-between px-4 md:px-24">
            <p className="font-bold text-lg italic">Song List</p>
          </div>
        </div>
      </div>
      <Footer />
    </Suspense>
  );
};

export default Lyrics;
