import { Annotation } from "@/types/annotations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck, XCircle, Maximize2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewDetailPanelProps {
  annotation: Annotation | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onImageClick: (url: string) => void;
  onBack?: () => void;
}

export function ReviewDetailPanel({
  annotation,
  onApprove,
  onReject,
  onImageClick,
  onBack,
}: ReviewDetailPanelProps) {
  if (!annotation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground border-l border-border bg-muted/10 p-6">
        <div className="text-center">
          <p className="text-lg font-medium">No Meme Selected</p>
          <p className="text-sm">Select a meme from the list to view details.</p>
        </div>
      </div>
    );
  }

  const isPending = annotation.status === "Pending";

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
        {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        )}
        <div>
           <h2 className="text-lg font-semibold flex items-center gap-2">
            Meme Details
            <Badge variant={
                annotation.status === "Approved" ? "default" : 
                annotation.status === "Rejected" ? "destructive" : "outline"
            }>
                {annotation.status}
            </Badge>
           </h2>
           <p className="text-xs text-muted-foreground font-mono mt-1">{annotation.id}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Image Section */}
          <div className="relative group rounded-lg overflow-hidden border border-border bg-black/5">
             <img
                src={annotation.memeUrl}
                alt="Selected Meme"
                className="w-full h-auto max-h-[500px] object-contain mx-auto"
             />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 <Button 
                    variant="secondary" 
                    size="sm" 
                    className="pointer-events-auto gap-2"
                    onClick={() => onImageClick(annotation.memeUrl)}
                 >
                    <Maximize2 className="h-4 w-4" />
                    View Full Screen
                 </Button>
             </div>
          </div>

          {/* Text Content */}
          <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Description / Text</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {annotation.explanation || "No description provided."}
                </p>
            </CardContent>
          </Card>
          
          {/* Metadata if needed */}
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="p-3 rounded-md bg-muted/30">
                <span className="block text-xs text-muted-foreground mb-1">Meme ID</span>
                <span className="font-mono">{annotation.memeId || "N/A"}</span>
             </div>
             <div className="p-3 rounded-md bg-muted/30">
                <span className="block text-xs text-muted-foreground mb-1">Created At</span>
                <span>{new Date().toLocaleDateString()}</span> {/* Placeholder if date not in types */}
             </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Footer */}
      {isPending && (
        <div className="p-4 border-t border-border bg-background mt-auto sticky bottom-0">
          <div className="grid grid-cols-2 gap-3">
             <Button
                variant="destructive"
                className="w-full"
                onClick={() => onReject(annotation.id)}
             >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
             </Button>
             <Button
                variant="default"
                className="w-full"
                onClick={() => onApprove(annotation.id)}
             >
                <CheckCheck className="w-4 h-4 mr-2" />
                Approve
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
