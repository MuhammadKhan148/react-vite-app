import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getTypeColor } from '../utils/colors';

interface TypeRelations {
  damage_relations: {
    double_damage_from: Array<{ name: string; url: string }>;
    double_damage_to: Array<{ name: string; url: string }>;
    half_damage_from: Array<{ name: string; url: string }>;
    half_damage_to: Array<{ name: string; url: string }>;
    no_damage_from: Array<{ name: string; url: string }>;
    no_damage_to: Array<{ name: string; url: string }>;
  };
}

export function TypeChart() {
  const { data: types, isLoading, isError } = useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      const typesList = response.data.results.filter((type: { name: string }) => 
        type.name !== 'unknown' && type.name !== 'shadow'
      );
      
      const typeDetails = await Promise.all(
        typesList.map(async (type: { url: string }) => {
          const detail = await axios.get(type.url);
          return detail.data;
        })
      );
      
      return typeDetails;
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
        Error loading type data. Please try again later.
      </div>
    );
  }

  const getEffectivenessClass = (effectiveness: number) => {
    switch (effectiveness) {
      case 2:
        return 'bg-green-500';
      case 0.5:
        return 'bg-orange-500';
      case 0:
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  const calculateEffectiveness = (attacker: TypeRelations, defender: string) => {
    if (attacker.damage_relations.double_damage_to.some(t => t.name === defender)) return 2;
    if (attacker.damage_relations.half_damage_to.some(t => t.name === defender)) return 0.5;
    if (attacker.damage_relations.no_damage_to.some(t => t.name === defender)) return 0;
    return 1;
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Type Effectiveness Chart</h1>
      <div className="inline-block min-w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50">Attack ↓ Defense →</th>
              {types.map((type: TypeRelations & { name: string }) => (
                <th
                  key={type.name}
                  className="p-2 border"
                  style={{ backgroundColor: getTypeColor(type.name) }}
                >
                  <span className="text-white capitalize">{type.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((attackerType: TypeRelations & { name: string }) => (
              <tr key={attackerType.name}>
                <th
                  className="p-2 border"
                  style={{ backgroundColor: getTypeColor(attackerType.name) }}
                >
                  <span className="text-white capitalize">{attackerType.name}</span>
                </th>
                {types.map((defenderType: TypeRelations & { name: string }) => {
                  const effectiveness = calculateEffectiveness(attackerType, defenderType.name);
                  return (
                    <td
                      key={`${attackerType.name}-${defenderType.name}`}
                      className={`p-2 border text-center ${getEffectivenessClass(
                        effectiveness
                      )}`}
                    >
                      <span className="text-white font-bold">
                        {effectiveness === 0
                          ? '0'
                          : effectiveness === 0.5
                          ? '½'
                          : effectiveness === 2
                          ? '2'
                          : '1'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Super Effective (2×)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Not Very Effective (½×)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>No Effect (0×)</span>
        </div>
      </div>
    </div>
  );
}