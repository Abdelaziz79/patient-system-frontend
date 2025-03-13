import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  eventNotes: string;
  setEventNotes: (value: string) => void;
};

function GeneralTab({ eventNotes, setEventNotes }: Props) {
  return (
    <TabsContent value="general">
      <Card className="shadow-sm border border-gray-200 dark:border-slate-600 dark:bg-slate-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventNotes" className="font-medium">
                Notes
              </Label>
              <Textarea
                id="eventNotes"
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                placeholder="Detailed notes about this event"
                className="min-h-[200px] mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default GeneralTab;
