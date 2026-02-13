type Attachment = {
  /**
   * The name of the attachment
   */
  name: string;
  /**
   * The URL of the attachment
   */
  url: string;
};

export type Message = {
  /**
   * The attachments to display in the message
   */
  attachments: Attachment[];
  /**
   * The message to display in the message
   */
  message: string;
  /**
   * The variant of the message
   * @default 'invisible'
   * @remarks
   * - 'primary' for messages sent by the user
   * - 'invisible' for messages received from the user
   */
  variant: "primary" | "invisible";
  /**
   * The timestamp of the message
   */
  timestamp: string;
  /**
   * The user who sent the message
   * @type {object}
   * @property {string} firstName - The first name of the user
   * @property {string} lastName - The last name of the user
   * @property {string} avatar - The avatar of the user
   */
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
};

export type FzChatContainerProps = {
  /**
   * The messages to display in the chat container
   */
  messages: Message[];
  /**
   * The message to display when there are no messages
   */
  emptyMessage?: string;
  /**
   * The description to display when there are no messages
   */
  emptyMessageDescription?: string;
  /**
   * The message to display when the last message is from the sender
   */
  waitingForResponseMessage?: string;
};
