import { Link, useLocation } from 'react-router-dom';
import { Star, Grid, Swords, Search } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Search className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold">Pokédex</span>
          </Link>
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 ${
                isActive('/') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span>Pokémon</span>
            </Link>
            <Link
              to="/types"
              className={`flex items-center space-x-1 ${
                isActive('/types') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Swords className="w-5 h-5" />
              <span>Types</span>
            </Link>
            <Link
              to="/favorites"
              className={`flex items-center space-x-1 ${
                isActive('/favorites') ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}