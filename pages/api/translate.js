import { translate } from "@vitalets/google-translate-api";
import createHttpProxyAgent from "http-proxy-agent";

export default async function handler(req, res) {
  try {
    const { content, from, proxy } = req.query ?? {};
    const to = req.query?.to?.split(",")?.filter(Boolean);
    const agent = proxy ? createHttpProxyAgent(`http://${proxy}`) : false;
    if (Array.isArray(to)) {
      const translated = await Promise.all(
        to.map(
          async (toLang) =>
            await translate(content, {
              from,
              to: toLang,
              fetchOptions: { agent },
            })
        )
      );

      if (translated?.length > 0) {
        return res.status(200).json(
          translated.map((tran, index) => ({
            to: to[index],
            text: tran.text,
          }))
        );
      }
    }

    const { text } = await translate(content, {
      from,
      to,
      fetchOptions: { agent },
    });
    res.status(200).json([{ to, content: text }]);
  } catch (e) {
    if (e.name === "TooManyRequestsError") {
      res.status(400).json({ error: e.name });
    }
  }
}
