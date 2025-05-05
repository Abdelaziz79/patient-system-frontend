import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShareDialogProps } from "./types";
import {
  Loader2,
  Mail,
  Share2,
  FileCheck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ShareDialog({
  isShareDialogOpen,
  setIsShareDialogOpen,
  recipientEmail,
  setRecipientEmail,
  emailMessage,
  setEmailMessage,
  includeAttachment,
  setIncludeAttachment,
  handleShareViaEmail,
  isSharingViaEmail,
}: ShareDialogProps) {
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    const newErrors: { email?: string } = {};

    if (!recipientEmail) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(recipientEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleShareViaEmail();
    }
  };

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-700 dark:text-green-300 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Share Patient Information
          </DialogTitle>
          <DialogDescription>
            Share this patient's information securely via email
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-700 dark:text-amber-300 font-medium">
              Important Notice
            </AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-400 text-sm">
              Ensure you have proper consent before sharing patient information.
              All sharing activities are logged and audited.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label
              htmlFor="recipient"
              className="text-green-700 dark:text-green-400 font-medium flex items-center"
            >
              Recipient Email <span className="text-red-500 mx-1">*</span>
              <Mail className="h-3.5 w-3.5 mx-1 text-green-600" />
            </Label>
            <Input
              id="recipient"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              placeholder="recipient@example.com"
              className={`border-green-200 dark:border-green-900/50 focus:ring-green-400 ${
                errors.email ? "border-red-500 dark:border-red-800" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-3.5 w-3.5 mx-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-green-700 dark:text-green-400 font-medium"
            >
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Add a personal message to the recipient..."
              rows={4}
              className="resize-none border-green-200 dark:border-green-900/50 focus:ring-green-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add context or specific instructions for the recipient
            </p>
          </div>

          <div className="flex items-start gap-x-2 mt-2 bg-green-50/50 dark:bg-green-900/10 p-3 rounded-md border border-green-100 dark:border-green-900/30">
            <div className="pt-0.5">
              <Checkbox
                id="attachment"
                checked={includeAttachment}
                onCheckedChange={(checked) => setIncludeAttachment(!!checked)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="attachment"
                className="text-sm font-medium flex items-center cursor-pointer"
              >
                <FileCheck className="h-4 w-4 mx-1 text-green-600 dark:text-green-400" />
                Include patient data as PDF attachment
              </Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mx-5">
                Send a secure PDF with comprehensive patient information
              </p>
            </div>
          </div>

          <div className="flex items-start gap-x-2 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-900/30">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Secure Sharing
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                All patient data is encrypted during transit and recipients will
                need to authenticate before viewing
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            onClick={() => setIsShareDialogOpen(false)}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSharingViaEmail || !recipientEmail}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
          >
            {isSharingViaEmail ? (
              <>
                <Loader2 className="h-4 w-4 mx-2 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mx-2" />
                Share
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
