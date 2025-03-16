import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { useFavorites } from '../store/favorites';
import { getTypeColor } from '../utils/colors';

export function PokemonDetail() {
  const { id } = useParams();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(Number(id));

  const { data: pokemon, isLoading, isError } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.data as Pokemon;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="text-center text-red-500">
        Error loading Pokémon details. Please try again later.
      </div>
    );
  }

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to List
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="relative p-8">
          <button
            onClick={toggleFavorite}
            className="absolute top-8 right-8 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <Heart
              className={`w-6 h-6 ${
                favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={pokemon.name}
                className="w-full h-auto"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
                <span className="text-xl text-gray-500">
                  #{String(pokemon.id).padStart(3, '0')}
                </span>
              </div>

              <div className="flex gap-2 mb-6">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="px-4 py-1 rounded-full text-white"
                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Height</span>
                  <p className="text-lg font-semibold">{pokemon.height / 10}m</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Weight</span>
                  <p className="text-lg font-semibold">{pokemon.weight / 10}kg</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Abilities</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability.ability.name}
                      className="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
                    >
                      {ability.ability.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 capitalize">
                          {stat.stat.name}
                        </span>
                        <span className="font-semibold">{stat.base_stat}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{
                            width: `${(stat.base_stat / 255) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}