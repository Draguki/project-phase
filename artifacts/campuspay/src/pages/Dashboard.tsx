import { useState } from "react";
import { useWallet, TransactionCategory } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Wallet, LogOut, GraduationCap, Printer, Coffee, ArrowRightLeft,
  Clock, Sparkles, Plus, CreditCard, ShieldCheck, ArrowUpRight,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ACTION_CARDS = [
  { id: "fees", title: "Pay fees", description: "Semester dues", icon: GraduationCap, amount: 500, points: 10, category: "fees" as TransactionCategory },
  { id: "print", title: "Print lab", description: "Library printing", icon: Printer, amount: 20, points: 1, category: "print" as TransactionCategory },
  { id: "food", title: "Cafeteria", description: "Buy a meal", icon: Coffee, amount: 100, points: 5, category: "food" as TransactionCategory },
];

const PAYMENT_METHODS = [
  { name: "Mastercard", mark: <span className="inline-flex items-center" aria-label="Mastercard"><i className="h-5 w-5 rounded-full bg-[#eb001b]"/><i className="-ml-2 h-5 w-5 rounded-full bg-[#f79e1b]/90"/></span> },
  { name: "Visa", mark: <span className="text-lg font-black italic tracking-tight text-[#1a1f71]">VISA</span> },
  { name: "UPI", mark: <span className="text-sm font-extrabold tracking-tight text-[#5f259f]">UPI</span> },
  { name: "RuPay", mark: <span className="text-sm font-black italic text-[#097c57]">RuPay</span> },
];

export default function Dashboard() {
  const { username, balance, points, transactions, logout, transact } = useWallet();
  const [selectedAction, setSelectedAction] = useState<typeof ACTION_CARDS[number] | null>(null);
  const handleTransact = () => {
    if (!selectedAction) return;
    try {
      transact(selectedAction.amount, selectedAction.points, selectedAction.category, selectedAction.title);
      toast.success(`Payment successful · +${selectedAction.points} points`);
    } catch (e: any) {
      toast.error(e.message || "Transaction failed");
    }
    setSelectedAction(null);
  };
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fees": return <GraduationCap className="h-4 w-4" />;
      case "print": return <Printer className="h-4 w-4" />;
      case "food": return <Coffee className="h-4 w-4" />;
      default: return <ArrowRightLeft className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background"><Wallet className="h-5 w-5" /></span>CampusPay</a>
          <div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">{username}</span><span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold">{username?.charAt(0).toUpperCase()}</span><button aria-label="Sign out" onClick={logout} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><LogOut className="h-4 w-4" /></button></div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_330px] lg:gap-12 lg:py-12">
        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-end justify-between"><div><p className="text-sm text-muted-foreground">Your campus wallet</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Good to see you, {username}</h1></div><span className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:inline-flex">STUDENT ACCOUNT</span></div>
            <Card className="border-border bg-card shadow-sm"><CardContent className="flex flex-col gap-7 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8"><div><p className="text-sm text-muted-foreground">Available balance</p><p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{formatCurrency(balance)}</p><p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><Sparkles className="h-4 w-4" />{points} reward points</p></div><Button onClick={() => setSelectedAction(ACTION_CARDS[0])} className="h-11 gap-2 px-5"><Plus className="h-4 w-4" />Make a payment</Button></CardContent></Card>
          </section>

          <section><div className="mb-4"><h2 className="text-lg font-semibold tracking-tight">Quick pay</h2><p className="mt-1 text-sm text-muted-foreground">Common campus payments, ready when you are.</p></div><div className="grid gap-3 sm:grid-cols-3">{ACTION_CARDS.map((action, idx) => <motion.button key={action.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} onClick={() => setSelectedAction(action)} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/60"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground"><action.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-medium">{action.title}</span><span className="mt-0.5 block text-sm text-muted-foreground">{formatCurrency(action.amount)} · {action.description}</span></span><ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></motion.button>)}</div></section>

          <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold tracking-tight">Recent activity</h2><p className="mt-1 text-sm text-muted-foreground">Your latest campus transactions.</p></div><Button variant="ghost" size="sm" className="text-muted-foreground">View all</Button></div><div className="overflow-hidden rounded-xl border border-border bg-card">{transactions.length === 0 ? <div className="flex flex-col items-center px-6 py-12 text-center"><span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary"><Clock className="h-5 w-5 text-muted-foreground" /></span><p className="font-medium">Nothing here yet</p><p className="mt-1 text-sm text-muted-foreground">Your payments will show up here.</p></div> : transactions.map((txn) => <div key={txn.id} className="flex items-center justify-between border-b border-border px-4 py-4 last:border-0 sm:px-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">{getCategoryIcon(txn.category)}</span><div><p className="text-sm font-medium">{txn.merchant}</p><p className="mt-0.5 text-xs text-muted-foreground">{new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(txn.timestamp))}</p></div></div><div className="text-right"><p className="text-sm font-semibold">− {formatCurrency(txn.amount)}</p><p className="mt-0.5 text-xs text-muted-foreground">+{txn.points} pts</p></div></div>)}</div></section>
        </div>

        <aside className="space-y-5"><Card className="border-border shadow-sm"><CardContent className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Rewards</h2><p className="mt-0.5 text-sm text-muted-foreground">Free coffee</p></div><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background"><Coffee className="h-4 w-4" /></span></div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{Math.min(points, 100)} / 100 pts</span></div><Progress value={Math.min(points, 100)} className="h-2 bg-secondary" indicatorColor="bg-foreground" /><p className="mt-3 text-sm text-muted-foreground">{points >= 100 ? "Your reward is ready to claim." : `${100 - points} points to your next coffee.`}</p></CardContent></Card>

          <Card className="border-border shadow-sm"><CardContent className="p-5"><div className="mb-1 flex items-center gap-2"><CreditCard className="h-4 w-4" /><h2 className="font-semibold">Payment methods</h2></div><p className="mb-4 text-sm text-muted-foreground">Ways to pay on campus</p><div className="grid grid-cols-2 gap-2">{PAYMENT_METHODS.map((method) => <div key={method.name} className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background" aria-label={method.name}>{method.mark}</div>)}</div><div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/60 p-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><p className="text-xs leading-relaxed text-muted-foreground">Payment options shown for preview. Gateway processing is not connected.</p></div></CardContent></Card>

          <p className="px-1 text-xs leading-relaxed text-muted-foreground">CampusPay is a student wallet demo. Check with your campus for account and payment support.</p>
        </aside>
      </main>

      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}><DialogContent className="border-border bg-card sm:max-w-md"><DialogHeader><DialogTitle>Confirm payment</DialogTitle><DialogDescription>Review this campus payment before continuing.</DialogDescription></DialogHeader>{selectedAction && <div className="my-4 rounded-xl border border-border bg-background p-5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card"><selectedAction.icon className="h-5 w-5" /></span><div><p className="font-medium">{selectedAction.title}</p><p className="text-sm text-muted-foreground">{selectedAction.description}</p></div></div><div className="my-5 border-t border-border"/><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Total</span><span className="text-2xl font-semibold">{formatCurrency(selectedAction.amount)}</span></div><p className="mt-2 text-xs text-muted-foreground">Earn {selectedAction.points} reward points</p></div>}<DialogFooter className="gap-2"><Button variant="outline" onClick={() => setSelectedAction(null)}>Cancel</Button><Button onClick={handleTransact}>Confirm payment</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
