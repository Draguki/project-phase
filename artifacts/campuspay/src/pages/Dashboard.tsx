import { useState } from "react";
import { useWallet, TransactionCategory } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, LogOut, GraduationCap, Printer, Coffee, 
  ArrowRightLeft, Clock, Sparkles 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ACTION_CARDS = [
  {
    id: "fees",
    title: "Pay Fees",
    description: "Semester dues",
    icon: GraduationCap,
    amount: 500,
    points: 10,
    category: "fees" as TransactionCategory,
    color: "from-blue-500/20 to-blue-600/20 text-blue-500"
  },
  {
    id: "print",
    title: "Print Lab",
    description: "Library printing",
    icon: Printer,
    amount: 20,
    points: 1,
    category: "print" as TransactionCategory,
    color: "from-purple-500/20 to-purple-600/20 text-purple-500"
  },
  {
    id: "food",
    title: "Cafeteria",
    description: "Buy a meal",
    icon: Coffee,
    amount: 100,
    points: 5,
    category: "food" as TransactionCategory,
    color: "from-orange-500/20 to-orange-600/20 text-orange-500"
  }
];

export default function Dashboard() {
  const { username, balance, points, transactions, logout, transact } = useWallet();
  const [selectedAction, setSelectedAction] = useState<typeof ACTION_CARDS[0] | null>(null);

  const handleTransact = () => {
    if (!selectedAction) return;
    
    try {
      transact(selectedAction.amount, selectedAction.points, selectedAction.category, selectedAction.title);
      toast.success(`Payment Successful! +${selectedAction.points} Points Earned`, {
        icon: <Sparkles className="h-4 w-4 text-primary" />
      });
      setSelectedAction(null);
    } catch (e: any) {
      toast.error(e.message || "Transaction failed");
      setSelectedAction(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fees': return <GraduationCap className="h-4 w-4" />;
      case 'print': return <Printer className="h-4 w-4" />;
      case 'food': return <Coffee className="h-4 w-4" />;
      default: return <ArrowRightLeft className="h-4 w-4" />;
    }
  };

  const progressPercentage = Math.min((points / 100) * 100, 100);

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground pb-20 md:pb-0">
      {/* Mobile/Desktop Container wrapper */}
      <div className="max-w-md mx-auto md:border-x md:border-border/40 min-h-[100dvh] relative shadow-2xl bg-card/20 md:bg-background">
        
        {/* Header */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-lg">CampusPay</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
              <span className="text-xs font-semibold text-primary">{username?.charAt(0).toUpperCase()}</span>
            </div>
            <button onClick={logout} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="p-6 space-y-8">
          
          {/* Hero Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-gray-900 to-slate-900">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <CardContent className="p-8 relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Current Balance</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <motion.h2 
                    key={balance}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-serif font-bold text-white tracking-tight"
                  >
                    {formatCurrency(balance)}
                  </motion.h2>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Cardholder</span>
                    <span className="text-sm font-medium text-white truncate max-w-[120px]">{username}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400">Reward Points</span>
                    <motion.div 
                      key={points}
                      initial={{ scale: 1.2, color: 'var(--primary)' }}
                      animate={{ scale: 1, color: 'var(--primary)' }}
                      className="text-sm font-bold flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      {points} pts
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Quick Transfer</h3>
            <div className="grid grid-cols-3 gap-4">
              {ACTION_CARDS.map((action, idx) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.1) }}
                  onClick={() => setSelectedAction(action)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${action.color} border border-border/50 shadow-lg group-hover:scale-105 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">{action.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(action.amount)}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Rewards Progress */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Free Coffee Reward</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{points}/100 pts</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-secondary" indicatorColor="bg-primary" />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {points >= 100 ? "Reward ready to claim!" : `Earn ${100 - points} more points for a free coffee at the cafe.`}
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Transactions */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
            </div>
            
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-10 bg-card/30 rounded-2xl border border-dashed border-border">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                transactions.map((txn, idx) => (
                  <motion.div 
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.05) }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                        {getCategoryIcon(txn.category)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.merchant}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat('en-IN', { 
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                          }).format(new Date(txn.timestamp))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold font-mono tracking-tight">- {formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-primary font-medium flex items-center justify-end gap-1 mt-0.5">
                        <Sparkles className="h-2.5 w-2.5" />
                        +{txn.points}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>

        </main>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Confirm Payment</DialogTitle>
            <DialogDescription>
              You are about to make a payment to {selectedAction?.title}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAction && (
            <div className="my-6 p-6 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${selectedAction.color} mb-4 shadow-xl`}>
                <selectedAction.icon className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm">{selectedAction.description}</p>
              <p className="text-4xl font-serif font-bold text-foreground mt-2">{formatCurrency(selectedAction.amount)}</p>
              <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <Sparkles className="h-3 w-3" />
                Earn {selectedAction.points} points
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSelectedAction(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleTransact} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
