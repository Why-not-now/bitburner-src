import React, { useEffect } from "react";

interface IProps {
  onKeyDown: (this: Document, event: KeyboardEvent) => void;
  onFailure: (options?: { automated: boolean }) => void;
}

export function KeyHandler(props: IProps): React.ReactElement {
  useEffect(() => {
    console.log("binding");
    function press(this: Document, event: KeyboardEvent): void {
      console.log("press!");
      const f = props.onKeyDown.bind(this);
      f(event);
    }
    document.addEventListener("keydown", press);
    return () => document.removeEventListener("keydown", press);
  });

  // invisible autofocused element that eats all the keypress for the minigames.
  return <></>;
}
