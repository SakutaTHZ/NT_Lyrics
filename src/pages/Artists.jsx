import { Suspense, useState } from "react";
import Footer from "../components/common/Footer";
import useDebounce from "../components/hooks/useDebounce";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-screen h-screen overflow-hidden overflow-y-auto">
          <div className="relative flex flex-col w-screen min-h-screen pt-4 md:pt-16">
            <div className="flex flex-col gap-2 px-4 md:px-24">
              <p className="font-bold text-lg italic">Artists</p>

              <input
                type="text"
                placeholder="Search by Artist Name"
                className="border border-gray-300 rounded-md px-3 py-2 w-full h-[42px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Footer />
        </div>
      </Suspense>
    </>
  );
};

export default Artists;
