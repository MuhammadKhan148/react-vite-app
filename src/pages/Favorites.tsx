import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Pokemon } from '../types/pokemon';
import { useFavorites } from '../store/favorites';
import { PokemonCard } from '../components/PokemonCard';

export function Favorites() {
  const { favorites } = useFavorites();

  const { data: pokemonList, isLoading, isError } = useQuery({
    queryKey: ['favorites', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      
      const pokemonDetails = await Promise.all(
        favorites.map(async (id) => {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          return response.data;
        })
      );
      
      return pokemonDetails;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading favorite Pokémon. Please try again later.
      </div>
    );
  }

  if (!pokemonList || pokemonList.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Favorite Pokémon Yet</h2>
        <p className="text-gray-600">
          Start adding Pokémon to your favorites by clicking the heart icon on any Pokémon card!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Favorite Pokémon</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pokemonList.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}