"use client"

import type React from "react"

import { getNotificationsByUser, markAsRead, getNotificationColor } from "@/frontend/lib/notifications"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Check, ExternalLink, Bell } from "lucide-react"

interface NotificationListProps {
  userId: string
  onNotificationClick?: () => void
}

export function NotificationList({ userId, onNotificationClick }: NotificationListProps) {
  const notifications = getNotificationsByUser(userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markAsRead(notificationId)
    if (actionUrl) {
      window.location.href = actionUrl
    }
    onNotificationClick?.()
  }

  const handleMarkAsRead = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(notificationId)
    // In a real app, you'd trigger a re-render here
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No notifications yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
            !notification.isRead ? "bg-blue-50/50" : ""
          }`}
          onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {notification.title}
                </h4>
                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getNotificationColor(notification.type)}>
                  {notification.type.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {notification.actionUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
