"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: ProductDetailsToolInvocation;
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Loading product details…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if ("error" in output) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const product = output;
  const [image, ...otherImages] = product.images;

  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-secondary">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 28rem, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </Link>

      {otherImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {otherImages.map((src, i) => (
            <div
              key={src}
              className="relative size-14 shrink-0 overflow-hidden rounded-md bg-secondary"
            >
              <Image
                src={src}
                alt={`${product.name} view ${i + 2}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>
          <span className="shrink-0 text-sm font-medium">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{product.description}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <Badge variant={product.inStock ? "outline" : "destructive"}>
            {!product.inStock
              ? "Out of stock"
              : product.lowStock
                ? `Only ${product.stock} left`
                : `${product.stock} in stock`}
          </Badge>
        </div>
      </div>
    </div>
  );
}
