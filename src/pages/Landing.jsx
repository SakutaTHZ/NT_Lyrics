import Nav from "../components/common/Nav";
import cover from '../assets/images/cover_bg.png'

const Landing = () => {
  return (
    <>
      <div className="flex items-start w-screen h-screen justify-center">
        <Nav/>
        <div className="relative hero h-2/4 w-screen bg-red-100">
          <img src={cover} loading="lazy" className="sm:h-full md:w-full object-fill"/>
        </div>
      </div>
    </>
  );
};

export default Landing;
