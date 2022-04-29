import { useEffect } from "react";
import { activateAccount } from "services/logic/account-activation-logic";
import { getUrlCode, stringIsEmpty } from "services/shared/general";
import { showError, toastSubject } from "services/shared/toast-messages";

export default function AccountActivation() {
  useEffect(() => {
    const code = getUrlCode();
    if (!stringIsEmpty(code)) {
      activateAccount(code).then((result) => {
        if (result.status !== 200) {
          showError(toastSubject.invalidCode);
        }
      });
    }
  }, []);

  return null;
}
