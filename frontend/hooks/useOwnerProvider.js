import { useContext } from "react";

import OwnerContext from "@/contexts/ownerProvider";

export default function useOwnerProvider() {
  const context = useContext(OwnerContext)

  if(!context) {
      throw new Error('useOwnerProvider must be used within a OwnerProvider')
  }
  return context
}