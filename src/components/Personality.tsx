import React, { useMemo } from 'react';

interface PersonalityProps {
  isEditing: boolean;
  introvertExtrovert: number;
  setIntrovertExtrovert: (value: number) => void;
  analyticalCreative: number;
  setAnalyticalCreative: (value: number) => void;
  loyalFickle: number;
  setLoyalFickle: (value: number) => void;
  passiveActive: number;
  setPassiveActive: (value: number) => void;
}

const Personality: React.FC<PersonalityProps> = ({ 
  isEditing,
  introvertExtrovert,
  setIntrovertExtrovert,
  analyticalCreative,
  setAnalyticalCreative,
  loyalFickle,
  setLoyalFickle,
  passiveActive,
  setPassiveActive 
}) => {

  const personalityType = useMemo(() => {
    let type = '';
    type += introvertExtrovert < 50 ? 'I' : 'E';
    type += analyticalCreative < 50 ? 'S' : 'N';
    type += loyalFickle < 50 ? 'F' : 'T';
    type += passiveActive < 50 ? 'P' : 'J';
    return type as keyof typeof personalityTypes;
  }, [introvertExtrovert, analyticalCreative, loyalFickle, passiveActive]);

  const personalityTypes = {
    ISTJ: 'Responsible, sincere, analytical, reserved, realistic, systematic. Hardworking and trustworthy with practical judgement.',
    ISFJ: 'Warm, considerate, gentle, responsible, pragmatic, thorough. Devoted caretakers who enjoy being helpful to others.',
    INFJ: 'Idealistic, organized, insightful, dependable, compassionate, gentle. Peace & cooperation.',
    INTJ: 'Innovative, independent, strategic, logical, reserved, insightful. Driven by original ideas to achieve improvements.',
    ISTP: 'Action-oriented, logical, analytical, spontaneous, reserved, independent. Enjoy adventure, skilled at understanding things.',
    ISFP: 'Gentle, sensitive, nurturing, helpful, flexible, realistic. Personal environment is beautiful & practical.',
    INFP: 'Sensitive, creative, idealistic, perceptive, caring, loyal. Harmony and growth, dreams and possibilities.',
    INTP: 'Intellectual, logical, precise, reserved, flexible, imaginative. Thinkers who enjoy speculation & creative problem solving.',
    ESTP: 'Outgoing, realistic, action-oriented, curious, versatile, spontaneous. Pragmatic problem solvers & negotiators.',
    ESFP: 'Playful, enthusiastic, friendly, spontaneous, tactful, flexible. Have common sense, enjoy helping people.',
    ENFP: 'Enthusiastic, creative, spontaneous, optimistic, supportive, playful. Inspiration, new projects, see potential.',
    ENTP: 'Inventive, enthusiastic, strategic, enterprising, inquisitive, versatile. Enjoy new ideas and challenges, value inspiration.',
    ESTJ: 'Efficient, outgoing, analytical, systematic, dependable, realistic. Like to run the show and get things done in an orderly fashion.',
    ESFJ: 'Friendly, outgoing, reliable, conscientious, organized, practical. Helpful and please others, enjoy being active and productive.',
    ENFJ: 'Caring, enthusiastic, idealistic, organized, diplomatic, responsible. Skilled communicators who value connection.',
    ENTJ: 'Strategic, logical, efficient, outgoing, ambitious, independent. Effective organizers of people and planners.',
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Personality</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-right">Introvert</span>
          <input
            type="range"
            min="0"
            max="100"
            value={introvertExtrovert}
            onChange={(e) => setIntrovertExtrovert(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={!isEditing}
          />
          <span>Extrovert</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-right">Analytical</span>
          <input
            type="range"
            min="0"
            max="100"
            value={analyticalCreative}
            onChange={(e) => setAnalyticalCreative(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={!isEditing}
          />
          <span>Creative</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-right">Loyal</span>
          <input
            type="range"
            min="0"
            max="100"
            value={loyalFickle}
            onChange={(e) => setLoyalFickle(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={!isEditing}
          />
          <span>Fickle</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <span className="text-right">Passive</span>
          <input
            type="range"
            min="0"
            max="100"
            value={passiveActive}
            onChange={(e) => setPassiveActive(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            disabled={!isEditing}
          />
          <span>Active</span>
        </div>
      </div>
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-bold text-center text-purple-400">{personalityType}</h3>
        <p className="text-gray-300 text-center mt-2">{personalityTypes[personalityType]}</p>
      </div>
    </div>
  );
};

export default Personality;
