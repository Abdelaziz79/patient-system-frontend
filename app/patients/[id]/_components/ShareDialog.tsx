import { Button } from "@/components/ui/button";
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
  return (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Patient Data</DialogTitle>
          <DialogDescription>
            Share patient information via email with another healthcare
            provider.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Enter a message to include with the patient data..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-attachment"
              checked={includeAttachment}
              onChange={(e) => setIncludeAttachment(e.target.checked)}
              className="rounded border-gray-300 focus:ring-green-500"
            />
            <Label htmlFor="include-attachment">Include PDF Attachment</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleShareViaEmail}
            disabled={isSharingViaEmail || !recipientEmail}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSharingViaEmail ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
