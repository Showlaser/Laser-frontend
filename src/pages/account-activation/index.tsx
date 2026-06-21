import { useEffect } from "react";
import { activateAccount } from "services/logic/account-activation-logic";
import { getUrlCode, stringIsEmpty } from "services/shared/general";
import paths from "services/shared/router-paths";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function AccountActivation() {
  useEffect(() => {
    const code = getUrlCode();
    if (!stringIsEmpty(code)) {
      activateAccount(code).then((result) => {
        if (result?.status !== 200) {
          showError(toastSubject.invalidCode);
        } else if (result.status === 200) {
          window.location.href = paths.Login;
        }
      });
    }
  }, []);

  return null;
}
