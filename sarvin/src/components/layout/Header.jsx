import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  Phone, 
} from "lucide-react";
import Button from "../ui/Button";
import DevelopmentBanner from "../DevelopmentBanner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledNavOpen, setIsScrolledNavOpen] = useState(false); // For scrolled desktop menu
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuBreakpoint, setIsMobileMenuBreakpoint] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const menuCloseTimeoutRef = useRef(null);

  const { cart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const scrolledNavRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleScrolledNav = () => setIsScrolledNavOpen(!isScrolledNavOpen);

  const handleProfileMenuEnter = () => {
    clearTimeout(menuCloseTimeoutRef.current);
    setIsProfileMenuOpen(true);
  };

  const handleProfileMenuLeave = () => {
    menuCloseTimeoutRef.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 200);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileMenuBreakpoint(window.innerWidth < 1024); // Adjusted breakpoint for new layout
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY <= 50) {
        setIsScrolledNavOpen(false); // Close scrolled nav when returning to top
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setActiveDropdown(null);
    setIsScrolledNavOpen(false);
  }, [location]);

  // Handle clicking outside of menus to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        isScrolledNavOpen &&
        scrolledNavRef.current &&
        !scrolledNavRef.current.contains(event.target)
      ) {
        setIsScrolledNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen, isScrolledNavOpen]);

  // Navigation menu data
  const cookingAppliancesMenu = {
    types: [
      {
        name: "Stainless Steel Gas Stove",
        path: "/products?type=Stainless+Steel+Gas+Stove",
      },
      { name: "Glass Gas Stove", path: "/products?type=Glass+Gas+Stove" },
    ],
    burners: [
      { name: "1 Burner", path: "/products?burners=1" },
      { name: "2 Burner", path: "/products?burners=2" },
      { name: "3 Burner", path: "/products?burners=3" },
      { name: "4 Burner", path: "/products?burners=4" },
    ],
    images: [
      {
        name: "Glass Gas Stove",
        path: "/products?type=Glass+Gas+Stove",
        src: "/assets/Header/Cooking_Appliances_H.png",
        alt: "Glass cooktop stove",
      },
      {
        name: "Stainless Steel",
        path: "/products?type=Stainless+Steel+Gas+Stove",
        src: "/assets/Header/Cooking_Appliances_H1.png",
        alt: "Stainless steel gas stove",
      },
    ],
  };

  const smallAppliancesMenu = {
    types: [
      { name: "Mixer Grinder", path: "/products?type=Mixer+Grinder" },
      { name: "Hand Blender", path: "/products?type=Hand+Blender" },
    ],
    images: [
      {
        name: "Mixer Grinders",
        path: "/products?type=Mixer+Grinder",
        src: "/assets/Header/small_Appliances_H.png",
        alt: "A modern mixer grinder",
      },
      {
        name: "Hand Blenders",
        path: "/products?type=Hand+Blender",
        src: "/assets/Header/small_Appliances_H1.png",
        alt: "A centrifugal juicer",
      },
    ],
  };

  const DesktopNavLinks = () => (
    <ul className="flex items-center justify-center space-x-6 xl:space-x-8">
      <li>
        <Link to="/" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">
          Home
        </Link>
      </li>
      <li>
        <Link to="/products" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">
          All Products
        </Link>
      </li>
      <li className="relative group">
        <Link to="/products/cooking-appliances" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a] flex items-center">
          Cooking Appliances
          <ChevronDown className="ml-1 h-3 w-3 relative top-[3px]" />
        </Link>
        <div className="absolute left-[-6rem] top-full mt-2 bg-white shadow-lg  p-6 z-50 transition-all duration-300 transform opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2" style={{ minWidth: "800px" }}>
          <div className="flex justify-between items-start space-x-8">
            <div className="flex space-x-12">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-[#01364a]">Type</h4>
                <ul className="space-y-1.5 mt-2">
                  {cookingAppliancesMenu.types.map((item) => (
                    <li key={item.name}><Link to={item.path} className="block text-sm text-gray-600 hover:text-[#C87941]">{item.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-[#01364a]">Burner Type</h4>
                <ul className="space-y-1.5 mt-2">
                  {cookingAppliancesMenu.burners.map((item) => (
                    <li key={item.name}><Link to={item.path} className="block text-sm text-gray-600 hover:text-[#C87941]">{item.name}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex space-x-6 pl-8 border-l border-gray-200">
              {cookingAppliancesMenu.images.map((image) => (
                <Link to={image.path} key={image.name} className="block text-center hover:opacity-90 transition-opacity">
                  <div className="w-44 h-44 flex items-center justify-center  overflow-hidden">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 mt-2">{image.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </li>
      <li className="relative group">
        <Link to="/products/small-appliances" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a] flex items-center">
          Small Appliances <ChevronDown className="ml-1 h-3 w-3 relative top-[3px]" />
        </Link>
        <div className="absolute left-[-6rem] top-full mt-2 bg-white shadow-lg  p-6 z-50 transition-all duration-300 transform opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2" style={{ minWidth: "600px" }}>
          <div className="flex justify-between items-start space-x-8">
            <div>
              <h4 className="font-semibold text-sm mb-2 text-[#01364a]">Types</h4>
              <ul className="space-y-1.5 mt-2">
                {smallAppliancesMenu.types.map((item) => (
                  <li key={item.name}><Link to={item.path} className="block text-sm text-gray-600 hover:text-[#C87941]">{item.name}</Link></li>
                ))}
              </ul>
            </div>
            <div className="flex space-x-6 pl-8 border-l border-gray-200">
              {smallAppliancesMenu.images.map((image) => (
                <Link to={image.path} key={image.name} className="block text-center hover:opacity-90 transition-opacity">
                  <div className="w-44 h-44 flex items-center justify-center  overflow-hidden">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-medium text-[#01364a] mt-2">{image.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </li>
      <li><Link to="/products?filter=new" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">New Arrivals</Link></li>
      <li><Link to="/products?filter=featured" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">Featured Products</Link></li>
      <li><Link to="/about" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">About</Link></li>
      <li><Link to="/contact" className="text-sm font-medium transition-colors hover:text-[#C87941] text-[#01364a]">Contact</Link></li>
    </ul>
  );

  return (
    <header className="fixed top-0 z-50 w-full bg-white  transition-all duration-300">
      {/* <DevelopmentBanner /> */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Top Bar (Logo, Search, Icons) --- */}
       {/* --- Top Bar (Logo, Search, Icons) --- */}
        <div className="flex items-center justify-between py-2">

          {/* === LEFT SECTION: Mobile Menu & Logo / Desktop Logo & Scrolled Nav === */}
          <div className="flex justify-start items-center lg:w-auto">
             {/* Mobile Menu Toggle */}
             <button className="lg:hidden p-2 -ml-2 text-[#01364a]" onClick={toggleMenu} aria-label="Open mobile menu">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-11" />}
             </button>
             {/* MOBILE LOGO MOVED HERE */}
             <Link to="/" className="lg:hidden flex items-center flex-shrink-0">
                <img src="/sarvinindia.jpeg" alt="Sarvin" className="h-12 w-auto object-contain" style={{ maxWidth: "130px" }} />
             </Link>
             {/* Desktop Left Content */}
             <div className="hidden lg:flex items-center space-x-4">
                {isScrolled && (
                    <button onClick={toggleScrolledNav} className="p-2 -ml-2  hover:bg-gray-100" aria-label="Open navigation menu">
                        {isScrolledNavOpen ? <X className="h-6 w-6 text-[#01364a]" /> : <Menu className="h-6 w-6 text-[#01364a]" />}
                    </button>
                )}
                <Link to="/" className="flex items-center flex-shrink-0">
                    <img src="/sarvinindia.jpeg" alt="Sarvin" className="h-12 w-auto object-contain" style={{ maxWidth: "130px" }} />
                </Link>
             </div>
          </div>

          {/* === CENTER SECTION: Desktop Search (Mobile logo removed) === */}
          <div className="hidden lg:flex lg:flex-1 lg:px-8 lg:w-auto justify-center">
             {/* Desktop Search Bar */}
             <div className="w-full">
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 border border-gray-300  pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#01364a]"
                    />
                    <button type="submit" className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-[#01364a] hover:bg-opacity-90 " aria-label="Search">
                        <Search className="h-5 w-5 text-white" />
                    </button>
                </form>
             </div>
          </div>
          
          {/* === RIGHT SECTION: Icons & Desktop Contact === */}
          <div className="flex items-center justify-end space-x-2 md:space-x-4 lg:w-auto flex-1">
           <div className="hidden lg:block text-right">
  <p className="text-sm font-semibold text-[#01364a] whitespace-nowrap">
    <a href="tel:9310979906" className="flex items-center justify-end hover:underline">
      <Phone Width={3} className="h-3 w-3 mr-1 mt-1 " />
      <span>9310979906 (sales & service)</span>
    </a>
  </p>
  <p className="text-xs text-[#01374ae1]">Mon - Sat  | 9am - 6pm</p>
</div>
             
             <Link to="/cart" className="relative p-2 text-[#01364a] hover:text-[#C87941]" aria-label={`Cart with ${cart.items.length} items`}>
                <ShoppingCart className="h-6 w-6" />
                {cart.items.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C87941] text-xs font-bold text-white">
                        {cart.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                )}
             </Link>

             <div ref={profileMenuRef} className="relative profile-menu" onMouseEnter={handleProfileMenuEnter} onMouseLeave={handleProfileMenuLeave}>
                <button onClick={toggleProfileMenu} className="flex items-center p-2 text-[#01364a] hover:text-[#C87941]" aria-label="User account menu">
                    <User className="h-6 w-6" />
                    {/* {isAuthenticated && <ChevronDown className="h-4 w-4 ml-1" />} */}
                </button>
                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48  bg-white py-2 shadow-lg border border-gray-100 z-30">
                        {isAuthenticated ? (
                            <>
                                <div className="border-b border-gray-100 px-4 py-2">
                                    <p className="text-sm font-medium text-[#01364a] truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    {isAdmin && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#01364a] text-white mt-1">Admin</span>}
                                </div>
                                {isAdmin && <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Settings className="mr-2 h-4 w-4" />Admin Dashboard</Link>}
                                <Link to="/account" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="mr-2 h-4 w-4" />My Account</Link>
                                <Link to="/orders" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Package className="mr-2 h-4 w-4" />My Orders</Link>
                                <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><LogOut className="mr-2 h-4 w-4" />Sign out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign in</Link>
                                <Link to="/register" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Create account</Link>
                            </>
                        )}
                    </div>
                )}
             </div>
          </div>
        </div>

        {/* --- Bottom Nav Bar (Desktop, not scrolled) --- */}
        <div className={`hidden lg:block transition-all duration-300 ease-in-out ${isScrolled ? 'h-0 opacity-0 invisible' : 'opacity-100 visible translate-y-0 py-4'}`}>
          <DesktopNavLinks />
        </div>
      </div>

      {/* --- Scrolled Navigation Dropdown (Desktop) --- */}
      {!isMobileMenuBreakpoint && isScrolledNavOpen && (
        <div ref={scrolledNavRef} className="absolute top-full left-0 w-full bg-white shadow-lg ">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <DesktopNavLinks />
          </div>
        </div>
      )}

      {/* --- Mobile Menu (Original Logic, unchanged) --- */}
      {isMobileMenuBreakpoint && isMenuOpen && (
       <div className="mt-4">
             <form onSubmit={handleSearch} className="mb-4 flex items-center">
               <div className="relative w-full">
                 <input
                   type="text"
                   placeholder="Search products..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full  border border-gray-300 pl-3 pr-10 py-3 text-sm focus:border-[#C87941] focus:outline-none focus:ring-1 focus:ring-[#C87941]"
                 />
                 <button
                   type="submit"
                   className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-gray-500"
                 >
                   <Search className="h-4 w-4" />
                 </button>
               </div>
             </form>
             <ul className="divide-y divide-gray-100  bg-white border border-gray-200 max-h-fit overflow-y-auto">
               <li>
                 <Link
                   to="/"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   Home
                 </Link>
               </li>
               <li>
                 <Link
                   to="/products"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   All Products
                 </Link>
               </li>

               {/* Cooking Appliances Mobile Submenu */}
               <li className="relative">
                 <button
                   onClick={() =>
                     setActiveDropdown(
                       activeDropdown === "cooking-mobile"
                         ? null
                         : "cooking-mobile"
                     )
                   }
                   className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   Cooking Appliances{" "}
                   <ChevronDown
                     className={`h-4 w-4 transition-transform ${
                       activeDropdown === "cooking-mobile" ? "rotate-180" : ""
                     }`}
                   />
                 </button>
                 {activeDropdown === "cooking-mobile" && (
                   <div className="bg-gray-50 px-4 py-2">
                     <h4 className="font-semibold text-xs mb-2 text-gray-700">
                       Type
                     </h4>
                     <ul className="space-y-1 mb-3">
                       {cookingAppliancesMenu.types.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                             className="block text-sm text-gray-600 hover:text-[#C87941] pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                     <h4 className="font-semibold text-xs mb-2 text-gray-700">
                       Burner Type
                     </h4>
                     <ul className="space-y-1">
                       {cookingAppliancesMenu.burners.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                             className="block text-sm text-gray-600 hover:text-[#C87941] pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </li>

               {/* Small Appliances Mobile Submenu */}
               <li className="relative">
                 <button
                   onClick={() =>
                     setActiveDropdown(
                       activeDropdown === "small-mobile" ? null : "small-mobile"
                     )
                   }
                   className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   Small Appliances{" "}
                   <ChevronDown
                     className={`h-4 w-4 transition-transform ${
                       activeDropdown === "small-mobile" ? "rotate-180" : ""
                     }`}
                   />
                 </button>
                 {activeDropdown === "small-mobile" && (
                   <div className="bg-gray-50 px-4 py-2">
                     <h4 className="font-semibold text-xs mb-2 text-gray-700">
                       Types
                     </h4>
                     <ul className="space-y-1">
                       {smallAppliancesMenu.types.map((item) => (
                         <li key={item.name}>
                           <Link
                             to={item.path}
                             className="block text-sm text-gray-600 hover:text-[#C87941] pl-2 py-1"
                           >
                             {item.name}
                           </Link>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </li>

               <li>
                 <Link
                   to="/products?filter=featured"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   Featured Products
                 </Link>
               </li>
               <li>
                 <Link
                   to="/products?filter=new"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   New Arrivals
                 </Link>
               </li>
               <li>
                 <Link
                   to="/about"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   About
                 </Link>
               </li>
               <li>
                 <Link
                   to="/contact"
                   className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                 >
                   Contact
                 </Link>
               </li>
               {!isAuthenticated ? (
                 <li className="px-4 py-3">
                   <div className="flex flex-col space-y-2">
                     <Button
                       fullWidth
                       onClick={() => navigate("/login")}
                       variant="primary"
                     >
                       Sign In
                     </Button>
                     <Button
                       fullWidth
                       onClick={() => navigate("/register")}
                       variant="outline"
                     >
                       Create Account
                     </Button>
                   </div>
                 </li>
               ) : (
                 <li className="px-4 py-3">
                   <div className="flex flex-col space-y-2">
                     {isAdmin && (
                       <Button
                         fullWidth
                         onClick={() => navigate("/admin")}
                         variant="primary"
                       >
                         Admin Dashboard
                       </Button>
                     )}
                     <Button
                       fullWidth
                       onClick={() => navigate("/account")}
                       variant="outline"
                     >
                       My Account
                     </Button>
                     <Button
                       fullWidth
                       onClick={handleLogout}
                       variant="outline"
                       leftIcon={<LogOut className="h-4 w-4" />}
                     >
                       Sign Out
                     </Button>
                   </div>
                 </li>
               )}
             </ul>
           </div>
      )}
    </header>
  );
};

export default Header;