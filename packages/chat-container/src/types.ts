type Attachment = {
  name: string;
  url: string;
};

type Message = {
  attachments: Attachment[];
  message: string;
  variant: "primary" | "invisible";
  timestamp: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
};

type FzChatContainerProps = {
  messages: Message[];
  emptyMessage?: string;
  emptyMessageDescription?: string;
  waitingForResponseMessage?: string;
};

export { FzChatContainerProps };
