import { FaFacebook } from "react-icons/fa6";

const Footer = () => {
    return (
      <footer className="flex items-center justify-between bg-gray-900 mt-8 text-white  p-4 md:px-24 text-center">
        <p>© {new Date().getFullYear()} Developed by SakutaTHZ</p>
        <a 
          href="https://www.facebook.com/yourpage" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline"
        >
          <FaFacebook size={20}/>
        </a>
      </footer>
    );
  };
  
  export default Footer;
  