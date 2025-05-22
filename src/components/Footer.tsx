
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, Copyright } from "lucide-react";
import { useParking } from "@/context/parking";

const Footer = () => {
  const { theme } = useParking();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-10 px-4 border-t ${theme === "dark" ? "bg-slate-900 border-gray-800" : "bg-gray-100 border-gray-200"}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-red-400" : "text-red-900"}`}>ParkEase</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Modern parking management solutions for efficient vehicle tracking and space optimization.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook" className={`hover:text-primary ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className={`hover:text-primary ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className={`hover:text-primary ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className={`hover:text-primary ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-red-400" : "text-red-900"}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`text-sm hover:underline ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className={`text-sm hover:underline ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className={`text-sm hover:underline ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${theme === "dark" ? "text-red-400" : "text-red-900"}`}>Contact Us</h3>
            <div className="space-y-2">
              <div className={`flex items-center text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Phone size={18} className="mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className={`flex items-center text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <Mail size={18} className="mr-2" />
                <span>support@parkease.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={`mt-8 pt-4 border-t flex justify-center items-center text-sm ${theme === "dark" ? "border-gray-800 text-gray-400" : "border-gray-200 text-gray-500"}`}>
          <Copyright size={16} className="mr-1" />
          <span>{currentYear} ParkEase. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
