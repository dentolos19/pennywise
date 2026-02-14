import MessageView from "@/components/views/message-view";

export default function MissingParametersView() {
  return (
    <MessageView
      title={"Missing Parameters"}
      message={"Sorry! There is missing parameters on our end, we'll try to fix it soon!"}
    />
  );
}
