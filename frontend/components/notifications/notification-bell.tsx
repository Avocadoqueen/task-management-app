"use client"

import { useState } from "react"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/frontend/components/ui/popover"
import { ScrollArea } from "@/frontend/components/ui/scroll-area"
import { Bell, CheckCheck } from "lucide-react"
import { NotificationList } from "./notification-list"
import { getUnreadNotifications, markAllAsRead } from "@/frontend/lib/notifications"
import { useAuth } from "@/contexts/auth-context"

export function NotificationBell() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const unreadNotifications = getUnreadNotifications(user.id)
  const unreadCount = unreadNotifications.length

  const handleMarkAllAsRead = () => {
    markAllAsRead(user.id)
    // In a real app, you'd trigger a re-render here
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          <NotificationList userId={user.id} onNotificationClick={() => setIsOpen(false)} />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
