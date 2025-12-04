"use client";

import EventList from "@/components/events/EventList";

export default function EventsPage() {
  const handleRefresh = () => {
    // In production, this could trigger additional actions
    // like analytics tracking, notifications, etc.
    // eslint-disable-next-line no-console
    console.log("Events refreshed from page level");
  };

  return <EventList onRefresh={handleRefresh} />;
}
