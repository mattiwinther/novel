import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/tailwind/ui/button";

const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      
      //console.log("Text copied to clipboard: ", textToCopy);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button size="xs" className="px-2" onClick={handleCopy} aria-label="Copy to clipboard">
      <Copy className="h-4 w-4" />
    </Button>
  );
};

export default CopyButton;
