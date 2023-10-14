import { useEffect, useRef, useState } from 'react';
import styles from './EditQuoteModal.module.css';
import Spacer from './Spacer';

type Quote = {
  id: number;
  content: string;
};

type EditQuoteModalProps = {
  quote: Quote | null;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  isNew: boolean;
};

const EditQuoteModal: React.FC<EditQuoteModalProps> = ({ quote, onClose, onSave, isNew }) => {
  const [editedContent, setEditedContent] = useState<string>(quote!.content || '');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedContent]);

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isNew]);

  const handleSaveClick = () => {
    onSave(editedContent).then(() => {
      onClose();
    }).catch(error => {
      console.error("An error occurred while saving:", error);
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h1 className={styles.modalTitle}>Edit quote</h1>
        <Spacer height={20} />
        <div className={styles.modalContent}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
        </div>
        <Spacer height={20} />
        <div className={styles.modalActions}>
          <button className={styles.saveButton} onClick={handleSaveClick}>Save</button>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditQuoteModal;