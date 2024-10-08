"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  useEditor,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { Separator } from "../ui/separator";
import { SourceViewPopup } from "./source-view-popup";
import hljs from 'highlight.js';

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onChange }) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [showSourceView, setShowSourceView] = useState(false);
  const [highlightedSource, setHighlightedSource] = useState("");

  const editor = useEditor({
    extensions,
    content: initialValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  const toggleSourceView = useCallback(() => {
    setShowSourceView((prev) => !prev);
  }, []);

  const highlightCodeblocks = useCallback((content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
    return new XMLSerializer().serializeToString(doc);
  }, []);

  useEffect(() => {
    if (editor && showSourceView) {
      const html = editor.getHTML();
      const highlighted = highlightCodeblocks(html);
      setHighlightedSource(highlighted);
    }
  }, [editor, showSourceView, highlightCodeblocks]);

  if (!editor) {
    return null;
  }

  return (
    <EditorRoot>
      <EditorContent
        editor={editor}
        className="border p-4 rounded-xl"
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          editor={editor}
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        >
          <button
            onClick={toggleSourceView}
            className="flex items-center justify-center px-3 py-1 font-medium hover:bg-accent"
            aria-label="Toggle source view"
          >
            View Source
          </button>
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
      <ImageResizer />
      {showSourceView && (
        <SourceViewPopup
          isOpen={showSourceView}
          onClose={() => setShowSourceView(false)}
          content={highlightedSource}
          onContentChange={(newContent) => {
            editor.commands.setContent(newContent);
            setHighlightedSource(highlightCodeblocks(newContent));
          }}
        />
      )}
    </EditorRoot>
  );
};

export default Editor;
