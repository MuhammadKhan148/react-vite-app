import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { useFavorites } from '../store/favorites';
import { getTypeColor } from '../utils/colors';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <Link to={`/pokemon/${pokemon.id}`}>
        <div className="p-4">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            className="w-full h-48 object-contain"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
              <span className="text-gray-500">#{String(pokemon.id).padStart(3, '0')}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-2 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: getTypeColor(type.type.name) }}
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pokemon.stats.slice(0, 3).map((stat) => (
              <div key={stat.stat.name} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-20 capitalize">
                  {stat.stat.name}:
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-500 rounded"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  />
                </div>
                <span className="text-sm w-8">{stat.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <Heart
            className={`w-6 h-6 ${
              favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </Link>
    </motion.div>
  );
}