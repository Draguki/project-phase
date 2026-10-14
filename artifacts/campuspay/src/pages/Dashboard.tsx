import { useState } from "react";
import { useWallet, TransactionCategory } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Wallet, LogOut, GraduationCap, Printer, Coffee, ArrowRightLeft,
  Clock, Sparkles, Plus, CreditCard, ShieldCheck, ArrowUpRight,
  BookOpen, Brain, BookMarked,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { SiGithub, SiFigma, SiNotion, SiAutodesk } from "react-icons/si";
import { ThemeToggle } from "@/components/ThemeToggle";

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

const CAMPUS_REWARDS = [
  { id: "print-credit", title: "Study print pack", detail: "25 pages for notes and assignments", points: 25, icon: Printer, partner: "Library print desk" },
  { id: "workshop-pass", title: "Skills workshop pass", detail: "One campus career or study-skills workshop", points: 75, icon: BookOpen, partner: "Student learning centre" },
  { id: "tutoring-session", title: "Peer tutoring session", detail: "A 30-minute subject support session", points: 100, icon: Brain, partner: "Peer tutoring hub" },
  { id: "bookstore-credit", title: "Campus bookstore credit", detail: "A learning-materials voucher worth $10", points: 150, icon: BookMarked, partner: "Campus bookstore" },
];

const STUDENT_OFFERS = [
  { name: "GitHub Education", benefit: "Student Developer Pack with developer tools, learning resources, and partner offers.", note: "Verified student account required", url: "https://education.github.com/pack", icon: SiGithub, color: "text-[#181717] dark:text-white" },
  { name: "Figma for Education", benefit: "Figma and FigJam education tools for student design and team projects.", note: "Student or educator verification required", url: "https://www.figma.com/education/", icon: SiFigma, color: "text-[#F24E1E]" },
  { name: "Notion Education Plan", benefit: "Free individual education plan for notes, coursework, projects, and collaboration.", note: "Eligible college email required", url: "https://www.notion.com/help/notion-for-education", icon: SiNotion, color: "text-foreground" },
  { name: "Autodesk Education", benefit: "Access to professional design software for learning and research.", note: "Eligible students · renewed annually", url: "https://www.autodesk.com/support/account/education/students-educators/overview", icon: SiAutodesk, color: "text-[#0696D7]" },
];

export default function Dashboard() {
  const { username, balance, points, transactions, redeemedRewards, logout, transact, claimReward } = useWallet();
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
  const handleClaimReward = (reward: typeof CAMPUS_REWARDS[number]) => {
    try {
      claimReward(reward.id, reward.points);
      toast.success(`${reward.title} claimed`, { description: "Show this claim at the listed campus partner desk." });
    } catch (e: any) {
      toast.error(e.message || "Could not claim this reward");
    }
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
          <div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">{username}</span><ThemeToggle /><span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold">{username?.charAt(0).toUpperCase()}</span><button aria-label="Sign out" onClick={logout} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><LogOut className="h-4 w-4" /></button></div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_330px] lg:gap-12 lg:py-12">
        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-end justify-between"><div><p className="text-sm text-muted-foreground">Your campus wallet</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Good to see you, {username}</h1></div><span className="hidden rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:inline-flex">STUDENT ACCOUNT</span></div>
            <Card className="border-border bg-card shadow-sm"><CardContent className="flex flex-col gap-7 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8"><div><p className="text-sm text-muted-foreground">Available balance</p><p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{formatCurrency(balance)}</p><p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><Sparkles className="h-4 w-4" />{points} reward points</p></div><Button onClick={() => setSelectedAction(ACTION_CARDS[0])} className="h-11 gap-2 px-5"><Plus className="h-4 w-4" />Make a payment</Button></CardContent></Card>
          </section>

          <section><div className="mb-4"><h2 className="text-lg font-semibold tracking-tight">Quick pay</h2><p className="mt-1 text-sm text-muted-foreground">Common campus payments, ready when you are.</p></div><div className="grid gap-3 sm:grid-cols-3">{ACTION_CARDS.map((action, idx) => <motion.button key={action.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} onClick={() => setSelectedAction(action)} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/60"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground"><action.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-medium">{action.title}</span><span className="mt-0.5 block text-sm text-muted-foreground">{formatCurrency(action.amount)} · {action.description}</span></span><ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></motion.button>)}</div></section>

          <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-semibold tracking-tight">Learning rewards</h2><p className="mt-1 text-sm text-muted-foreground">Use points for practical support in your studies.</p></div><span className="rounded-full border border-border px-3 py-1 text-xs font-medium">{points} pts available</span></div><div className="grid gap-3 sm:grid-cols-2">{CAMPUS_REWARDS.map((reward) => { const claimed = redeemedRewards.includes(reward.id); const affordable = points >= reward.points; return <Card key={reward.id} className="border-border shadow-sm"><CardContent className="flex h-full flex-col p-4"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background"><reward.icon className="h-5 w-5" /></span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{reward.points} pts</span></div><h3 className="mt-4 font-semibold">{reward.title}</h3><p className="mt-1 flex-1 text-sm text-muted-foreground">{reward.detail}</p><p className="mt-3 text-xs text-muted-foreground">Redeem at · {reward.partner}</p><Button className="mt-4 w-full" variant={claimed ? "secondary" : "default"} disabled={claimed || !affordable} onClick={() => handleClaimReward(reward)}>{claimed ? "Claimed" : affordable ? "Claim reward" : `Need ${reward.points - points} more pts`}</Button></CardContent></Card>; })}</div><p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Demo redemption tracking only. Actual availability and fulfilment depend on participating campus partners.</p></section>

          <section><div className="mb-4"><h2 className="text-lg font-semibold tracking-tight">Student partner offers</h2><p className="mt-1 text-sm text-muted-foreground">Tools and learning perks from programs students can apply to directly.</p></div><div className="grid gap-3 sm:grid-cols-2">{STUDENT_OFFERS.map((offer) => <Card key={offer.name} className="border-border shadow-sm"><CardContent className="flex h-full flex-col p-4"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background ${offer.color}`}><offer.icon className="h-6 w-6" aria-hidden="true" /></span><div><p className="font-semibold">{offer.name}</p><p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Student program</p></div></div><p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{offer.benefit}</p><p className="mt-3 text-xs text-muted-foreground">{offer.note}</p><a href={offer.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-secondary">Explore offer<ArrowUpRight className="h-4 w-4" /></a></CardContent></Card>)}</div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Independent programs, not live CampusPay tie-ups. Offers, eligibility, and terms are set by each provider; check their official pages before applying.</p></section>

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
