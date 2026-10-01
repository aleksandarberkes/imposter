import { Chip } from "./Chip";
import type { Language } from "@/lib/language";

type Props = {
  value: Language;
  onChange: (next: Language) => void;
};

export function LanguageSwitch({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Chip active={value === "en"} onClick={() => onChange("en")}>
        🇬🇧 English
      </Chip>
      <Chip active={value === "sr"} onClick={() => onChange("sr")}>
        🇷🇸 Srpski
      </Chip>
    </div>
  );
}
