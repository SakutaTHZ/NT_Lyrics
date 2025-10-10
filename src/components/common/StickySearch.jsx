import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function StickySearch({ searchTerm, setSearchTerm, title }) {
  const headerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: [1] } // Fires when it leaves full view
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible spacer just above to detect stickiness */}
      <div ref={headerRef} className="h-0"></div>

      {/* Sticky Header */}
      <div className="sticky top-0 md:top-12 c-bg z-10 px-4 md:px-24 py-2 flex items-center justify-between transition-all duration-300">
        <input
          type="text"
          placeholder={title}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 border c-border rounded transition-all duration-300`}
        />

        {/* Back Arrow — fades in when stuck */}
        <Link
          to={"/"}
          className={`flex items-center gap-2 transition-all duration-300  c-text-primary ${
            isSticky
              ? "w-auto pl-2 opacity-100 translate-x-0"
              : "w-0 opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <BiArrowBack size={24} />
        </Link>
      </div>
    </>
  );
}

StickySearch.propTypes = {
  title: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
