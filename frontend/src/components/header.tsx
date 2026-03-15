"use client";

import { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/authModal";

interface SectionRefs {
  [key: string]: RefObject<HTMLDivElement | null>;
}

interface HeaderProps {
  className?: string;
  sectionRefs: SectionRefs;
}

const Header = ({ className, sectionRefs }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auth context
  const { user, logout, isAdmin } = useAuth();

  // Track mount state to prevent SSR hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add scroll event listener for header background
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Determine active section
      const scrollPosition = window.scrollY + 100; // Offset for header height

      // Check each section's position
      Object.entries(sectionRefs).forEach(([id, ref]) => {
        if (ref.current) {
          const element = ref.current;
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, isMounted, sectionRefs]);

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    // Get the ref for the section
    const ref = sectionRefs[sectionId];

    if (ref && ref.current) {
      // Additional safety check to ensure we have a real DOM element
      const element = ref.current;
      
      // Check if it's actually a DOM element with scrollIntoView method
      if (element && typeof element.scrollIntoView === 'function') {
        // Scroll to the element
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update URL without page reload
        window.history.pushState(null, "", `#${sectionId}`);
      } else {
        // Fallback: try to find the element by ID
        const fallbackElement = document.getElementById(sectionId);
        if (fallbackElement && typeof fallbackElement.scrollIntoView === 'function') {
          fallbackElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.pushState(null, "", `#${sectionId}`);
        } else {
          console.warn(`Could not scroll to section: ${sectionId}. Element or scrollIntoView method not found.`);
        }
      }
    } else {
      // Fallback: try to find the element by ID
      const fallbackElement = document.getElementById(sectionId);
      if (fallbackElement && typeof fallbackElement.scrollIntoView === 'function') {
        fallbackElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.history.pushState(null, "", `#${sectionId}`);
      } else {
        console.warn(`Could not scroll to section: ${sectionId}. Ref or element not found.`);
      }
    }
  };

  // Auth modal handlers
  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    // Add toast notification here
    // Optionally close the mobile menu
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    // Optionally close the auth modal
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
    // Optionally redirect to home page
  };

  // Navigation links
  const navLinks = [
    { href: "home", label: "Accueil" },
    { href: "event", label: "Programme" },
    { href: "rsvp", label: "RSVP" },
    { href: "gallery", label: "Galerie" },
    { href: "location", label: "Localisation" },
    // { href: "login", label: "Connexion" },
    // { href: "gifts", label: "Cadeaux" },
  ];

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 sm:py-4 px-4 md:px-8 w-full flex justify-center items-center z-50 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-md"
            : "bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm",
          className
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='w-full max-w-7xl flex justify-between items-center'>
          <motion.div
            className='flex items-center space-x-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className='relative'>
              <Link
                href='/'
                className='flex items-center space-x-2 hover:opacity-80 transition-opacity'
                aria-label='Go to home page'
              >
                <Image
                  src='/media/logo-mns.png'
                  alt='Logo'
                  width={40}
                  height={40}
                  className='h-24 w-auto transform transition-transform duration-300 hover:scale-105'
                  priority
                  unoptimized={true} // Required for static export compatibility
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    console.error("Logo image failed to load");
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite error loop

                    // Create a fallback element in place of the image
                    const parent = target.parentElement;
                    if (parent) {
                      // Hide the broken image
                      target.style.display = "none";

                      // Add text fallback if parent exists
                      const fallback = document.createElement("div");
                      fallback.className =
                        "h-24 w-24 flex items-center justify-center bg-gradient-to-br from-royal-300 to-royal-600 rounded-full";
                      fallback.innerHTML =
                        '<span class="text-white font-serif text-2xl">M&S</span>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
                <span className='absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></span>
              </Link>
            </div>
            {/* <span className="hidden md:block font-serif gradient-text text-xl italic tracking-wide pl-4">Marie-Nella & Sidney</span> */}
          </motion.div>

          {/* Mobile Login/Admin Buttons */}
          <motion.div
            className='md:hidden flex items-center mr-2'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {user ? (
              isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href='/admin'>
                    <motion.button
                      className='admin-button-mobile bg-gradient-to-r from-royal-600 to-royal-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 active:scale-95'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      aria-label='Admin Dashboard'
                    >
                      <LayoutDashboard className='h-5 w-5' />
                      <span className='text-xs font-medium hidden sm:block'>Admin</span>
                    </motion.button>
                  </Link>
                </motion.div>
              )
            ) : (
              <motion.button
                onClick={openAuthModal}
                className='admin-button-mobile bg-gradient-to-r from-gold-500 to-gold-400 text-white px-3 py-2 rounded-lg shadow-lg flex items-center justify-center space-x-2 hover:shadow-xl transition-all duration-300 active:scale-95'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                aria-label='Login'
              >
                <User className='h-5 w-5' />
                <span className='text-xs font-medium hidden sm:block'>Login</span>
              </motion.button>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className='hidden md:flex space-x-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "text-foreground hover:text-gold-500 transition-all duration-300 font-serif text-xl italic tracking-wide relative group",
                  activeSection === link.href ? "text-gold-500" : ""
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300",
                    activeSection === link.href
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  )}
                ></span>
                <span className='absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></span>
              </button>
            ))}

            {/* Auth Button - Desktop */}
            {user ? (
              <div className='flex items-center space-x-4'>
                <span className='text-foreground font-serif italic text-sm'>
                  {user.name}
                </span>
                {isAdmin && (
                  <Link
                    href='/admin'
                    className='admin-button-desktop text-royal-600 hover:text-gold-500 transition-all duration-300 font-serif text-lg italic tracking-wide relative group flex items-center space-x-2'
                    aria-label='Admin Dashboard'
                  >
                    <LayoutDashboard className='h-5 w-5' />
                    <span className='hidden lg:block'>Admin</span>
                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full'></span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className='text-gold-500 hover:text-gold-600 transition-all duration-300 font-serif text-xl italic tracking-wide relative group'
                >
                  <LogOut className='h-5 w-5' />
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full'></span>
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className='text-foreground hover:text-gold-500 transition-all duration-300 font-serif text-xl italic tracking-wide relative group'
              >
                Login
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full'></span>
                <span className='absolute -bottom-1 left-0 w-full h-0.5 bg-gold-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></span>
              </button>
            )}
          </motion.nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            className='md:hidden bg-royal-400/10 flex flex-col justify-center items-center space-y-1.5 p-3 rounded-full shadow-lg hover:bg-royal-400/20 transition-colors duration-300'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label='Toggle menu'
            aria-expanded={mobileMenuOpen}
          >
            {/* <motion.span 
              className="w-8 h-0.5 bg-royal-800"
              animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }}
            />
            <motion.span 
              className="w-8 h-0.5 bg-royal-800"
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="w-8 h-0.5 bg-royal-800"
              animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }}
            /> */}
            <motion.svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              initial={false}
              animate={mobileMenuOpen ? "open" : "closed"}
              variants={{
                open: {
                  rotate: 45,
                  y: 6,
                },
                closed: {
                  rotate: 0,
                  y: 0,
                },
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
                initial={false}
                animate={mobileMenuOpen ? "open" : "closed"}
                variants={{
                  open: {
                    d: "M4 6h16M4 12h4",
                  },
                  closed: {
                    d: "M4 6h16M4 12h16M4 18h16",
                  },
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.svg>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className='fixed inset-0 top-[72px] bg-white/80 backdrop-blur-md z-40 flex flex-col items-center pt-8'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex flex-col items-center space-y-4 w-full max-w-xs mx-auto'>
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "relative w-full py-4 px-6 rounded-xl font-serif text-xl italic transition-all duration-300 overflow-hidden",
                      activeSection === link.href
                        ? "text-white shadow-md shadow-gold-500/20"
                        : "text-foreground hover:text-royal-900"
                    )}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{
                      delay: 0.05 * index,
                      duration: 0.3,
                      exit: { delay: 0 },
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background */}
                    <motion.span
                      className={cn(
                        "absolute inset-0 rounded-xl",
                        activeSection === link.href
                          ? "bg-gradient-to-r from-gold-500 to-gold-400"
                          : "bg-white/80 hover:bg-gold-100"
                      )}
                      layoutId={`mobile-nav-bg-${link.href}`}
                    />

                    {/* Text */}
                    <span className='relative z-10'>{link.label}</span>

                    {/* Decorative element */}
                    {activeSection === link.href && (
                      <motion.span
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-white'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}

                    {/* Subtle shine effect */}
                    <motion.span
                      className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full'
                      animate={
                        activeSection === link.href
                          ? {
                              translateX: ["100%", "-100%"],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  </motion.button>
                ))}

                {/* Auth Button - Mobile */}
                {user ? (
                  <motion.div
                    className='w-full pt-4 border-t border-gold-200/30'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div className='flex flex-col items-center space-y-3'>
                      <span className='text-sm text-muted-foreground'>
                        Signed in as{" "}
                        <span className='font-medium text-gold-500'>
                          {user.name}
                        </span>
                      </span>
                      {isAdmin && (
                        <Link href='/admin'>
                          <motion.button
                            className='mobile-menu-admin-button relative w-full py-4 px-6 rounded-xl font-serif text-lg italic transition-all duration-300 overflow-hidden mb-2 border border-royal-200/30'
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label='Admin Dashboard'
                          >
                            <motion.span className='absolute inset-0 rounded-xl bg-gradient-to-r from-royal-500/10 to-royal-400/10 hover:from-royal-500/20 hover:to-royal-400/20 transition-all duration-300' />
                            <span className='relative z-10 flex items-center justify-center text-royal-700'>
                              <LayoutDashboard className='mr-3 h-5 w-5' />
                              Admin Dashboard
                            </span>
                          </motion.button>
                        </Link>
                      )}
                      <motion.button
                        onClick={handleLogout}
                        className='relative w-full py-3 px-6 rounded-xl font-serif text-lg italic transition-all duration-300 overflow-hidden'
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.span className='absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500/20 to-gold-400/20' />
                        <span className='relative z-10 flex items-center justify-center'>
                          <LogOut className='mr-2 h-4 w-4' />
                          Logout
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={openAuthModal}
                    className='relative w-full py-4 px-6 rounded-xl font-serif text-xl italic transition-all duration-300 overflow-hidden mt-4 border-t border-gold-200/30 pt-6'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span className='absolute inset-0 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400' />
                    <span className='relative z-10 text-white flex items-center justify-center'>
                      <User className='mr-2 h-4 w-4' />
                      Login
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
};

export default Header;
