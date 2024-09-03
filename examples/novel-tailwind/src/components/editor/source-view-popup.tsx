import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';

interface SourceViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (newContent: string) => void;
}

export const SourceViewPopup: React.FC<SourceViewPopupProps> = ({
  isOpen,
  onClose,
  content,
  onContentChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Source Code</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full w-full">
          <pre className="p-4">
            <code dangerouslySetInnerHTML={{ __html: content }} />
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
