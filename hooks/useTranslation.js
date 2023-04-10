import { useCallback, useState } from "react";

export default function useTranslation() {
  const [translated, setTranslated] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");

  const translate = useCallback(async (content, from, to, proxy) => {
    setTranslating(true);

    const data = await fetch(
      `/api/translate?content=${encodeURIComponent(
        content
      )}&from=${from}&to=${to
        .filter(Boolean)
        .join(",")}&proxy=${encodeURIComponent(proxy)}`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .catch((err) => {
        return Promise.reject(err);
      });

    if (Array.isArray(data)) {
      setTranslated(data);
      setTranslating(false);
      setError("");
    }

    if (data?.error === "TooManyRequestsError") {
      setError(data?.error);
    }
  }, []);

  return {
    error,
    translating,
    translated,
    translate,
  };
}
