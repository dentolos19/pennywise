"use client";

import MessageView from "@/components/views/message-view";
import { account } from "@/lib/integrations/appwrite/main";
import { useEffect, useState } from "react";

export default function Page() {
  const [verified, setVerified] = useState<boolean | undefined>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setVerified(false);
    } else {
      account
        .updateVerification(userId, secret)
        .then(() => {
          setVerified(true);
        })
        .catch(() => {
          setVerified(false);
        });
    }
  }, []);

  switch (verified) {
    case true:
      return <MessageView title={"You're verified!"} message={"Congratulations! You are ready to roll!"} />;
    case false:
      return <MessageView title={"Failed to verify!"} message={"Sorry! Please try again at a later time."} />;
    default:
      return <MessageView title={"Verifying..."} />;
  }
}
