import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    // Use hard redirect to ensure all state is cleared and user is sent to landing page
    window.location.replace('/');
  };

  // Handler for the signup button: always go to login/signup page
  const handleSignupClick = () => {
    setIsOpen(false);
    navigate('/auth');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gospel-gold p-2 rounded-full">
                <img src="/src/wakilisha-logo.jpeg" alt="Wakilisha Gospel Band Logo" className="h-10 w-10 object-contain rounded-full" />
              </div>
              <span className="text-xl font-bold text-gospel-navy">Wakilisha Gospel Band</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-gospel-gold bg-gospel-cream'
                    : 'text-gospel-navy hover:text-gospel-gold hover:bg-gospel-cream'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Button 
                  onClick={handleSignupClick}
                  className="bg-gospel-gold hover:bg-gospel-light-gold text-white"
                >
                  Join Our Ministry
                </Button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gospel-navy hover:text-gospel-gold">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="flex items-center space-x-2 pb-6 border-b">
                    <div className="bg-gospel-gold p-2 rounded-full">
                      <Music className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gospel-navy">Wakilisha Gospel</span>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 py-6">
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={handleNavClick}
                          className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'text-gospel-gold bg-gospel-cream'
                              : 'text-gospel-navy hover:text-gospel-gold hover:bg-gospel-cream'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Auth Section */}
                  <div className="border-t pt-6">
                    {user ? (
                      <div className="space-y-3">
                        <Link
                          to="/dashboard"
                          onClick={handleNavClick}
                          className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gospel-navy hover:text-gospel-gold hover:bg-gospel-cream transition-colors"
                        >
                          <User className="h-5 w-5 mr-3" />
                          Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={handleNavClick}
                            className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-purple-500 hover:bg-purple-50 transition-colors"
                          >
                            <Shield className="h-5 w-5 mr-3" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Sign Out
                        </button>
                        <Button 
                          onClick={handleSignupClick}
                          className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white"
                        >
                          Join Our Ministry
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
