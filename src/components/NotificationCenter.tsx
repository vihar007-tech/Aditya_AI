import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  AlertTriangle,
  FileText,
  DollarSign,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import { AppNotification } from '../types';
import { NotificationService } from '../server/services/studentToolkitService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    NotificationService.getNotifications()
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    const updated = NotificationService.markAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = NotificationService.markAllAsRead();
    setNotifications(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Campus Notifications
              </h3>
              <div className="text-[11px] text-slate-500 font-medium">
                {unreadCount} unread academic & campus alerts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {notifications.map(notif => {
            const Icon =
              notif.type === 'deadline' ? Calendar :
              notif.type === 'attendance' ? AlertTriangle :
              notif.type === 'fee' ? DollarSign :
              notif.type === 'event' ? Sparkles : FileText;

            return (
              <div
                key={notif.id}
                className={`pt-3 first:pt-0 flex items-start gap-3 transition-colors ${
                  !notif.isRead ? 'opacity-100' : 'opacity-65'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  notif.priority === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : notif.type === 'fee'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {notif.title}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.scheduledAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    {notif.actionTab && (
                      <button
                        onClick={() => {
                          onNavigateTab(notif.actionTab!);
                          handleMarkAsRead(notif.id);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                      >
                        <span>Open {notif.actionTab.charAt(0).toUpperCase() + notif.actionTab.slice(1)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {notif.actionUrl && (
                      <a
                        href={notif.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 font-medium ml-auto"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
          Aditya University Student Notification Dispatcher
        </div>
      </div>
    </div>
  );
};
