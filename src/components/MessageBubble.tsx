import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  translation?: string;
  isUser: boolean;
}

export const MessageBubble = ({ message, translation, isUser }: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex w-full animate-slide-up",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
        isUser 
          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground" 
          : "bg-card text-card-foreground border border-border/50"
      )}>
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{message}</p>
          {translation && (
            <>
              <div className={cn(
                "h-px w-full",
                isUser ? "bg-primary-foreground/20" : "bg-border"
              )} />
              <p className={cn(
                "text-sm leading-relaxed",
                isUser ? "text-primary-foreground/90" : "text-muted-foreground"
              )}>
                {translation}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};