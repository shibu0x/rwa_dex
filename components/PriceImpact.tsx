"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

type PriceImpactProps = {
  entryPrice: number | null;
  notional: number;
  margin: string;
  leverage: number;
  marketName: string;
};

const TAKER_FEE_BPS = 5; // 0.05%
const MAINT_MARGIN_BPS = 500; // 5%

export const PriceImpact = ({
  entryPrice,
  notional,
  margin,
  leverage,
  marketName,
}: PriceImpactProps) => {
  if (!entryPrice || notional === 0) return null;

  const marginNum = Number(margin) || 0;

  const entryFeeUsd = (notional * TAKER_FEE_BPS) / 10000;
  const entryFeePercent = (TAKER_FEE_BPS / 100).toFixed(2);

  // For long: liqPrice ≈ entryPrice * (1 - (leverage - 1) / leverage + 0.05)
  // For short: liqPrice ≈ entryPrice * (1 + (leverage - 1) / leverage - 0.05)
  const maintMarginRatio = MAINT_MARGIN_BPS / 10000;
  const liqPriceMoveLong = -((leverage - maintMarginRatio * leverage) / leverage);
  const liqPriceMoveShort = ((leverage - maintMarginRatio * leverage) / leverage);

  const liquidationPriceLong = entryPrice * (1 + liqPriceMoveLong);
  const liquidationPriceShort = entryPrice * (1 + liqPriceMoveShort);

  const totalCostWithFees = marginNum + entryFeeUsd;
  const priceImpactPercent = ((entryFeeUsd / notional) * 100).toFixed(3);

  return (
    <Card className="p-4 space-y-3 bg-muted/30 border-dashed">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        <span className="font-semibold">Trade Impact</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Entry Fee ({entryFeePercent}%)</span>
          <span className="font-mono">${entryFeeUsd.toFixed(4)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Price Impact</span>
          <span className="font-mono text-amber-500">{priceImpactPercent}%</span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">Entry Price</span>
          <span className="font-mono">${entryPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Liq. Price (Long)</span>
          <span className="font-mono text-rose-400">
            ${liquidationPriceLong.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Liq. Price (Short)</span>
          <span className="font-mono text-rose-400">
            ${liquidationPriceShort.toFixed(2)}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total Cost (incl. fees)</span>
          <span className="font-mono">{totalCostWithFees.toFixed(4)} MNT</span>
        </div>
      </div>
    </Card>
  );
};
