"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoanCalculator() {
  const [price, setPrice] = useState(20000);
  const [deposit, setDeposit] = useState(5000);
  const [rate, setRate] = useState(6.9);
  const [months, setMonths] = useState(48);

  const monthly = useMemo(() => {
    const principal = price - deposit;
    if (principal <= 0) return 0;
    const r = rate / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }, [price, deposit, rate, months]);

  const totalPayable = monthly * months + deposit;
  const totalInterest = totalPayable - price;

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Calculator */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calculator className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Finance Calculator
              </h2>
            </div>
            <p className="mt-2 text-muted-foreground">
              Get an estimate of your monthly payments
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm">Vehicle Price (£)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1"
                  min={0}
                />
              </div>
              <div>
                <Label className="text-sm">Deposit (£)</Label>
                <Input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="mt-1"
                  min={0}
                />
              </div>
              <div>
                <Label className="text-sm">Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-1"
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <Label className="text-sm">Term (months)</Label>
                <Input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="mt-1"
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Right: Result */}
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Estimated Monthly Payment
            </p>
            <p className="mt-2 text-5xl font-bold text-primary">
              £{monthly.toFixed(0)}
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">
                  £{(price - deposit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-medium">
                  £{totalInterest > 0 ? totalInterest.toFixed(0) : "0"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Total Payable</span>
                <span className="font-semibold">
                  £{totalPayable.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              </div>
            </div>

            <Button asChild className="mt-6 w-full">
              <Link href="/contact">Enquire About Finance</Link>
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              Representative example only. Rates may vary. Subject to status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
