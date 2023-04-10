import Select from "@/components/Select";
import { langOptions } from "@/constants/common";
import useClipboard from "@/hooks/useClipboard";

export default function TranslationBox({
  id,
  selected,
  translated,
  onRemove,
  onLangChange,
}) {
  const [copied, copy] = useClipboard();

  return (
    <div className="border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="w-[250px]">
          <Select
            options={langOptions}
            selected={selected}
            onChange={(value) => onLangChange(id, value)}
          />
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={() => copy(translated)}
            className="flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 flex items-center px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="px-3 py-3 bg-white">
        <div>{translated}</div>
      </div>
    </div>
  );
}
