import React, { useState } from 'react';
import { Student } from '../../types';
import { generatePrefilledWhatsAppMessage, generateWhatsAppUrl } from '../../utils/rules';
import { X, MessageSquare, ExternalLink, Send } from 'lucide-react';

interface WhatsAppModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'payment_reminder' | 'expiry_reminder' | 'custom';
  defaultTherapyName?: string;
  defaultAmount?: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  student,
  isOpen,
  onClose,
  defaultType = 'payment_reminder',
  defaultTherapyName = 'Psychology',
  defaultAmount = 800
}) => {
  const [reminderType, setReminderType] = useState<'payment_reminder' | 'expiry_reminder' | 'custom'>(defaultType);
  const [therapyName, setTherapyName] = useState(defaultTherapyName);
  const [amount, setAmount] = useState(defaultAmount);
  const [customText, setCustomText] = useState('');

  if (!isOpen || !student) return null;

  const generatedMessage = generatePrefilledWhatsAppMessage(reminderType, {
    studentName: student.fullName,
    parentName: student.parentName,
    therapyName,
    amount,
    dueDate: 'this week',
    expiryDate: 'end of this month',
    customMsg: customText
  });

  const waUrl = generateWhatsAppUrl(student.parentPhone, generatedMessage);

  const handleOpenWhatsApp = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-800 text-emerald-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Send WhatsApp Notification</h3>
              <p className="text-xs text-emerald-100">Click-to-chat with pre-filled message template</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Target Parent Info */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium">Recipient Parent:</span>
              <p className="font-bold text-slate-900 text-sm">{student.parentName} ({student.fullName})</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium">WhatsApp Number:</span>
              <p className="font-mono font-bold text-emerald-700">{student.parentPhone}</p>
            </div>
          </div>

          {/* Template Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Message Template</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReminderType('payment_reminder')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  reminderType === 'payment_reminder'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Payment Reminder
              </button>

              <button
                type="button"
                onClick={() => setReminderType('expiry_reminder')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  reminderType === 'expiry_reminder'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Package Expiry
              </button>

              <button
                type="button"
                onClick={() => setReminderType('custom')}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  reminderType === 'custom'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {/* Dynamic Template Options */}
          {reminderType === 'payment_reminder' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Therapy</label>
                <input
                  type="text"
                  value={therapyName}
                  onChange={e => setTherapyName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {reminderType === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Message Body</label>
              <textarea
                rows={3}
                placeholder="Type your custom message for the parent..."
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Generated Message Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message Preview</label>
            <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto font-sans">
              {generatedMessage}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            ℹ️ Clicking Send will open WhatsApp Web or the WhatsApp app in a new tab with this pre-filled message. You can review before sending.
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="px-5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Launch WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
