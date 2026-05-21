import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminSupportPanel = ({ tickets, onRefresh }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      await api.post(`/support/${selected._id}/reply`, { text: reply });
      toast.success(t('admin.replySent'));
      setReply('');
      onRefresh();
      const { data } = await api.get(`/support/ticket/${selected._id}`);
      setSelected(data);
    } catch {
      toast.error(t('admin.replyFailed'));
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {tickets.map((ticket) => (
          <button
            key={ticket._id}
            type="button"
            onClick={async () => {
              const { data } = await api.get(`/support/ticket/${ticket._id}`);
              setSelected(data);
            }}
            className={`card w-full p-3 text-left text-sm ${selected?._id === ticket._id ? 'ring-2 ring-primary-500' : ''}`}
          >
            <p className="font-medium">{ticket.user?.name}</p>
            <p className="text-gray-500 truncate">{ticket.messages[ticket.messages.length - 1]?.text || t('admin.voiceImage')}</p>
            <span className="text-xs capitalize text-primary-600">{ticket.status}</span>
          </button>
        ))}
      </div>
      <div className="lg:col-span-2 card flex flex-col min-h-[400px]">
        {selected ? (
          <>
            <div className="border-b p-3 font-medium">{selected.user?.name} — {selected.subject}</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
              {selected.messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.sender === 'user' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-primary-600 text-white'}`}>
                    {m.text && <p>{m.text}</p>}
                    {m.audioData && <audio controls src={m.audioData} className="mt-1 max-w-full" />}
                    {m.imageData && <img src={m.imageData} alt="attachment" className="mt-2 max-h-32 rounded" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <input className="input-field flex-1" placeholder={t('admin.replyPlaceholder')} value={reply} onChange={(e) => setReply(e.target.value)} />
              <button type="button" onClick={sendReply} className="btn-primary">{t('admin.send')}</button>
            </div>
          </>
        ) : (
          <p className="flex flex-1 items-center justify-center text-gray-500">{t('admin.selectTicket')}</p>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPanel;
