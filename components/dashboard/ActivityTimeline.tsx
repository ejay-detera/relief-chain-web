import { CheckCircle2, Clock, XCircle } from "lucide-react";

import type { ActivityEvent } from "@/lib/platform/types";

const ICONS: Record<ActivityEvent["kind"], typeof CheckCircle2> = {
  approved: CheckCircle2,
  rejected: XCircle,
  pending: Clock,
  signup: Clock,
};

const ICON_STYLES: Record<ActivityEvent["kind"], string> = {
  approved: "text-primary",
  rejected: "text-red-600",
  pending: "text-accent",
  signup: "text-secondary",
};

type ActivityTimelineProps = {
  events: ActivityEvent[];
};

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-dark/50">No recent activity yet.</p>;
  }

  return (
    <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-dark/10">
      {events.map((event) => {
        const Icon = ICONS[event.kind];
        return (
          <div className="relative pl-10" key={event.id}>
            <span className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-muted">
              <Icon aria-hidden="true" className={ICON_STYLES[event.kind]} size={20} />
            </span>
            <p className="text-sm font-semibold text-secondary">{event.title}</p>
            <p className="text-sm text-dark/60">{event.description}</p>
            <p className="mt-1 font-mono text-[10px] uppercase text-dark/40">{event.occurredAt}</p>
          </div>
        );
      })}
    </div>
  );
}
