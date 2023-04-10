import { useEffect, useState, useRef } from "react";
import { langOptions } from "@/constants/common";
import Select from "@/components/Select";
import useTranslation from "@/hooks/useTranslation";
import TranslationBox from "@/components/TranslationBox";
import useDebounce from "@/hooks/useDebounce";

export default function Home() {
  const [content, setContent] = useState("");
  const debouncedContent = useDebounce(content, 500);

  const proxyRef = useRef(null);
  const [approvedProxy, setApprovedProxy] = useState("");
  const [chooseFrom, setChooseFrom] = useState("en");
  const [chooseTo, setChooseTo] = useState([]);
  const { translate, translating, translated, error } = useTranslation();

  useEffect(() => {
    if (
      !debouncedContent ||
      !chooseFrom ||
      !chooseTo?.filter((to) => to.to)?.length
    ) {
      return;
    }

    translate(
      debouncedContent,
      chooseFrom,
      chooseTo.map((to) => to.to),
      approvedProxy
    );
  }, [translate, debouncedContent, chooseFrom, chooseTo, approvedProxy]);

  const handleAdd = () => {
    setChooseTo((prev) => [...prev, { id: crypto.randomUUID(), to: "" }]);
  };

  const handleRemove = (id) => {
    setChooseTo((prev) => prev.filter((to) => to.id !== id));
  };

  const handleTranslatedLangChange = (id, value) => {
    const list = chooseTo.map((to) => ({
      ...to,
      to: to.id === id ? value : to.to,
    }));
    setChooseTo(list);
  };

  return (
    <div className="p-3 w-[500px]">
      <div className="mb-3">
        <div className="flex items-end">
          <div>
            <label
              htmlFor="proxy"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Proxy
            </label>
            <input
              type="text"
              id="proxy"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="54.39.182.185:80"
              ref={proxyRef}
            />
          </div>
          <button
            type="button"
            onClick={() => setApprovedProxy(proxyRef.current?.value || "")}
            className="text-white ml-2.5 h-[40px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 focus:outline-none"
          >
            Approve
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          If you see too many request error, you can use proxy to bypass it
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Go{" "}
          <a
            className="text-blue-500"
            href="https://free-proxy-list.net"
            target="_blank"
          >
            https://free-proxy-list.net
          </a>{" "}
          and use anonymous proxies with 'yes' in Google column.
        </p>
      </div>
      <div className="mb-3">
        <Select
          title="Choose language"
          options={langOptions}
          selected={chooseFrom}
          onChange={setChooseFrom}
        />
      </div>
      <div className="mb-4 border border-gray-200 bg-gray-50">
        <div className="px-3 py-3 bg-white">
          <label htmlFor="content" className="sr-only">
            Input your content
          </label>
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            id="content"
            rows="4"
            className="w-full px-0 focus-visible:outline-0 text-sm text-gray-900 bg-white border-0 focus:ring-0"
            placeholder="Input your content..."
            required
          />
        </div>
      </div>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-900">
          Translate to
        </label>
        <button
          type="button"
          disabled={translating}
          onClick={handleAdd}
          className="disabled:opacity-50 ml-2 flex items-center text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-3 py-2 text-center inline-flex items-center"
        >
          + Add new
        </button>
      </div>
      {chooseTo.map((to) => (
        <div key={to.id} className="mb-3">
          <TranslationBox
            id={to.id}
            selected={to.to}
            translated={
              translated?.find((tran) => tran.to === to.to)?.text || ""
            }
            onRemove={() => handleRemove(to.id)}
            onLangChange={handleTranslatedLangChange}
          />
        </div>
      ))}
      {error && (
        <p class="mt-2 text-sm text-red-600">
          {error}: Please use proxy to bypass it
        </p>
      )}
    </div>
  );
}
