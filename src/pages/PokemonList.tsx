import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Pokemon } from '../types/pokemon';
import { PokemonCard } from '../components/PokemonCard';
import { SearchFilter } from '../components/SearchFilter';

export function PokemonList() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { ref, inView } = useInView();

  const fetchPokemon = async ({ pageParam = 0 }) => {
    const limit = 20;
    const offset = pageParam * limit;
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    
    const pokemonDetails = await Promise.all(
      response.data.results.map(async (pokemon: { url: string }) => {
        const detail = await axios.get(pokemon.url);
        return detail.data;
      })
    );

    return {
      pokemon: pokemonDetails,
      nextPage: offset + limit < response.data.count ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemon,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (inView && hasNextPage) {
    fetchNextPage();
  }

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
        Error loading Pokémon. Please try again later.
      </div>
    );
  }

  const allPokemon = data?.pages.flatMap((page) => page.pokemon) || [];
  const filteredPokemon = allPokemon.filter((pokemon: Pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      !selectedType ||
      pokemon.types.some((type) => type.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <SearchFilter
        search={search}
        selectedType={selectedType}
        onSearchChange={setSearch}
        onTypeChange={setSelectedType}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPokemon.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div ref={ref} className="h-20" />
    </div>
  );
}