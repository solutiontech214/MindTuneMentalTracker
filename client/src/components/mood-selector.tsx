interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: 'terrible' | 'bad' | 'okay' | 'good' | 'great') => void;
}

const moods = [
  { value: 'terrible', emoji: '😢', color: 'from-red-100 to-red-200 hover:from-red-200 hover:to-red-300' },
  { value: 'bad', emoji: '😔', color: 'from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300' },
  { value: 'okay', emoji: '😐', color: 'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300' },
  { value: 'good', emoji: '😊', color: 'from-green-100 to-green-200 hover:from-green-200 hover:to-green-300' },
  { value: 'great', emoji: '😄', color: 'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300' },
] as const;

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-center space-x-4">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onMoodSelect(mood.value)}
          className={`mood-emoji w-16 h-16 bg-gradient-to-br ${mood.color} rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ease-out hover:scale-110 ${
            selectedMood === mood.value ? 'selected scale-120 ring-4 ring-[var(--mindtune-primary)]/30' : ''
          }`}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
}
