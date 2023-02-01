import { useContext } from "react";

import EventsContext from "@/contexts/eventsProvider";

export default function useEventsProvider() {
  const context = useContext(EventsContext)

  if(!context) {
      throw new Error('useEventsProvider must be used within a EventsProvider')
  }
  return context
}