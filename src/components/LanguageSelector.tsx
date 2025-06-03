// src/components/LanguageSelector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
// L'import de Languages et useState n'est plus nécessaire si on affiche que le code.

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
  };

  return (
    <div className="relative">
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full border-thai-orange/30 focus:border-thai-orange">
          {/* Modification ici : Afficher uniquement le code de la langue en majuscules */}
          <div className="flex items-center justify-start w-full"> {/* Vous pouvez ajuster justify-start à justify-center si vous préférez le texte centré */}
            <span className="font-medium text-sm"> {/* Ajustez la taille/poids de la police si nécessaire */}
              {currentLanguage.code.toUpperCase()}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;