/* global location */

import { installUi } from "@jsxcad/ui-v1";

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    const bootstrap = async () => {
      const hash = location.hash.substring(1);
      const [workspace, path] = hash.split("@");
      await installUi({ document, workspace, path });
    };
    bootstrap();
  }
};
