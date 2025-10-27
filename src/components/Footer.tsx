
import { Link } from "react-router-dom";
import { 
  Facebook, Instagram, Linkedin, Twitter, Mail, Phone, 
  Copyright, MapPin, Clock, Shield, HelpCircle, ArrowRight,
  MessageSquare, Calendar, CreditCard, Settings, Users, Zap
} from "lucide-react";
import { useParking } from "@/context/parking";

const Footer = () => {
  const { theme } = useParking();
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Features', path: '/#features' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/support' },
    { name: 'Documentation', path: '/docs' },
    { name: 'API Status', path: '/status' },
    { name: 'Guides', path: '/guides' },
    { name: 'Community', path: '/community' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Press', path: '/press' },
    { name: 'Partners', path: '/partners' },
  ];

  const contactInfo = [
    { icon: <MapPin size={16} className="mr-2" />, text: '123 Parking Ave, City, Country' },
    { icon: <Phone size={16} className="mr-2" />, text: '+1 (555) 123-4567' },
    { icon: <Mail size={16} className="mr-2" />, text: 'support@parkease.com' },
    { icon: <Clock size={16} className="mr-2" />, text: 'Mon - Fri: 9:00 - 18:00' },
  ];

  const features = [
    { icon: <Shield size={16} className="mr-2" />, text: 'Secure Payments' },
    { icon: <Zap size={16} className="mr-2" />, text: 'Fast Check-in' },
    { icon: <CreditCard size={16} className="mr-2" />, text: 'Multiple Payment Options' },
    { icon: <Settings size={16} className="mr-2" />, text: 'Easy Management' },
  ];
  
  return (
    <footer className={`${theme === "dark" ? "bg-slate-900 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${theme === "dark" ? "text-red-400" : "text-red-700"}`}>
                ParkEase
              </span>
            </div>
            <p className="text-sm">
              Revolutionizing parking management with cutting-edge technology for businesses and individuals alike.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <Facebook size={18} />, label: 'Facebook', url: 'https://facebook.com' },
                { icon: <Twitter size={18} />, label: 'Twitter', url: 'https://twitter.com' },
                { icon: <Instagram size={18} />, label: 'Instagram', url: 'https://instagram.com' },
                { icon: <Linkedin size={18} />, label: 'LinkedIn', url: 'https://linkedin.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`flex items-center text-sm hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`flex items-center text-sm hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <HelpCircle size={14} className="mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mt-0.5">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 py-6 mt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              {feature.icon}
              <span className="text-sm ml-2">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 mt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm mb-4 md:mb-0">
              <Copyright size={14} className="mr-1" />
              <span>{currentYear} ParkEase. All rights reserved. Made by </span>
              <a 
                href="https://github.com/gaithom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 font-medium hover:underline text-blue-500 hover:text-blue-600"
              >
                Michael Gaitho
              </a>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className={`hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Privacy Policy
              </Link>
              <Link to="/terms" className={`hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Terms of Service
              </Link>
              <Link to="/cookies" className={`hover:underline ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
