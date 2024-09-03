import React, { useState } from 'react';

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
  const [localContent, setLocalContent] = useState(content);

  if (!isOpen) return null;

  const handleSave = () => {
    onContentChange(localContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Source View</h2>
        <textarea
          className="w-full h-64 p-2 border rounded mb-4"
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          aria-label="HTML Source"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
