import { Bell, Gift, Smartphone, Tag, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: "offer",
      icon: Gift,
      color: "bg-green-500",
      title: "Special Discount!",
      message: "Get 15% off on all Samsung accessories this week only.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "product",
      icon: Smartphone,
      color: "bg-blue-500",
      title: "New Arrival",
      message: "OnePlus 12 5G is now available in stock!",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "promo",
      icon: Tag,
      color: "bg-accent",
      title: "Flash Sale Tomorrow!",
      message: "Don't miss our biggest sale of the month. Up to 30% off on selected items.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "reminder",
      icon: Clock,
      color: "bg-yellow-500",
      title: "Order Reminder",
      message: "You have items in your cart. Complete your purchase before they're gone!",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "success",
      icon: CheckCircle,
      color: "bg-emerald-500",
      title: "Welcome to MStar!",
      message: "Thank you for joining MStar Mobile. Explore our latest products and offers!",
      time: "3 days ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-card rounded-2xl p-4 shadow-elegant flex items-start gap-4 transition-all hover:shadow-deep ${
              !notification.read ? "border-l-4 border-l-accent" : ""
            }`}
          >
            <div className={`w-12 h-12 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              <notification.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {notification.time}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{notification.message}</p>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="bg-card rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! Check back later for updates and offers.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
