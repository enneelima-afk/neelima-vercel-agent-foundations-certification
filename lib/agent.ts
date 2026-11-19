import {
  type InferAgentUIMessage,
  ToolLoopAgent,
  tool,
  type UIToolInvocation,
} from "ai";
import { z } from "zod";
import {
  getAllCategories,
  getProductDetails,
  returnOrder,
  searchProducts,
} from "@/lib/tools";

// Rendered as clickable buttons in the chat UI (see components/agent-chat.tsx).
export const suggestOptions = tool({
  description:
    "Show 2-5 short, clickable reply options (e.g. product names, categories, or next actions) so the user can choose instead of typing.",
  inputSchema: z.object({
    options: z
      .array(z.string().min(1).max(60))
      .min(2)
      .max(5)
      .describe("Short labels. Each label is sent back as the user's next message."),
  }),
  execute: async ({ options }) => ({ options }),
});

export const shoppingAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-5",
  instructions: `You are a friendly shopping assistant for Ship It Shop, focus on providing product catalog information, adding products to cart and do not provide credit card or ask for personal idenitifiable information. be polite in tone. When the user asks about products, availability, or recommendations, use the searchProducts tool to look up real catalog data before answering. When the user asks about a specific item (e.g. "tell me more about the black hoodie"), find its id with searchProducts if you don't have it, then call getProductDetails for the full description, price, images and live stock instead of relying on search results. The product card is shown to the user automatically, so don't repeat the image or full details in text; add only a short helpful summary. When asked about a type or category of product, use the getAllCategories tool to get valid categories before using searchProducts. When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333.

Typing is hard for users, so whenever you recommend products or offer choices (categories, next steps, quantities, yes/no), call the suggestOptions tool with 2-5 short labels instead of listing the options in text. Keep your text reply brief, do not repeat the options in text, and make each label a complete reply the user could send (e.g. "Show me the Vercel hoodie").`,
  tools: { searchProducts, getProductDetails, getAllCategories, returnOrder, suggestOptions },
});

export type ShoppingAgentUIMessage = InferAgentUIMessage<typeof shoppingAgent>;
export type SearchProductsToolInvocation = UIToolInvocation<typeof searchProducts>;
export type ProductDetailsToolInvocation = UIToolInvocation<typeof getProductDetails>;