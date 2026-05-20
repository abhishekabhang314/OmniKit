import { useState } from "react";
import api from "../lib/api";
import { Card } from "@/components/ui/card";
import {
  ToolInput,
  ToolButton,
  ToolResult,
  FieldGroup,
} from "@/components/ui-kit";
import { Progress } from "@/components/animate-ui/radix/Progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/animate-ui/radix/Accordion";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const calculate = async () => {
    if (!principal || !rate || !tenure) {
      setError("Please fill in all three fields.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/api/calculators/emi", {
        principal: parseFloat(principal),
        annual_rate: parseFloat(rate),
        tenure_months: parseInt(tenure),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const principalPct = result
    ? ((result.principal / result.total_payment) * 100).toFixed(1)
    : 0;
  const interestPct = result
    ? ((result.total_interest / result.total_payment) * 100).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup cols={3}>
        <ToolInput
          label="Loan Amount"
          id="emi-principal"
          type="number"
          prefix="₹"
          placeholder="500000"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <ToolInput
          label="Interest Rate"
          id="emi-rate"
          type="number"
          suffix="%"
          placeholder="8.5"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <ToolInput
          label="Tenure"
          id="emi-tenure"
          type="number"
          suffix="mo"
          placeholder="60"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />
      </FieldGroup>

      {error && <p className="text-[var(--color-error)] text-sm">{error}</p>}

      <ToolButton loading={loading} onClick={calculate}>
        Calculate EMI
      </ToolButton>

      <ToolResult
        visible={!!result}
        className="!p-0 border-none shadow-none bg-transparent flex flex-col gap-4"
      >
        {result && (
          <>
            {/* Hero EMI */}
            <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-center text-white">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/70 mb-2">
                Monthly EMI
              </div>
              <div className="font-mono text-4xl font-medium leading-none">
                {fmt(result.emi)}
              </div>
              <div className="text-[12px] text-white/60 mt-1.5">
                per month for {tenure} months
              </div>
            </div>

            {/* Stats */}
            <FieldGroup cols={2}>
              <Card className="p-4 bg-[var(--color-surface-raised)] border-none shadow-none">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-muted)] mb-1">
                  Total Payment
                </div>
                <div className="font-mono text-[20px] font-medium text-[var(--color-text-primary)]">
                  {fmt(result.total_payment)}
                </div>
              </Card>
              <Card className="p-4 bg-[var(--color-surface-raised)] border-none shadow-none">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--color-text-muted)] mb-1">
                  Total Interest
                </div>
                <div className="font-mono text-[20px] font-medium text-[var(--color-text-primary)]">
                  {fmt(result.total_interest)}
                </div>
              </Card>
            </FieldGroup>

            {/* Progress bar */}
            <Card className="p-5 border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]">
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-2 font-medium">
                <span>Principal — {principalPct}%</span>
                <span>Interest — {interestPct}%</span>
              </div>
              <Progress value={Number(principalPct)} />
            </Card>

            {/* Schedule */}
            <Accordion type="single" collapsible className="w-full mt-2">
              <AccordionItem
                value="schedule"
                className="border-[var(--color-border)] bg-[var(--color-surface)] rounded-[var(--radius-md)] border-[1.5px] px-4"
              >
                <AccordionTrigger>Show repayment schedule</AccordionTrigger>
                <AccordionContent>
                  <div className="schedule-table-wrap mt-2 !border-none">
                    <div className="schedule-table-scroll pr-1">
                      <table className="schedule-table">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>EMI</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.map((row) => (
                            <tr key={row.month}>
                              <td>{row.month}</td>
                              <td>{fmt(row.emi)}</td>
                              <td>{fmt(row.principal_paid)}</td>
                              <td>{fmt(row.interest_paid)}</td>
                              <td>{fmt(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </ToolResult>
    </div>
  );
}
