import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

const recentActivities = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    initials: "OM"
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    initials: "JL"
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    initials: "IN"
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    initials: "WK"
  }
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity) => (
        <div key={activity.email} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.email}
            </p>
          </div>
          <div className="ml-auto font-medium">{activity.amount}</div>
        </div>
      ))}
    </div>
  )
}