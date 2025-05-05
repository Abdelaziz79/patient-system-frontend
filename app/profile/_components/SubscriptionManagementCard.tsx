import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

// Props can be added later if needed (e.g., onUpgradeClick, onBillingClick)
// interface SubscriptionManagementCardProps {}

export function SubscriptionManagementCard(/* props: SubscriptionManagementCardProps */) {
  const handleUpgrade = () => {
    toast("Subscription upgrade options coming soon!");
    // Add navigation logic here later
  };

  const handleBilling = () => {
    toast("Billing history page coming soon!");
    // Add navigation logic here later
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-all duration-200"
          onClick={handleUpgrade}
        >
          <span>Upgrade to Premium</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
          onClick={handleBilling}
        >
          <span>View Billing History</span>
        </Button>
      </CardContent>
    </Card>
  );
}
